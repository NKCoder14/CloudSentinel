from app.processing.schemas import CloudSnapshotInput
from app.processing.resource_extractor import extract_resources


def test_extract_multiple_resources():
    data = {
        "provider": "aws",
        "resources": [
            {
                "resource_id": "bucket-001",
                "resource_type": "AWS::S3::Bucket",
                "resource_name": "company-data",
                "configuration": {},
            },
            {
                "resource_id": "sg-001",
                "resource_type": "AWS::EC2::SecurityGroup",
                "resource_name": "web-server",
                "configuration": {},
            },
        ],
    }

    snapshot = CloudSnapshotInput.model_validate(data)

    resources = extract_resources(snapshot)

    assert len(resources) == 2
    assert resources[0].resource_id == "bucket-001"
    assert resources[1].resource_id == "sg-001"


def test_extract_empty_snapshot():
    snapshot = CloudSnapshotInput.model_validate({
        "provider": "aws",
        "resources": [],
    })

    resources = extract_resources(snapshot)

    assert resources == []