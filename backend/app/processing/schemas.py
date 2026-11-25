
from typing import Literal
from pydantic import BaseModel, Field, ConfigDict


class S3Bucket(BaseModel):
    model_config = ConfigDict(extra="forbid")

    name: str
    public_access: bool | None = None
    encryption_enabled: bool | None = None
    versioning_enabled: bool | None = None


class IAMUser(BaseModel):
    model_config = ConfigDict(extra="forbid")

    name: str
    permissions: list[str] = Field(default_factory=list)
    mfa_enabled: bool | None = None


class InboundRule(BaseModel):
    model_config = ConfigDict(extra="forbid")

    port: int = Field(ge=0, le=65535)
    protocol: str
    source: str


class SecurityGroup(BaseModel):
    model_config = ConfigDict(extra="forbid")

    name: str
    inbound_rules: list[InboundRule] = Field(default_factory=list)


class CloudConfig(BaseModel):
    model_config = ConfigDict(extra="forbid")

    cloud_provider: Literal["AWS"]
    environment: str

    s3_buckets: list[S3Bucket]
    iam_users: list[IAMUser]
    security_groups: list[SecurityGroup]
