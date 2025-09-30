#!/usr/bin/env python3
import schedule, time
from dashboard import audit, honeypot, anchor, submission, alert
import threading

# --- Automated Jobs ---

def daily_audit():
    """Runs the daily system configuration audit."""
    audit_file, audit_hash = audit.audit_credentials()
    print(f"[Scheduler] Daily audit completed: {audit_file}")
    alert.send_alert(f"Daily audit completed. Report hash: {audit_hash}")

def daily_anchor():
    """Runs the daily Merkle snapshot anchoring."""
    anchor.anchor_manifest()
    print("[Scheduler] Merkle snapshot updated.")

def daily_submission():
    """Runs the end-to-end submission workflow."""
    submission.run_submission_workflow()
    print("[Scheduler] Daily submission workflow completed.")
    alert.send_alert("Daily 9999EFE+ submission workflow has been executed.")

# --- Scheduling ---
# Schedule jobs at different times to avoid overlap
schedule.every().day.at("02:00").do(daily_audit)
schedule.every().day.at("02:30").do(daily_anchor)
schedule.every().day.at("03:00").do(daily_submission)

# --- Continuous Honeypot Run ---
# Run honeypot in a background thread so it doesn't block the scheduler
print("[Scheduler] Starting continuous honeypot in the background...")
honeypot_thread = threading.Thread(target=honeypot.start_honeypot, daemon=True)
honeypot_thread.start()

print("[Scheduler] Automation started. Running continuous honeypot & scheduled tasks...")

# --- Main Loop ---
while True:
    schedule.run_pending()
    time.sleep(30)