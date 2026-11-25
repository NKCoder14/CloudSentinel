
import json


MAX_FILE_SIZE = 1024 * 1024  # 1 MB


def load_snapshot(file_content: bytes):

    # Check file size
    if len(file_content) > MAX_FILE_SIZE:
        raise ValueError("File size exceeds 1 MB limit")

    # Convert bytes into text
    try:
        json_text = file_content.decode("utf-8")
    except UnicodeDecodeError:
        raise ValueError("File must use UTF-8 encoding")

    # Convert JSON text into Python dictionary
    try:
        data = json.loads(json_text)
    except json.JSONDecodeError:
        raise ValueError("Invalid JSON file")

    if not isinstance(data, dict):
        raise ValueError("JSON must contain an object")

    return data
