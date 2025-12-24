#!/usr/bin/env python3
"""
VALORAIPLUS™ Flatline Report Wizard
Interactive, safe JSON updater for internal reports
"""

import json
from datetime import datetime
from pathlib import Path

REPORT_PATH = Path("reports/VALORAIPLUS_TRAFFIC_FLATLINE_REPORT_v0.json")

def load_report():
    if not REPORT_PATH.exists():
        print(f"Warning: Report not found at {REPORT_PATH}")
        print("Creating minimal template...")
        template = {
            "schema_id": "VALORAIPLUS-TRAFFIC-FLATLINE-REPORT-v0",
            "version": "v0",
            "node": {"name": "Saint Paul Node", "location": "Saint Paul, MN"},
            "flatline_observation": {"status": "OBSERVED_BY_USER"}
        }
        REPORT_PATH.parent.mkdir(parents=True, exist_ok=True)
        REPORT_PATH.write_text(json.dumps(template, indent=2))
    return json.loads(REPORT_PATH.read_text())

def ask(prompt: str, default: str = None) -> str:
    suffix = f" [{default}]" if default is not None else ""
    response = input(f"{prompt}{suffix}: ").strip()
    return response if response else default

def main():
    print("VALORAIPLUS™ Traffic Flatline Report Wizard")
    print("Local-only • Safe updates • Press Enter to keep current value\n")

    data = load_report()

    current_status = data["flatline_observation"].get("status", "OBSERVED_BY_USER")
    new_status = ask("Observation status", current_status)
    if new_status:
        data["flatline_observation"]["status"] = new_status

    start = ask("Local start time (YYYY-MM-DDTHH:MM)", None)
    end = ask("Local end time (YYYY-MM-DDTHH:MM)", None)
    if start or end:
        data["flatline_observation"]["time_window_local"] = {
            "start": start,
            "end": end
        }

    note = ask("Add internal note", None)
    if note:
        notes = data.setdefault("notes_internal", [])
        notes.append({
            "timestamp": datetime.utcnow().isoformat() + "Z",
            "note": note,
            "source": "USER_INPUT"
        })

    REPORT_PATH.write_text(json.dumps(data, indent=2))
    print(f"\n✓ Report updated: {REPORT_PATH}")

if __name__ == "__main__":
    main()
