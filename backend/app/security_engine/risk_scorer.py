class RiskScorer:
    SEVERITY_WEIGHTS = {
        "CRITICAL": 10,
        "HIGH": 7,
        "MEDIUM": 4,
        "LOW": 1,
    }

    MAX_SCORE = 100

    def calculate_score(self, findings):
        if not findings:
            return 0

        total_weight = sum(
            self.SEVERITY_WEIGHTS[finding.severity]
            for finding in findings
        )

        raw_score = total_weight / (len(findings) * 10) * 100

        return round(min(raw_score, self.MAX_SCORE), 2)

    def get_risk_level(self, score):
        if score >= 80:
            return "CRITICAL"
        elif score >= 60:
            return "HIGH"
        elif score >= 30:
            return "MEDIUM"
        return "LOW"