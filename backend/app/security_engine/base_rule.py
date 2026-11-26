from abc import ABC, abstractmethod
from typing import TYPE_CHECKING

from app.processing.schemas import CloudResource

if TYPE_CHECKING:
    from app.security_engine.finding import Finding


class SecurityRule(ABC):
    """
    Common interface for all CloudSentinel security rules.
    """

    rule_id: str
    description: str
    supported_resource_types: tuple[str, ...]

    def supports(self, resource: CloudResource) -> bool:
        """
        Check whether this rule applies to the given resource.
        """
        return resource.resource_type in self.supported_resource_types

    @abstractmethod
    def evaluate(self, resource: CloudResource) -> list["Finding"]:
        """
        Evaluate a resource and return security findings.
        """
        pass