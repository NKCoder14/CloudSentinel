
from pydantic import ValidationError
from app.processing.schemas import CloudConfig


def validate_config(data):

    try:
        validated_data = CloudConfig.model_validate(data)

        return validated_data

    except ValidationError as error:
        raise ValueError(
            f"Configuration validation failed: {error}"
        )

