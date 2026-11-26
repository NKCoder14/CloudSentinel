
import uuid

from django.db import models


class Scan(models.Model):
    scan_id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False,
    )

    provider = models.CharField(max_length=50, default="aws")
    status = models.CharField(max_length=30, default="COMPLETED")
    total_resources = models.PositiveIntegerField(default=0)
    total_findings = models.PositiveIntegerField(default=0)
    critical_count = models.PositiveIntegerField(default=0)
    high_count = models.PositiveIntegerField(default=0)
    medium_count = models.PositiveIntegerField(default=0)
    low_count = models.PositiveIntegerField(default=0)
    risk_score = models.FloatField(default=0)
    risk_level = models.CharField(max_length=20, default="LOW")
    scanned_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-scanned_at"]


class FindingRecord(models.Model):
    scan = models.ForeignKey(Scan, on_delete=models.CASCADE, related_name="findings")
    rule_id = models.CharField(max_length=50)
    resource_id = models.CharField(max_length=255)
    title = models.CharField(max_length=255)
    severity = models.CharField(max_length=20)
    description = models.TextField()
    evidence = models.JSONField(default=dict)
    recommendation = models.TextField()

    class Meta:
        ordering = ["-severity", "rule_id"]