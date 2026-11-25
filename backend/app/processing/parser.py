import json
from pathlib import Path
from typing import Any


def parse_json_file(file_path: str | Path) -> dict[str, Any]:
    """
    Read a JSON file and return its contents as a Python dictionary.

    Raises:
        FileNotFoundError: If the file does not exist.
        json.JSONDecodeError: If the file contains invalid JSON.
        ValueError: If the JSON root is not an object.
    """

    path = Path(file_path)

    with path.open("r", encoding="utf-8") as file:
        data = json.load(file)

    if not isinstance(data, dict):
        raise ValueError("JSON root must be an object.")

    return data