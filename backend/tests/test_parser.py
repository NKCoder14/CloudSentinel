import json
import pytest

from app.processing.parser import parse_json_file


def test_parser_reads_valid_json(tmp_path):
    file_path = tmp_path / "sample.json"

    sample_data = {
        "provider": "aws",
        "resources": []
    }

    file_path.write_text(
        json.dumps(sample_data),
        encoding="utf-8"
    )

    result = parse_json_file(file_path)

    assert result == sample_data


def test_parser_rejects_invalid_json(tmp_path):
    file_path = tmp_path / "invalid.json"

    file_path.write_text(
        '{"provider": "aws", invalid}',
        encoding="utf-8"
    )

    with pytest.raises(json.JSONDecodeError):
        parse_json_file(file_path)


def test_parser_rejects_non_object_root(tmp_path):
    file_path = tmp_path / "array.json"

    file_path.write_text(
        '["AWS", "Azure"]',
        encoding="utf-8"
    )

    with pytest.raises(ValueError):
        parse_json_file(file_path)


def test_parser_rejects_missing_file(tmp_path):
    file_path = tmp_path / "missing.json"

    with pytest.raises(FileNotFoundError):
        parse_json_file(file_path)