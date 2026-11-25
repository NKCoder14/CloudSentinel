
import pytest
from pydantic import ValidationError

from app.processing.validator import validate_snapshot


def test_validator_accepts_valid_data():
    data = {
        "provider": "aws",
        "resources": []
    }

    result = validate_snapshot(data)

    assert result.provider == "aws"


def test_validator_rejects_invalid_data():
    data = {
        "provider": "azure",
        "resources": []
    }

    with pytest.raises(ValidationError):
        validate_snapshot(data)
