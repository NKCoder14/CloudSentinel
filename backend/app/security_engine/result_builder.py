import uuid

from app.security_engine.scan_result import ScanResult
from app.security_engine.risk_scorer import RiskScorer


class ScanResultBuilder:

    def __init__(self):
        self.risk_scorer = RiskScorer()

    def build(self, resources, findings):

        severity_counts = {
            "CRITICAL": 0,
            "HIGH": 0,
            "MEDIUM": 0,
            "LOW": 0,
        }

        for finding in findings:
            severity_counts[finding.severity] += 1

        risk_score = self.risk_scorer.calculate_score(findings)
        risk_level = self.risk_scorer.get_risk_level(risk_score)

        return ScanResult(
            scan_id=str(uuid.uuid4()),
            total_resources=len(resources),
            total_findings=len(findings),
            critical_count=severity_counts["CRITICAL"],
            high_count=severity_counts["HIGH"],
            medium_count=severity_counts["MEDIUM"],
            low_count=severity_counts["LOW"],
            risk_score=risk_score,
            risk_level=risk_level,
            findings=findings,
        )