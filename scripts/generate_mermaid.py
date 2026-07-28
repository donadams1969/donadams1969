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
