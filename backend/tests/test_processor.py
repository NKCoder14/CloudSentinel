from pathlib import Path

from app.processing.processor import process_snapshot


def test_process_vulnerable_snapshot():
    project_root = Path(__file__).resolve().parents[2]

    file_path = (
        project_root
        / "sample_data"
        / "vulnerable_config.json"
    )

    resources = process_snapshot(file_path)

    assert len(resources) == 3

    assert resources[0].resource_type == "AWS::S3::Bucket"
    assert resources[1].resource_type == "AWS::EC2::SecurityGroup"
    assert resources[2].resource_type == "AWS::IAM::Policy"

    assert resources[0].configuration["public_access"] is True

    assert resources[1].configuration["inbound_rules"][0]["port"] == 22


def test_process_empty_snapshot(tmp_path):
    file_path = tmp_path / "empty.json"

    file_path.write_text(
        '{"provider": "aws", "resources": []}',
        encoding="utf-8",
    )

    resources = process_snapshot(file_path)

    assert resources == []