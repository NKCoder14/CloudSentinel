import pytest
from pydantic import ValidationError

from app.security_engine.finding import Finding
from app.security_engine.evidence import Evidence


def valid_finding_data():
    return {
        "rule_id": "S3-001",
        "resource_id": "bucket-001",
        "title": "Public S3 bucket",
        "severity": "HIGH",
        "description": "The S3 bucket allows public access.",
        "evidence": {
            "public_access": True
        },
        "recommendation": "Disable public access.",
    }


def test_valid_finding():
    finding = Finding.model_validate(valid_finding_data())

    assert finding.rule_id == "S3-001"
    assert finding.severity == "HIGH"


def test_invalid_severity():
    data = valid_finding_data()
    data["severity"] = "URGENT"

    with pytest.raises(ValidationError):
        Finding.model_validate(data)


def test_missing_required_field():
    data = valid_finding_data()
    del data["resource_id"]

    with pytest.raises(ValidationError):
        Finding.model_validate(data)


def test_unexpected_field():
    data = valid_finding_data()
    data["unknown_field"] = "unexpected"

    with pytest.raises(ValidationError):
        Finding.model_validate(data)


def test_valid_evidence():
    evidence = Evidence.model_validate({
        "field": "public_access",
        "observed_value": True,
        "expected_value": False,
        "explanation": "Public access should be disabled.",
    })

    assert evidence.observed_value is True
    assert evidence.expected_value is False