from pathlib import Path

from app.processing.parser import parse_json_file
from app.processing.validator import validate_snapshot
from app.processing.resource_extractor import extract_resources
from app.processing.normalizer import normalize_resource
from app.processing.schemas import CloudResource


def process_snapshot(
    file_path: str | Path,
) -> list[CloudResource]:
    """
    Execute the complete configuration processing pipeline.

    JSON file -> Parse -> Validate -> Extract -> Normalize
    """

    # Step 1: Read JSON
    raw_data = parse_json_file(file_path)

    # Step 2: Validate snapshot
    snapshot = validate_snapshot(raw_data)

    # Step 3: Extract individual resources
    resources = extract_resources(snapshot)

    # Step 4: Normalize resources
    normalized_resources = [
        normalize_resource(resource, provider=snapshot.provider)
        for resource in resources
    ]

    return normalized_resources