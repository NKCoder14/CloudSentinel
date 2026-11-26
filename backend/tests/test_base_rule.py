import pytest

from app.processing.schemas import CloudResource
from app.security_engine.base_rule import SecurityRule


class IncompleteRule(SecurityRule):
    rule_id = "TEST-001"
    description = "Incomplete test rule"
    supported_resource_types = ("AWS::S3::Bucket",)


class DummyRule(SecurityRule):
    rule_id = "TEST-002"
    description = "Complete test rule"
    supported_resource_types = ("AWS::S3::Bucket",)

    def evaluate(self, resource):
        return []


def create_s3_resource():
    return CloudResource(
        resource_id="bucket-001",
        resource_type="AWS::S3::Bucket",
        resource_name="company-data",
        provider="aws",
        configuration={},
        raw_configuration={},
    )


def test_abstract_rule_cannot_be_instantiated():
    with pytest.raises(TypeError):
        IncompleteRule()


def test_concrete_rule_can_be_instantiated():
    rule = DummyRule()

    assert rule.rule_id == "TEST-002"


def test_rule_supports_correct_resource():
    rule = DummyRule()
    resource = create_s3_resource()

    assert rule.supports(resource) is True


def test_rule_rejects_unsupported_resource():
    rule = DummyRule()

    resource = CloudResource(
        resource_id="sg-001",
        resource_type="AWS::EC2::SecurityGroup",
        resource_name="web-server",
        provider="aws",
        configuration={},
        raw_configuration={},
    )

    assert rule.supports(resource) is False