
import json

MAX_FILE_SIZE = 1024 * 1024  # 1 MB


def load_snapshot(file_content: bytes) -> dict:
    """
    Load uploaded JSON bytes and perform basic validation.

    Detailed schema validation is handled by the existing
    Pydantic processing pipeline.
    """

    if not isinstance(file_content, bytes):
        raise TypeError("File content must be bytes.")

    if not file_content:
        raise ValueError("Uploaded file is empty.")

    if len(file_content) > MAX_FILE_SIZE:
        raise ValueError("File size exceeds 1 MB limit.")

    try:
        json_text = file_content.decode("utf-8")
    except UnicodeDecodeError as exc:
        raise ValueError("File must use UTF-8 encoding.") from exc

    try:
        data = json.loads(json_text)
    except json.JSONDecodeError as exc:
        raise ValueError("Invalid JSON file.") from exc

    if not isinstance(data, dict):
        raise ValueError("JSON root must be an object.")

    return data