from app.processing.processor import process_snapshot
from app.security_engine.engine import SecurityEngine
from app.security_engine.rule_loader import load_rules
from app.security_engine.risk_scorer import RiskScorer


# Load normalized resources
resources = process_snapshot(
    "../sample_data/vulnerable_config.json"
)

# Register security rules
registry = load_rules()

# Initialize security engine
engine = SecurityEngine(registry)

# Execute security scan
findings = engine.scan_resources(resources)

scorer = RiskScorer()

risk_score = scorer.calculate_score(findings)
risk_level = scorer.get_risk_level(risk_score)

# Display results
print("\nCLOUDSENTINEL SECURITY SCAN")
print("=" * 45)

for finding in findings:
    print(f"Rule ID: {finding.rule_id}")
    print(f"Resource ID: {finding.resource_id}")
    print(f"Title: {finding.title}")
    print(f"Severity: {finding.severity}")
    print(f"Description: {finding.description}")
    print(f"Evidence: {finding.evidence}")
    print(f"Recommendation: {finding.recommendation}")
    print("-" * 45)

print(f"Total findings: {len(findings)}")
print("\n=============================================")
print("CLOUD SECURITY RISK SUMMARY")
print("=============================================")
print(f"Risk Score: {risk_score}/100")
print(f"Risk Level: {risk_level}")
print(f"Total Findings: {len(findings)}")