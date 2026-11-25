from app.processing.processor import process_snapshot

resources = process_snapshot(
    "../sample_data/vulnerable_config.json"
)

print("\nCLOUDSENTINEL PROCESSING RESULTS")
print("=" * 45)

for resource in resources:
    print(f"Resource ID: {resource.resource_id}")
    print(f"Resource Type: {resource.resource_type}")
    print(f"Resource Name: {resource.resource_name}")
    print(f"Region: {resource.region}")
    print(f"Configuration: {resource.configuration}")
    print("-" * 45)

print(f"Total resources processed: {len(resources)}")