from datetime import datetime, timezone

from app.processing.schemas import (
    CloudResource,
    SnapshotResourceInput,
)


def normalize_resource(
    resource: SnapshotResourceInput,
    provider: str = "aws",
    collected_at: datetime | None = None,
) -> CloudResource:
    """
    Convert an uploaded resource into CloudSentinel's
    standardized internal resource model.
    """

    timestamp = collected_at or datetime.now(timezone.utc)

    return CloudResource(
        resource_id=resource.resource_id,
        resource_type=resource.resource_type,
        resource_name=resource.resource_name,
        provider=provider,
        region=resource.region,
        configuration=resource.configuration,
        raw_configuration=resource.model_dump(mode="json"),
        collected_at=timestamp,
    )