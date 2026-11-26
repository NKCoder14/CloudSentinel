from app.processing.schemas import CloudResource
from app.security_engine.finding import Finding
from app.security_engine.registry import RuleRegistry


class SecurityEngine:
    """Executes applicable security rules against cloud resources."""

    def __init__(self, registry: RuleRegistry):
        self.registry = registry

    def scan_resource(
        self,
        resource: CloudResource,
    ) -> list[Finding]:
        """Execute all applicable rules against one resource."""

        findings = []

        applicable_rules = self.registry.get_rules_for_resource(
            resource
        )

        for rule in applicable_rules:
            rule_findings = rule.evaluate(resource)
            findings.extend(rule_findings)

        return findings

    def scan_resources(
        self,
        resources: list[CloudResource],
    ) -> list[Finding]:
        """Execute security rules against multiple resources."""

        all_findings = []

        for resource in resources:
            findings = self.scan_resource(resource)
            all_findings.extend(findings)

        return all_findings