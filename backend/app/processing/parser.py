
from app.processing.validator import validate_config
from app.processing.resource_extractor import extract_resources
from app.processing.normalizer import normalize_resources


def parse_config(raw_data):

    # Step 1: Validate configuration
    validated_data = validate_config(raw_data)

    # Step 2: Extract cloud resources
    resources = extract_resources(validated_data)

    # Step 3: Normalize resources
    normalized_data = normalize_resources(
        validated_data,
        resources
    )

    return normalized_data
