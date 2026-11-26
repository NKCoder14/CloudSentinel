from datetime import datetime, timezone
from pydantic import BaseModel, Field

from app.security_engine.finding import Finding


class ScanResult(BaseModel):
    scan_id: str
    provider: str = "aws"
    status: str = "COMPLETED"

    total_resources: int
    total_findings: int

    critical_count: int
    high_count: int
    medium_count: int
    low_count: int

    risk_score: float
    risk_level: str

    findings: list[Finding] = Field(default_factory=list)

    scanned_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc)
    )