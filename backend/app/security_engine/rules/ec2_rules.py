from app.processing.schemas import CloudResource
from app.security_engine.base_rule import SecurityRule
from app.security_engine.finding import Finding


class EC2OpenSSHRule(SecurityRule):
    """Detect SSH access exposed to the entire internet."""

    rule_id = "EC2-001"
    description = "Detect unrestricted SSH access"

    supported_resource_types = (
        "AWS::EC2::SecurityGroup",
    )

    def evaluate(self, resource: CloudResource) -> list[Finding]:
        findings = []

        inbound_rules = resource.configuration.get("inbound_rules", [])

        for inbound_rule in inbound_rules:
            port = inbound_rule.get("port")
            protocol = inbound_rule.get("protocol")
            cidr = inbound_rule.get("cidr")

            if (
                port == 22
                and protocol in ("tcp", "-1")
                and cidr == "0.0.0.0/0"
            ):
                findings.append(
                    Finding(
                        rule_id=self.rule_id,
                        resource_id=resource.resource_id,
                        title="SSH Exposed to the Internet",
                        severity="HIGH",
                        description=(
                            "SSH access is allowed from all IPv4 addresses. "
                            "This increases the risk of unauthorized access."
                        ),
                        evidence={
                            "port": port,
                            "protocol": protocol,
                            "cidr": cidr,
                        },
                        recommendation=(
                            "Restrict SSH access to trusted IP addresses "
                            "or use a secure access mechanism."
                        ),
                    )
                )

        return findings


class EC2UnrestrictedInboundRule(SecurityRule):
    rule_id = "EC2-002"
    description = "Detects unrestricted access to sensitive service ports."

    supported_resource_types = {"AWS::EC2::SecurityGroup"}

    SENSITIVE_PORTS = {
        21: "FTP",
        23: "Telnet",
        3306: "MySQL",
        3389: "RDP",
        5432: "PostgreSQL",
        27017: "MongoDB",
    }

    def evaluate(self, resource):
        findings = []

        inbound_rules = resource.configuration.get("inbound_rules", [])

        for rule in inbound_rules:
            port = rule.get("port")
            protocol = rule.get("protocol")
            cidr = rule.get("cidr")

            if (
                port in self.SENSITIVE_PORTS
                and protocol in ("tcp", "-1")
                and cidr == "0.0.0.0/0"
            ):
                service = self.SENSITIVE_PORTS[port]

                findings.append(
                    Finding(
                        rule_id=self.rule_id,
                        resource_id=resource.resource_id,
                        title=f"{service} Port Exposed to the Internet",
                        severity="HIGH",
                        description=(
                            f"{service} access is allowed from all IPv4 addresses. "
                            "This may expose the service to unauthorized access."
                        ),
                        evidence={
                            "port": port,
                            "protocol": protocol,
                            "cidr": cidr,
                        },
                        recommendation=(
                            f"Restrict {service} access to trusted IP addresses "
                            "and disable unnecessary inbound access."
                        ),
                    )
                )

        return findings