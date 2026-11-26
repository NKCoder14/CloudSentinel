
import json
import tempfile
import uuid
from pathlib import Path
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from api.models import Scan, FindingRecord
from app.security_engine.scan_service import ScanService
from app.ai_assistant.nemotron import analyze_findings, summarize_findings


def serialize_finding(finding):
    return {
        "id": finding.id,
        "rule_id": finding.rule_id,
        "resource_id": finding.resource_id,
        "title": finding.title,
        "severity": finding.severity,
        "description": finding.description,
        "evidence": finding.evidence,
        "recommendation": finding.recommendation,
    }


def serialize_scan(scan, include_findings=False):
    data = {
        "scan_id": str(scan.scan_id),
        "provider": scan.provider,
        "status": scan.status,
        "total_resources": scan.total_resources,
        "total_findings": scan.total_findings,
        "critical_count": scan.critical_count,
        "high_count": scan.high_count,
        "medium_count": scan.medium_count,
        "low_count": scan.low_count,
        "risk_score": scan.risk_score,
        "risk_level": scan.risk_level,
        "scanned_at": scan.scanned_at.isoformat(),
    }

    if include_findings:
        data["findings"] = [
            serialize_finding(finding)
            for finding in scan.findings.all()
        ]

    return data


@api_view(["GET", "POST"])
def run_security_scan(request):
    """
    POST: Run a security scan and save its results.
    GET: Retrieve all previous scans.
    """

    if request.method == "GET":
        scans = Scan.objects.all().order_by("-scanned_at")

        return Response([
            serialize_scan(scan)
            for scan in scans
        ])

    if not isinstance(request.data, dict):
        return Response(
            {"error": "Expected a JSON object."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    temp_path = None

    try:
        with tempfile.NamedTemporaryFile(
            mode="w",
            suffix=".json",
            encoding="utf-8",
            delete=False,
        ) as temp_file:
            json.dump(request.data, temp_file)
            temp_path = Path(temp_file.name)

        result = ScanService().run_scan(temp_path)

        scan = Scan.objects.create(
            scan_id=uuid.UUID(result.scan_id),
            provider=result.provider,
            status=result.status,
            total_resources=result.total_resources,
            total_findings=result.total_findings,
            critical_count=result.critical_count,
            high_count=result.high_count,
            medium_count=result.medium_count,
            low_count=result.low_count,
            risk_score=result.risk_score,
            risk_level=result.risk_level,
        )

        FindingRecord.objects.bulk_create([
            FindingRecord(
                scan=scan,
                rule_id=f.rule_id,
                resource_id=f.resource_id,
                title=f.title,
                severity=f.severity,
                description=f.description,
                evidence=f.evidence,
                recommendation=f.recommendation,
            )
            for f in result.findings
        ])

        return Response(
            result.model_dump(mode="json"),
            status=status.HTTP_200_OK,
        )

    except Exception as error:
        return Response(
            {"error": str(error)},
            status=status.HTTP_400_BAD_REQUEST,
        )

    finally:
        if temp_path and temp_path.exists():
            temp_path.unlink()


@api_view(["GET"])
def get_scan_detail(request, scan_id):
    """
    Retrieve one scan with all its findings.
    """

    try:
        scan = Scan.objects.get(scan_id=scan_id)

    except Scan.DoesNotExist:
        return Response(
            {"error": "Scan not found."},
            status=status.HTTP_404_NOT_FOUND,
        )

    return Response(
        serialize_scan(scan, include_findings=True),
        status=status.HTTP_200_OK,
    )


@api_view(["POST"])
def analyze_scan_with_ai(request, scan_id):
    """
    Generate optional Nemotron analysis for:
    1. One existing finding belonging to this scan.
    2. All existing findings belonging to this scan.

    AI never creates findings or changes their severity.
    """

    # Validate requested scan
    try:
        scan = Scan.objects.get(scan_id=scan_id)

    except (Scan.DoesNotExist, ValueError):
        return Response(
            {
                "status": "failed",
                "error": "Scan not found.",
            },
            status=status.HTTP_404_NOT_FOUND,
        )

    # Validate request body
    if not isinstance(request.data, dict):
        return Response(
            {
                "status": "failed",
                "error": "Expected a JSON object.",
            },
            status=status.HTTP_400_BAD_REQUEST,
        )

    scope = request.data.get("scope")

    # Finding-level AI explanation
    if scope == "finding":
        rule_id = request.data.get("rule_id")
        resource_id = request.data.get("resource_id")

        if not rule_id:
            return Response(
                {
                    "status": "failed",
                    "error": "rule_id is required.",
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        finding = scan.findings.filter(
            rule_id=rule_id,
            resource_id=resource_id,
        ).first()

        if finding is None:
            return Response(
                {
                    "status": "failed",
                    "error": "Finding not found in this scan.",
                },
                status=status.HTTP_404_NOT_FOUND,
            )

        try:
            results = analyze_findings([
                serialize_finding(finding)
            ])

            if not results:
                return Response(
                    {
                        "status": "failed",
                        "error": "Nemotron returned no analysis.",
                    },
                    status=status.HTTP_502_BAD_GATEWAY,
                )

            analysis = results[0]

            if analysis.get("status") != "success":
                return Response(
                    {
                        "status": "failed",
                        "error": analysis.get(
                            "error",
                            "Unable to generate AI explanation.",
                        ),
                    },
                    status=status.HTTP_503_SERVICE_UNAVAILABLE,
                )

            return Response(
                {
                    "status": "success",
                    "ai_analysis": analysis.get("ai_analysis"),
                },
                status=status.HTTP_200_OK,
            )

        except Exception:
            return Response(
                {
                    "status": "failed",
                    "error": "AI explanation is temporarily unavailable. Please try again.",
                },
                status=status.HTTP_503_SERVICE_UNAVAILABLE,
            )

    # Scan-level AI summary
    elif scope == "summary":
        findings = [
            serialize_finding(finding)
            for finding in scan.findings.all()
        ]

        if not findings:
            return Response(
                {
                    "status": "failed",
                    "error": "This scan has no findings to summarize.",
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            result = summarize_findings(findings)

            if result.get("status") != "success":
                return Response(
                    {
                        "status": "failed",
                        "error": result.get(
                            "error",
                            "Unable to generate AI summary.",
                        ),
                    },
                    status=status.HTTP_503_SERVICE_UNAVAILABLE,
                )

            return Response(
                {
                    "status": "success",
                    "ai_analysis": result.get("ai_analysis"),
                },
                status=status.HTTP_200_OK,
            )

        except Exception:
            return Response(
                {
                    "status": "failed",
                    "error": "AI summary is temporarily unavailable. Please try again.",
                },
                status=status.HTTP_503_SERVICE_UNAVAILABLE,
            )

    # Unsupported scope
    return Response(
        {
            "status": "failed",
            "error": "Invalid scope. Use 'finding' or 'summary'.",
        },
        status=status.HTTP_400_BAD_REQUEST,
    )