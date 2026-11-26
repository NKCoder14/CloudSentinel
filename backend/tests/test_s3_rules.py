from app.processing.schemas import CloudResource
from app.security_engine.rules.s3_rules import S3PublicAccessRule
from app.security_engine.rules.s3_rules import S3EncryptionRule

def create_s3_resource(configuration):
    return CloudResource(
        resource_id="bucket-001",
        resource_type="AWS::S3::Bucket",
        resource_name="company-data",
        provider="aws",
        configuration=configuration,
        raw_configuration=configuration,
    )


def test_detect_public_bucket():
    rule = S3PublicAccessRule()

    resource = create_s3_resource({
        "public_access": True
    })

    findings = rule.evaluate(resource)

    assert len(findings) == 1
    assert findings[0].rule_id == "S3-001"
    assert findings[0].severity == "HIGH"


def test_secure_bucket():
    rule = S3PublicAccessRule()

    resource = create_s3_resource({
        "public_access": False
    })

    findings = rule.evaluate(resource)

    assert findings == []


def test_missing_public_access():
    rule = S3PublicAccessRule()

    resource = create_s3_resource({})

    findings = rule.evaluate(resource)

    assert findings == []


def test_rule_rejects_non_s3_resource():
    rule = S3PublicAccessRule()

    resource = CloudResource(
        resource_id="sg-001",
        resource_type="AWS::EC2::SecurityGroup",
        resource_name="web-server",
        provider="aws",
        configuration={},
        raw_configuration={},
    )

    assert rule.supports(resource) is False

def test_detect_missing_encryption():
    rule = S3EncryptionRule()

    resource = create_s3_resource({
        "encryption_enabled": False
    })

    findings = rule.evaluate(resource)

    assert len(findings) == 1
    assert findings[0].rule_id == "S3-002"
    assert findings[0].severity == "HIGH"


def test_encryption_enabled():
    rule = S3EncryptionRule()

    resource = create_s3_resource({
        "encryption_enabled": True
    })

    findings = rule.evaluate(resource)

    assert findings == []


def test_missing_encryption_information():
    rule = S3EncryptionRule()

    resource = create_s3_resource({})

    findings = rule.evaluate(resource)

    assert findings == []