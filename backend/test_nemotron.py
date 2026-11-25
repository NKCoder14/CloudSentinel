from app.processing.ai_assistant.nemotron import process_findings_report

findings = [
    {
        "name": "Missing Security Header",
        "severity": "Low",
        "description": "A recommended HTTP security header is missing."
    },
    {
        "name": "Public Storage Bucket",
        "severity": "High",
        "description": "A cloud storage bucket may allow public access."
    }
]

report = process_findings_report(findings)

print("\nINDIVIDUAL ANALYSES:")
for result in report["individual_analyses"]:
    print("\n", result)

print("\nOVERALL SUMMARY:")
print(report["overall_summary"])