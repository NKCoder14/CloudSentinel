
import pytest
from pydantic import ValidationError

from app.processing.schemas import CloudSnapshotInput, CloudResource


def test_valid_snapshot():
    data = {
        "provider": "aws",
        "resources": [
            {
                "resource_id": "bucket-001",
                "resource_type": "AWS::S3::Bucket",
                "resource_name": "company-data",
                "region": "ap-south-1",
                "configuration": {
                    "public_access": True,
                    "encryption_enabled": False,
                },
            }
        ],
    }

    snapshot = CloudSnapshotInput.model_validate(data)

    assert snapshot.provider == "aws"
    assert len(snapshot.resources) == 1
    assert snapshot.resources[0].resource_name == "company-data"


def test_invalid_provider():
    data = {
        "provider": "azure",
        "resources": [],
    }

    with pytest.raises(ValidationError):
        CloudSnapshotInput.model_validate(data)


def test_missing_resource_id():
    data = {
        "provider": "aws",
        "resources": [
            {
                "resource_type": "AWS::S3::Bucket",
                "resource_name": "company-data",
                "configuration": {},
            }
        ],
    }

    with pytest.raises(ValidationError):
        CloudSnapshotInput.model_validate(data)


def test_unsupported_resource_type():
    data = {
        "provider": "aws",
        "resources": [
            {
                "resource_id": "db-001",
                "resource_type": "AWS::RDS::DBInstance",
                "resource_name": "company-db",
                "configuration": {},
            }
        ],
    }

    with pytest.raises(ValidationError):
        CloudSnapshotInput.model_validate(data)


def test_canonical_resource():
    data = {
        "resource_id": "bucket-001",
        "resource_type": "AWS::S3::Bucket",
        "resource_name": "company-data",
        "provider": "aws",
        "region": "ap-south-1",
        "configuration": {"public_access": True},
        "raw_configuration": {"original": "configuration"},
    }

    resource = CloudResource.model_validate(data)

    assert resource.provider == "aws"
    assert resource.configuration["public_access"] is True
