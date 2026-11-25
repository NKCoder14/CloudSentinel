
def extract_resources(data):

    resources = []

    # Extract S3 buckets
    for bucket in data.s3_buckets:
        resources.append({
            "resource_type": "S3_BUCKET",
            "resource_id": bucket.name,
            "properties": bucket.model_dump()
        })

    # Extract IAM users
    for user in data.iam_users:
        resources.append({
            "resource_type": "IAM_USER",
            "resource_id": user.name,
            "properties": user.model_dump()
        })

    # Extract EC2 security groups
    for group in data.security_groups:
        resources.append({
            "resource_type": "EC2_SECURITY_GROUP",
            "resource_id": group.name,
            "properties": group.model_dump()
        })

    return resources
