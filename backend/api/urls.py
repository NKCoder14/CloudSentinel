
from django.urls import path
from api.views import (
    run_security_scan,
    get_scan_detail,
    analyze_scan_with_ai,
)

urlpatterns = [
    path("scans/", run_security_scan, name="scans"),
    path("scans/<uuid:scan_id>/", get_scan_detail, name="scan-detail"),
    path(
        "scans/<uuid:scan_id>/ai-analysis/",
        analyze_scan_with_ai,
        name="scan-ai-analysis",
    ),
]
