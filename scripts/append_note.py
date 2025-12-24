#!/usr/bin/env python3
import json, sys
from datetime import datetime

if len(sys.argv) != 3:
    print("Usage: append_note.py <report.json> <note>")
    sys.exit(1)

with open(sys.argv[1]) as f:
    report = json.load(f)

notes = report.setdefault("notes_internal", [])
notes.append({
    "timestamp": datetime.utcnow().isoformat() + "Z",
    "note": sys.argv[2],
    "source": "USER"
})

with open(sys.argv[1], "w") as f:
    json.dump(report, f, indent=2)

print("✓ NOTE APPENDED")
