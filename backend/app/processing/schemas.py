from datetime import datetime
from typing import Any, Literal
from pydantic import BaseModel, ConfigDict, Field


# Supported AWS resource types for our initial version
AWSResourceType = Literal[
    "AWS::S3::Bucket",
    "AWS::IAM::Role",
    "AWS::IAM::Policy",
    "AWS::EC2::SecurityGroup",
]


class SnapshotResourceInput(BaseModel):
    """Structure of one resource received in a JSON snapshot."""

    model_config = ConfigDict(extra="forbid")

    resource_id: str = Field(min_length=1)
    resource_type: AWSResourceType
    resource_name: str = Field(min_length=1)
    region: str | None = None
    configuration: dict[str, Any]


class CloudSnapshotInput(BaseModel):
    """Top-level structure of an uploaded cloud snapshot."""

    model_config = ConfigDict(extra="forbid")
    provider: Literal["aws"]
    resources: list[SnapshotResourceInput]


class CloudResource(BaseModel):
    """Standardized resource consumed by the security engine."""

    model_config = ConfigDict(extra="forbid")
    resource_id: str = Field(min_length=1)
    resource_type: AWSResourceType
    resource_name: str = Field(min_length=1)
    provider: Literal["aws"]
    region: str | None = None
    configuration: dict[str, Any]
    raw_configuration: dict[str, Any]
    collected_at: datetime | None = None