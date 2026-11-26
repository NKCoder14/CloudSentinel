from app.processing.schemas import CloudResource
from app.security_engine.rules.iam_rules import (
    IAMWildcardPolicyRule,
    IAMAdministratorAccessRule,
)


def create_iam_resource(statement):
    return CloudResource(
        resource_id="policy-test",
        resource_type="AWS::IAM::Policy",
        resource_name="test-policy",
        provider="aws",
        configuration={
            "policy_document": {
                "Version": "2012-10-17",
                "Statement": statement,
            }
        },
        raw_configuration={},
    )


def test_detects_wildcard_action():
    resource = create_iam_resource([
        {
            "Effect": "Allow",
            "Action": "*",
            "Resource": "arn:aws:s3:::company-data",
        }
    ])

    findings = IAMWildcardPolicyRule().evaluate(resource)

    assert len(findings) == 1
    assert findings[0].rule_id == "IAM-001"
    assert findings[0].severity == "HIGH"


def test_detects_wildcard_resource():
    resource = create_iam_resource([
        {
            "Effect": "Allow",
            "Action": "s3:GetObject",
            "Resource": "*",
        }
    ])

    findings = IAMWildcardPolicyRule().evaluate(resource)

    assert len(findings) == 1
    assert findings[0].rule_id == "IAM-001"


def test_ignores_restricted_policy():
    resource = create_iam_resource([
        {
            "Effect": "Allow",
            "Action": "s3:GetObject",
            "Resource": "arn:aws:s3:::company-data/*",
        }
    ])

    findings = IAMWildcardPolicyRule().evaluate(resource)

    assert findings == []


def test_detects_administrator_access():
    resource = create_iam_resource([
        {
            "Effect": "Allow",
            "Action": "*",
            "Resource": "*",
        }
    ])

    findings = IAMAdministratorAccessRule().evaluate(resource)

    assert len(findings) == 1
    assert findings[0].rule_id == "IAM-002"
    assert findings[0].severity == "CRITICAL"


def test_ignores_restricted_administrator_policy():
    resource = create_iam_resource([
        {
            "Effect": "Allow",
            "Action": "s3:GetObject",
            "Resource": "*",
        }
    ])

    findings = IAMAdministratorAccessRule().evaluate(resource)

    assert findings == []