from app.processing.schemas import CloudResource
from app.security_engine.rules.ec2_rules import (
    EC2OpenSSHRule,
    EC2UnrestrictedInboundRule,
)


def create_ec2_resource(inbound_rules):
    return CloudResource(
        resource_id="sg-001",
        resource_type="AWS::EC2::SecurityGroup",
        resource_name="web-server-sg",
        provider="aws",
        region="us-east-1",
        configuration={
            "inbound_rules": inbound_rules
        },
        raw_configuration={},
    )


# EC2-001: SSH Exposure Tests

def test_detect_open_ssh():
    rule = EC2OpenSSHRule()

    resource = create_ec2_resource([
        {
            "protocol": "tcp",
            "port": 22,
            "cidr": "0.0.0.0/0",
        }
    ])

    findings = rule.evaluate(resource)

    assert len(findings) == 1
    assert findings[0].rule_id == "EC2-001"
    assert findings[0].severity == "HIGH"


def test_restricted_ssh():
    rule = EC2OpenSSHRule()

    resource = create_ec2_resource([
        {
            "protocol": "tcp",
            "port": 22,
            "cidr": "192.168.1.0/24",
        }
    ])

    assert rule.evaluate(resource) == []


def test_unrelated_port():
    rule = EC2OpenSSHRule()

    resource = create_ec2_resource([
        {
            "protocol": "tcp",
            "port": 443,
            "cidr": "0.0.0.0/0",
        }
    ])

    assert rule.evaluate(resource) == []


def test_multiple_inbound_rules():
    rule = EC2OpenSSHRule()

    resource = create_ec2_resource([
        {
            "protocol": "tcp",
            "port": 443,
            "cidr": "0.0.0.0/0",
        },
        {
            "protocol": "tcp",
            "port": 22,
            "cidr": "0.0.0.0/0",
        },
    ])

    findings = rule.evaluate(resource)

    assert len(findings) == 1
    assert findings[0].rule_id == "EC2-001"


# EC2-002: Unrestricted Sensitive Port Tests

def test_detects_open_mysql_port():
    rule = EC2UnrestrictedInboundRule()

    resource = create_ec2_resource([
        {
            "protocol": "tcp",
            "port": 3306,
            "cidr": "0.0.0.0/0",
        }
    ])

    findings = rule.evaluate(resource)

    assert len(findings) == 1
    assert findings[0].rule_id == "EC2-002"
    assert findings[0].severity == "HIGH"


def test_does_not_flag_restricted_mysql_port():
    rule = EC2UnrestrictedInboundRule()

    resource = create_ec2_resource([
        {
            "protocol": "tcp",
            "port": 3306,
            "cidr": "192.168.1.0/24",
        }
    ])

    assert rule.evaluate(resource) == []


def test_does_not_duplicate_ssh_finding():
    rule = EC2UnrestrictedInboundRule()

    resource = create_ec2_resource([
        {
            "protocol": "tcp",
            "port": 22,
            "cidr": "0.0.0.0/0",
        }
    ])

    assert rule.evaluate(resource) == []