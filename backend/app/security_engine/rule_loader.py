from app.security_engine.registry import RuleRegistry
from app.security_engine.rules import ALL_RULES


def load_rules() -> RuleRegistry:
    """Register all available security rules."""

    registry = RuleRegistry()

    for rule in ALL_RULES:
        registry.register(rule)

    return registry