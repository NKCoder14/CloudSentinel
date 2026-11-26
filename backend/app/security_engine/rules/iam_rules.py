from app.security_engine.base_rule import SecurityRule
from app.security_engine.finding import Finding


class IAMWildcardPolicyRule(SecurityRule):
    rule_id = "IAM-001"
    description = "Detects overly permissive IAM policy statements."

    supported_resource_types = {"AWS::IAM::Policy"}

    def evaluate(self, resource):
        findings = []

        policy = resource.configuration.get("policy_document", {})
        statements = policy.get("Statement", [])

        if isinstance(statements, dict):
            statements = [statements]

        for statement in statements:
            if statement.get("Effect") != "Allow":
                continue

            actions = statement.get("Action", [])
            resources = statement.get("Resource", [])

            if isinstance(actions, str):
                actions = [actions]

            if isinstance(resources, str):
                resources = [resources]

            wildcard_action = "*" in actions
            wildcard_resource = "*" in resources

            # Full administrator access is handled by IAM-002.
            if wildcard_action and wildcard_resource:
                continue

            if wildcard_action or wildcard_resource:
                findings.append(
                    Finding(
                        rule_id=self.rule_id,
                        resource_id=resource.resource_id,
                        title="Overly Permissive IAM Policy",
                        severity="HIGH",
                        description=(
                            "The IAM policy contains wildcard permissions "
                            "that may grant broader access than necessary."
                        ),
                        evidence={
                            "actions": actions,
                            "resources": resources,
                        },
                        recommendation=(
                            "Replace wildcard permissions with specific "
                            "actions and resources following the principle "
                            "of least privilege."
                        ),
                    )
                )

        return findings


class IAMAdministratorAccessRule(SecurityRule):
    rule_id = "IAM-002"
    description = "Detects unrestricted administrative IAM permissions."

    supported_resource_types = {"AWS::IAM::Policy"}

    def evaluate(self, resource):
        findings = []

        policy = resource.configuration.get("policy_document", {})
        statements = policy.get("Statement", [])

        if isinstance(statements, dict):
            statements = [statements]

        for statement in statements:
            if statement.get("Effect") != "Allow":
                continue

            actions = statement.get("Action", [])
            resources = statement.get("Resource", [])

            if isinstance(actions, str):
                actions = [actions]

            if isinstance(resources, str):
                resources = [resources]

            if "*" in actions and "*" in resources:
                findings.append(
                    Finding(
                        rule_id=self.rule_id,
                        resource_id=resource.resource_id,
                        title="Unrestricted IAM Administrative Access",
                        severity="CRITICAL",
                        description=(
                            "The IAM policy grants all actions on all "
                            "resources. This effectively provides "
                            "unrestricted administrative permissions."
                        ),
                        evidence={
                            "effect": statement.get("Effect"),
                            "actions": actions,
                            "resources": resources,
                        },
                        recommendation=(
                            "Remove unrestricted administrative permissions "
                            "and grant only the specific actions and resources "
                            "required by the workload."
                        ),
                    )
                )

        return findings