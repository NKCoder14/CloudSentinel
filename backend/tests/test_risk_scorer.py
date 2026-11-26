from app.security_engine.risk_scorer import RiskScorer
from app.security_engine.finding import Finding


def create_finding(severity):
    return Finding(
        rule_id="TEST-001",
        resource_id="resource-001",
        title="Test Finding",
        severity=severity,
        description="Test description",
        evidence={},
        recommendation="Test recommendation",
    )


def test_empty_findings_score_zero():
    scorer = RiskScorer()
    assert scorer.calculate_score([]) == 0


def test_critical_finding_score():
    scorer = RiskScorer()
    findings = [create_finding("CRITICAL")]

    assert scorer.calculate_score(findings) == 100


def test_high_finding_score():
    scorer = RiskScorer()
    findings = [create_finding("HIGH")]

    assert scorer.calculate_score(findings) == 70


def test_multiple_findings_score():
    scorer = RiskScorer()
    findings = [
        create_finding("CRITICAL"),
        create_finding("HIGH"),
    ]

    assert scorer.calculate_score(findings) == 85


def test_risk_levels():
    scorer = RiskScorer()

    assert scorer.get_risk_level(90) == "CRITICAL"
    assert scorer.get_risk_level(70) == "HIGH"
    assert scorer.get_risk_level(40) == "MEDIUM"
    assert scorer.get_risk_level(10) == "LOW"