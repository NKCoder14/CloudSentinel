from app.security_engine.base_rule import SecurityRule


class RuleRegistry:
    """Manages security rules registered in CloudSentinel."""

    def __init__(self):
        self._rules: dict[str, SecurityRule] = {}

    def register(self, rule: SecurityRule) -> None:
        """Register a security rule."""

        if rule.rule_id in self._rules:
            raise ValueError(
                f"Rule already registered: {rule.rule_id}"
            )

        self._rules[rule.rule_id] = rule

    def get_rule(self, rule_id: str) -> SecurityRule:
        """Retrieve a rule using its ID."""

        if rule_id not in self._rules:
            raise KeyError(f"Rule not found: {rule_id}")

        return self._rules[rule_id]

    def get_all_rules(self) -> list[SecurityRule]:
        """Return all registered rules."""

        return list(self._rules.values())

    def get_rules_for_resource(
        self,
        resource,
    ) -> list[SecurityRule]:
        """Return rules applicable to a resource."""

        return [
            rule
            for rule in self._rules.values()
            if rule.supports(resource)
        ]

    def count(self) -> int:
        """Return the number of registered rules."""

        return len(self._rules)