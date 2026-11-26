from app.processing.schemas import CloudResource
from app.security_engine.base_rule import SecurityRule
from app.security_engine.finding import Finding


class S3PublicAccessRule(SecurityRule):
    """Detect S3 buckets configured for public access."""

    rule_id = "S3-001"
    description = "Detect publicly accessible S3 buckets"

    supported_resource_types = (
        "AWS::S3::Bucket",
    )

    def evaluate(self, resource: CloudResource) -> list[Finding]:
        configuration = resource.configuration

        public_access = configuration.get("public_access")

        # Missing information must not be treated as safe.
        if public_access is None:
            return []

        if public_access is not True:
            return []

        finding = Finding(
            rule_id=self.rule_id,
            resource_id=resource.resource_id,
            title="Public S3 Bucket Exposure",
            severity="HIGH",
            description=(
                "The S3 bucket is configured with public access enabled. "
                "This may expose stored data to unauthorized users."
            ),
            evidence={
                "field": "public_access",
                "observed_value": public_access,
                "expected_value": False,
            },
            recommendation=(
                "Review the bucket's access requirements and disable "
                "unnecessary public access using S3 Block Public Access."
            ),
        )

        return [finding]


class S3EncryptionRule(SecurityRule):
    """Detect S3 buckets without encryption enabled."""

    rule_id = "S3-002"
    description = "Detect S3 buckets without default encryption"

    supported_resource_types = (
        "AWS::S3::Bucket",
    )

    def evaluate(self, resource: CloudResource) -> list[Finding]:
        configuration = resource.configuration

        encryption_enabled = configuration.get("encryption_enabled")

        # Missing information is not automatically considered secure.
        if encryption_enabled is None:
            return []

        if encryption_enabled is not False:
            return []

        finding = Finding(
            rule_id=self.rule_id,
            resource_id=resource.resource_id,
            title="S3 Bucket Missing Encryption",
            severity="HIGH",
            description=(
                "The S3 bucket does not have default encryption enabled. "
                "Stored data may lack the expected encryption protection."
            ),
            evidence={
                "field": "encryption_enabled",
                "observed_value": encryption_enabled,
                "expected_value": True,
            },
            recommendation=(
                "Enable default server-side encryption for the S3 bucket."
            ),
        )

        return [finding]