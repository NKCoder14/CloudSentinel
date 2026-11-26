from pathlib import Path

from app.security_engine.scan_service import ScanService


def test_scan_service_processes_vulnerable_snapshot():
    project_root = Path(__file__).resolve().parents[2]
    file_path = project_root / "sample_data" / "vulnerable_config.json"

    result = ScanService().run_scan(file_path)

    assert result.status == "COMPLETED"
    assert result.total_resources == 3
    assert result.total_findings == 5
    assert result.critical_count == 1
    assert result.high_count == 4
    assert result.risk_score == 76
    assert len(result.findings) == 5