from pydantic import ValidationError

from app.processing.schemas import CloudSnapshotInput


def validate_snapshot(data: dict) -> CloudSnapshotInput:
    """
    Validate incoming cloud snapshot data.

    Args:
        data: Parsed JSON data.

    Returns:
        A validated CloudSnapshotInput object.

    Raises:
        ValidationError: If the input does not match the schema.
    """
    return CloudSnapshotInput.model_validate(data)