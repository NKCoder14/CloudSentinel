import pytest

from app.security_engine.base_rule import SecurityRule
from app.security_engine.registry import RuleRegistry
from app.processing.schemas import CloudResource


class DummyS3Rule(SecurityRule):
    rule_id = "S3-TEST-001"
    description = "Test S3 rule"
    supported_resource_types = ("AWS::S3::Bucket",)

    def evaluate(self, resource):
        return []


class DummyEC2Rule(SecurityRule):
    rule_id = "EC2-TEST-001"
    description = "Test EC2 rule"
    supported_resource_types = ("AWS::EC2::SecurityGroup",)

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


def test_register_rule():
    registry = RuleRegistry()
    rule = DummyS3Rule()

    registry.register(rule)

    assert registry.count() == 1


def test_retrieve_rule():
    registry = RuleRegistry()
    rule = DummyS3Rule()
    registry.register(rule)

    assert registry.get_rule("S3-TEST-001") is rule


def test_duplicate_registration():
    registry = RuleRegistry()
    registry.register(DummyS3Rule())

    with pytest.raises(ValueError):
        registry.register(DummyS3Rule())


def test_unknown_rule():
    registry = RuleRegistry()

    with pytest.raises(KeyError):
        registry.get_rule("UNKNOWN-001")


def test_filter_rules_by_resource():
    registry = RuleRegistry()
    registry.register(DummyS3Rule())
    registry.register(DummyEC2Rule())

    resource = create_s3_resource()

    applicable_rules = registry.get_rules_for_resource(resource)

    assert len(applicable_rules) == 1
    assert applicable_rules[0].rule_id == "S3-TEST-001"


def test_get_all_rules():
    registry = RuleRegistry()
    registry.register(DummyS3Rule())
    registry.register(DummyEC2Rule())

    assert len(registry.get_all_rules()) == 2