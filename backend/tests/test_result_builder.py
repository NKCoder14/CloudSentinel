from app.security_engine.result_builder import ScanResultBuilder


def test_build_empty_scan_result():
    result = ScanResultBuilder().build([], [])

    assert result.total_resources == 0
    assert result.total_findings == 0
    assert result.risk_score == 0
    assert result.risk_level == "LOW"


def test_build_scan_result_counts():
    from app.security_engine.finding import Finding

    finding = Finding(
        rule_id="TEST-001",
        resource_id="resource-001",
        title="Test finding",
        severity="CRITICAL",
        description="Test description",
        evidence={},
        recommendation="Test recommendation",
    )

    result = ScanResultBuilder().build([object()], [finding])

    assert result.total_resources == 1
    assert result.total_findings == 1
    assert result.critical_count == 1
    assert result.risk_score == 100
    assert result.risk_level == "CRITICAL"