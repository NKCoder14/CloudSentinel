
from pathlib import Path

from app.ingestion.snapshot_loader import load_snapshot
from app.processing.validator import validate_snapshot
from app.processing.resource_extractor import extract_resources
from app.processing.normalizer import normalize_resource
from app.processing.schemas import CloudResource


def process_snapshot(
    file_path: str | Path,
) -> list[CloudResource]:
    """
    Execute the complete configuration processing pipeline.

    File -> Ingestion -> Schema Validation -> Extraction -> Normalization
    """

    path = Path(file_path)

    if not path.is_file():
        raise FileNotFoundError(f"Snapshot file not found: {path}")

    # Step 1: Read file bytes and perform ingestion checks
    file_content = path.read_bytes()
    raw_data = load_snapshot(file_content)

    # Step 2: Validate using existing Pydantic schema
    snapshot = validate_snapshot(raw_data)

    # Step 3: Extract individual resources
    resources = extract_resources(snapshot)

    # Step 4: Normalize resources
    normalized_resources = [
        normalize_resource(
            resource,
            provider=snapshot.provider
        )
        for resource in resources
    ]

    return normalized_resources