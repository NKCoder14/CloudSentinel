from app.ai_assistant.nemotron import process_findings_report

findings = [
    {
        "rule_id": "S3-001",
        "resource_id": "bucket-001",
        "title": "Public S3 Bucket",
        "severity": "HIGH",
        "description": "The S3 bucket allows public access.",
        "recommendation": "Disable public access.",
        "evidence": {"public_access": True},
    },
    {
        "rule_id": "IAM-002",
        "resource_id": "policy-001",
        "title": "Unrestricted IAM Policy",
        "severity": "CRITICAL",
        "description": "The IAM policy allows unrestricted actions.",
        "recommendation": "Apply least-privilege permissions.",
        "evidence": {"action": "*", "resource": "*"},
    },
]

report = process_findings_report(findings)

print(report)