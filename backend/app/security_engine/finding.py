from typing import Any, Literal

from pydantic import BaseModel, ConfigDict, Field


class Finding(BaseModel):
    """Represents a security issue detected by CloudSentinel."""

    model_config = ConfigDict(extra="forbid")

    rule_id: str = Field(min_length=1)
    resource_id: str = Field(min_length=1)
    title: str = Field(min_length=1)

    severity: Literal[
        "CRITICAL",
        "HIGH",
        "MEDIUM",
        "LOW",
    ]

    description: str
    evidence: dict[str, Any]
    recommendation: str