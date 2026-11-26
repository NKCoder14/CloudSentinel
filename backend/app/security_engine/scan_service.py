from pathlib import Path

from app.processing.processor import process_snapshot
from app.security_engine.engine import SecurityEngine
from app.security_engine.rule_loader import load_rules
from app.security_engine.result_builder import ScanResultBuilder


class ScanService:

    def __init__(self):
        self.registry = load_rules()
        self.engine = SecurityEngine(self.registry)
        self.result_builder = ScanResultBuilder()

    def run_scan(self, file_path: str | Path):
        # 1. Process and normalize cloud resources
        resources = process_snapshot(file_path)

        # 2. Execute security rules
        findings = self.engine.scan_resources(resources)

        # 3. Build structured scan result
        result = self.result_builder.build(resources, findings)

        return result