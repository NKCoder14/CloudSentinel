from app.processing.schemas import CloudSnapshotInput, SnapshotResourceInput


def extract_resources(
    snapshot: CloudSnapshotInput,
) -> list[SnapshotResourceInput]:
    """
    Extract individual resources from a validated snapshot.
    """
    return snapshot.resources