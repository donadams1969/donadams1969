import os
from pathlib import Path
import datetime

def audit_credentials():
    """
    Performs a basic audit by checking for the presence of required
    environment variables and configuration files.

    Returns the path to the audit report and a hash of the report.
    """
    print("[Audit] Auditing system configuration...")

    report_content = f"Audit Report - {datetime.datetime.utcnow().isoformat()}Z\n\n"
    issues_found = 0

    # 1. Check for required environment variables
    if not os.getenv("ALERT_WEBHOOK_URL"):
        report_content += "[FAIL] ALERT_WEBHOOK_URL environment variable is not set.\n"
        issues_found += 1
    else:
        report_content += "[PASS] ALERT_WEBHOOK_URL is configured.\n"

    # 2. Check for manifest file
    manifest_path = Path("./data/honeypot/manifest.json")
    if not manifest_path.exists():
        report_content += f"[FAIL] Manifest file not found at {manifest_path}.\n"
        issues_found += 1
    else:
        report_content += f"[PASS] Manifest file found at {manifest_path}.\n"

    report_content += f"\nAudit complete. Found {issues_found} issue(s)."

    # Simulate creating an audit file
    audit_file_path = Path("./data/audit_report.txt")
    audit_file_path.parent.mkdir(exist_ok=True) # Ensure the data directory exists
    with open(audit_file_path, "w") as f:
        f.write(report_content)

    # Simulate a hash of the report for integrity
    report_hash = hex(hash(report_content))

    print(f"[Audit] Audit completed. Report generated at {audit_file_path}")

    return str(audit_file_path), report_hash