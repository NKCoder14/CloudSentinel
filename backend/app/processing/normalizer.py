
def normalize_resources(data, resources):

    return {
        "cloud_provider": data.cloud_provider,
        "environment": data.environment,
        "total_resources": len(resources),
        "resources": resources
    }
