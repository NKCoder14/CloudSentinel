from app.security_engine.rules.s3_rules import ( S3PublicAccessRule, S3EncryptionRule)
from app.security_engine.rules.ec2_rules import ( EC2OpenSSHRule, EC2UnrestrictedInboundRule)
from app.security_engine.rules.iam_rules import ( IAMWildcardPolicyRule, IAMAdministratorAccessRule)

S3_RULES = [
    S3PublicAccessRule(),
    S3EncryptionRule(),
]

EC2_RULES = [
    EC2OpenSSHRule(),
    EC2UnrestrictedInboundRule()
]

IAM_RULES = [
    IAMWildcardPolicyRule(),
    IAMAdministratorAccessRule(),
]

ALL_RULES = S3_RULES + EC2_RULES + IAM_RULES