
from datetime import datetime, timezone

from app.processing.schemas import SnapshotResourceInput
from app.processing.normalizer import normalize_resource


def test_normalize_s3_resource():
    resource = SnapshotResourceInput.model_validate({
        "resource_id": "bucket-001",
        "resource_type": "AWS::S3::Bucket",
        "resource_name": "company-data",
        "region": "ap-south-1",
        "configuration": {
            "public_access": True,
            "encryption_enabled": False,
        },
    })

    normalized = normalize_resource(resource)

    assert normalized.resource_id == "bucket-001"
    assert normalized.provider == "aws"
    assert normalized.configuration["public_access"] is True
    assert normalized.raw_configuration["resource_name"] == "company-data"
    assert normalized.collected_at is not None


def test_normalize_with_fixed_timestamp():
    resource = SnapshotResourceInput.model_validate({
        "resource_id": "sg-001",
        "resource_type": "AWS::EC2::SecurityGroup",
        "resource_name": "web-server",
        "configuration": {},
    })

    timestamp = datetime(2026, 11, 25, tzinfo=timezone.utc)

    normalized = normalize_resource(
        resource,
        collected_at=timestamp,
    )

    assert normalized.collected_at == timestamp
    assert normalized.region is None