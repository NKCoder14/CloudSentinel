
from app.processing.schemas import CloudResource
from app.security_engine.base_rule import SecurityRule
from app.security_engine.engine import SecurityEngine
from app.security_engine.finding import Finding
from app.security_engine.registry import RuleRegistry


class DummyS3Rule(SecurityRule):
    rule_id = "S3-TEST-001"
    description = "Test S3 rule"
    supported_resource_types = ("AWS::S3::Bucket",)

    def evaluate(self, resource):
        return [
            Finding(
                rule_id=self.rule_id,
                resource_id=resource.resource_id,
                title="Test security finding",
                severity="HIGH",
                description="Test finding generated.",
                evidence={"test": True},
                recommendation="Fix the test issue.",
            )
        ]


def create_s3_resource():
    return CloudResource(
        resource_id="bucket-001",
        resource_type="AWS::S3::Bucket",
        resource_name="company-data",
        provider="aws",
        configuration={},
        raw_configuration={},
    )


def test_engine_detects_findings():
    registry = RuleRegistry()
    registry.register(DummyS3Rule())

    engine = SecurityEngine(registry)

    findings = engine.scan_resource(create_s3_resource())

    assert len(findings) == 1
    assert findings[0].rule_id == "S3-TEST-001"
    assert findings[0].severity == "HIGH"


def test_engine_returns_empty_for_no_findings():
    registry = RuleRegistry()
    engine = SecurityEngine(registry)

    findings = engine.scan_resource(create_s3_resource())

    assert findings == []


def test_engine_scans_multiple_resources():
    registry = RuleRegistry()
    registry.register(DummyS3Rule())

    engine = SecurityEngine(registry)

    resources = [
        create_s3_resource(),
        create_s3_resource(),
    ]

    findings = engine.scan_resources(resources)

    assert len(findings) == 2
