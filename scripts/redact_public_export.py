#!/usr/bin/env python3
"""
VALORAIPLUS™ Redacted Export Generator
Creates public-safe version with sensitive fields removed
"""

import json
import sys
from pathlib import Path

def redact_report(input_path: Path, output_path: Path):
    if not input_path.exists():
        print(f"Error: Input file not found: {input_path}")
        sys.exit(1)

    data = json.loads(input_path.read_text())

    # Remove sensitive sections
    data.pop("root_identity", None)
    data.pop("notes_internal", None)
    data.pop("math_lane", None)

    # Sanitize observation
    obs = data.get("flatline_observation", {})
    obs.pop("evidence_artifacts", None)
    obs["description"] = "Portal access observation during holiday period (details redacted)"

    # Add public disclaimer
    data["public_disclaimer"] = "This is a redacted, public version. Sensitive details removed for privacy."

    output_path.parent.mkdir(parents=True, exist_ok=True)
    output_path.write_text(json.dumps(data, indent=2))
    print(f"✓ Public export created: {output_path}")

if __name__ == "__main__":
    if len(sys.argv) != 3:
        print("Usage: python3 redact_public_export.py <input.json> <output.json>")
        sys.exit(1)

    redact_report(Path(sys.argv[1]), Path(sys.argv[2]))
