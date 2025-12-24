#!/usr/bin/env bash
# ============================================================
# VALORAIPLUS™ EXTENSIONS — ENHANCED & HARDENED DEPLOYMENT
# Adds: CLI Wizard • Redacted Export • Mermaid Generator
# Improvements: Error handling, path safety, idempotency, logging
# Local-only • Descriptive • No network • No legal claims
# ============================================================

set -euo pipefail

# Create required directories (idempotent)
mkdir -p scripts diagrams exports reports audit

# ============================================================
# 1) CLI WIZARD — Interactive JSON Editor (ROBUST VERSION)
# ============================================================
cat > scripts/flatline_wizard.py << 'EOF'
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
EOF

chmod +x scripts/flatline_wizard.py

# ============================================================
# 2) REDACTED PUBLIC EXPORT (ENHANCED SAFETY)
# ============================================================
cat > scripts/redact_public_export.py << 'EOF'
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
EOF

chmod +x scripts/redact_public_export.py

# ============================================================
# 3) MERMAID DIAGRAM GENERATOR (ENHANCED FLOW)
# ============================================================
cat > scripts/generate_mermaid.py << 'EOF'
#!/usr/bin/env python3
"""
VALORAIPLUS™ Mermaid Diagram Generator
Creates visual flow from flatline report
"""

import json
from pathlib import Path
import sys

def generate_diagram(report_path: Path, output_path: Path):
    if not report_path.exists():
        print(f"Error: Report not found: {report_path}")
        sys.exit(1)

    data = json.loads(report_path.read_text())

    node = data.get("node", {}).get("name", "Saint Paul Node")
    label = data.get("context", {}).get("label", "Traffic Observation")
    status = data.get("flatline_observation", {}).get("status", "OBSERVED")
    desc = data.get("flatline_observation", {}).get("description", "Portal access issue")

    diagram = f"""flowchart TD
    A[{node}] --> B[Traffic Flatline Event]
    B --> C[Status: {status}]
    C --> D[{label}]
    D --> E[Description: {desc[:50]}...]
    E --> F[Next Actions Required]
    style A fill:#228B22,stroke:#006400,color:#fff
    style F fill:#8B0000,stroke:#4B0000,color:#fff
"""

    output_path.parent.mkdir(parents=True, exist_ok=True)
    output_path.write_text(diagram.strip() + "\n")
    print(f"✓ Mermaid diagram generated: {output_path}")

if __name__ == "__main__":
    if len(sys.argv) != 3:
        print("Usage: python3 generate_mermaid.py <input.json> <output.mmd>")
        sys.exit(1)

    generate_diagram(Path(sys.argv[1]), Path(sys.argv[2]))
EOF

chmod +x scripts/generate_mermaid.py

# ============================================================
# 4) AUTO-GENERATE DIAGRAM FROM CURRENT REPORT
# ============================================================
if [ -f "reports/VALORAIPLUS_TRAFFIC_FLATLINE_REPORT_v0.json" ]; then
    python3 scripts/generate_mermaid.py \
        reports/VALORAIPLUS_TRAFFIC_FLATLINE_REPORT_v0.json \
        diagrams/traffic_flatline_v0.mmd || echo "Warning: Diagram generation failed (report missing?)"
else
    echo "No report found — skipping diagram generation"
fi

# ============================================================
# FINAL STATUS
# ============================================================
echo ""
echo "=========================================="
echo "VALORAIPLUS™ EXTENSIONS — ENHANCED DEPLOYMENT"
echo "=========================================="
echo "✓ CLI wizard      : scripts/flatline_wizard.py        (robust input handling)"
echo "✓ Redacted export : scripts/redact_public_export.py   (safe public version)"
echo "✓ Mermaid gen     : scripts/generate_mermaid.py       (visual flow diagram)"
echo "✓ Diagram output  : diagrams/traffic_flatline_v0.mmd  (auto-generated if report exists)"
echo ""
echo "USAGE EXAMPLES:"
echo "  python3 scripts/flatline_wizard.py"
echo "  python3 scripts/redact_public_export.py reports/VALORAIPLUS_TRAFFIC_FLATLINE_REPORT_v0.json exports/public_flatline.json"
echo "  python3 scripts/generate_mermaid.py reports/VALORAIPLUS_TRAFFIC_FLATLINE_REPORT_v0.json diagrams/custom.mmd"
echo "=========================================="
echo "All scripts local-only • No network • Safe execution"
echo "Physical verification recommended at 1030 Girard Avenue"
echo "=========================================="
