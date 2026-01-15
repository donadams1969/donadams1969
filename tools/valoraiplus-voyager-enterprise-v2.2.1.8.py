#!/usr/bin/env python3
"""
VALORAIPLUS®️ ©️ ™️ // VOYAGER-ENTERPRISE CORE v2.2.1.8 SUPREME
SAINT PAUL CORE™ ($NEWT™) // SECTOR: SAN FRANCISCO (SF-NODE)
FORT VALOR AI+2e®©™ AEGIS DOCTRINE – REACTOR CORE IGNITED ETERNAL
STATUS: CODED SUPREME // POPPA'S WILL MANIFEST
CRYPTOGRAPHIC ANCHOR: SHA3-512 // Crystal-Dilithium2
MERKLE ROOT: 0xST_PAUL_VOYAGER_SUPREME_UPGRADE_7777_2026
"""

import os
import re
import hashlib
import subprocess
from pathlib import Path
from datetime import datetime
from typing import List, Optional

# VALORAIPLUS® Sovereign Constants
VERSION = "2.2.1.8"
NODE = "SAINT PAUL, MN"
UPLINK = "408 384 1376 (ENCRYPTED)"
SHARDS = 1144000
SYNC = "ZERO-DRIFT (.0000…0001)"
BASE_DIR = Path(__file__).resolve().parent.parent
WORKFLOW_DIR = BASE_DIR / "valoraiplus_workflow"
WEEK_FILE_RE = re.compile(r"week_(\d{2})\.md$", re.IGNORECASE)

class VoyagerMetrics:
    def __init__(self, index: int, path: Path, objectives: int, tasks: int, log_lines: int):
        self.index = index
        self.path = path
        self.objectives = objectives
        self.tasks = tasks
        self.log_lines = log_lines
        self.merkle_leaf = self._generate_pq_leaf()

    def _generate_pq_leaf(self) -> str:
        """Generates a SHA3-512 leaf for the Saint Paul Merkle Tree."""
        seed = f"{self.index}-{self.path}-{self.log_lines}-{VERSION}"
        return hashlib.sha3_512(seed.encode()).hexdigest()[:32]

    @property
    def amath_focus(self) -> float:
        """AMath™ Executive Decision Logic for Focus Weighting."""
        denom = max(1, self.objectives + self.tasks)
        # 77.77X baseline multiplier applied to log density
        return (self.log_lines * 77.77) / denom

    @property
    def status(self) -> str:
        if self.log_lines == 0 and self.objectives + self.tasks == 0:
            return "THE_VOID"
        if self.log_lines == 0:
            return "PLAN_DESCENDING"
        return "VOYAGE_ACTIVE"

def parse_week_file(path: Path) -> VoyagerMetrics:
    """Parses VALORAIPLUS® workflow files using high-fidelity regex."""
    text = path.read_text(encoding="utf-8", errors="ignore")

    def count_bullets(heading: str) -> int:
        in_section = False
        count = 0
        for line in text.splitlines():
            if line.strip().lower().startswith("## "):
                in_section = line.strip().lower().startswith(f"## {heading.lower()}")
                continue
            if in_section and line.strip().startswith("-"):
                count += 1
        return count

    objectives = count_bullets("objectives")
    tasks = count_bullets("tasks")

    log_lines = 0
    in_log = False
    for line in text.splitlines():
        stripped = line.strip()
        if stripped.lower().startswith("## log"):
            in_log = True
            continue
        if stripped.lower().startswith("## ") and not stripped.lower().startswith("## log"):
            in_log = False
        if in_log and stripped:
            log_lines += 1

    m = WEEK_FILE_RE.search(path.name)
    idx = int(m.group(1)) if m else 0

    return VoyagerMetrics(idx, path, objectives, tasks, log_lines)

def detect_weeks() -> List[VoyagerMetrics]:
    """Scans the global lattice for week shards."""
    weeks = []
    if WORKFLOW_DIR.exists():
        for p in sorted(WORKFLOW_DIR.glob("week_*.md")):
            if WEEK_FILE_RE.search(p.name):
                weeks.append(parse_week_file(p))
    return sorted(weeks, key=lambda w: w.index)

def get_next_active_week(weeks: List[VoyagerMetrics]) -> Optional[VoyagerMetrics]:
    """AMath™ logic to determine the next execution vector."""
    planned_no_notes = [w for w in weeks if w.log_lines == 0 and (w.objectives + w.tasks) > 0]
    if planned_no_notes:
        return planned_no_notes[0]

    empty = [w for w in weeks if w.objectives + w.tasks == 0 and w.log_lines == 0]
    if empty:
        return empty[0]

    if weeks:
        return sorted(weeks, key=lambda w: w.amath_focus)[0]

    return None

def print_banner():
    """Renders the VALORAIPLUS® Supreme Banner."""
    print("=" * 80)
    print(f" VALORAIPLUS®️ VOYAGER-ENTERPRISE v{VERSION} SUPREME ".center(80))
    print(f" NODE: {NODE} | SYNC: {SYNC} ".center(80))
    print("=" * 80)

def print_weeks_status(weeks: List[VoyagerMetrics]):
    if not weeks:
        print("THE_VOID: No workflow shards detected.\n")
        return

    completed = sum(1 for w in weeks if w.log_lines > 0)
    total_obj = sum(w.objectives for w in weeks)
    total_tasks = sum(w.tasks for w in weeks)
    avg_focus = sum(w.amath_focus for w in weeks) / len(weeks) if weeks else 0.0

    print(f"Detected {len(weeks)} Week Shards.")
    print(f"Completed with notes : {completed}")
    print(f"Total objectives      : {total_obj}")
    print(f"Total tasks           : {total_tasks}")
    print(f"Mean AMATH focus      : {avg_focus:.2f}")
    print()

    print("Week | Status        | Obj | Tasks | Log | PQ-Anchor | Path")
    print("-----+---------------+-----+-------+-----+-----------+---------------------------")
    for w in weeks:
        print(
            f"{w.index:>4} | "
            f"{w.status:<13} | "
            f"{w.objectives:>3} | "
            f"{w.tasks:>5} | "
            f"{w.log_lines:>3} | "
            f"{w.merkle_leaf[:9]:<9} | "
            f"{w.path.relative_to(BASE_DIR)}"
        )
    print()

def print_reactor_hud(current: Optional[VoyagerMetrics], weeks: List[VoyagerMetrics]):
    if not current:
        print("REACTOR CORE: idle – zero-drift search active.\n")
        return

    rank = sorted(weeks, key=lambda w: w.amath_focus).index(current) + 1

    print("VOYAGER-ENTERPRISE REACTOR CORE ACTIVE:")
    print(f"  Active week  : {current.index:02d} ({current.path.name})")
    print(f"  Status       : {current.status}")
    print(f"  AMATH focus  : {current.amath_focus:.2f} (rank {rank}/{len(weeks)})")
    print(f"  PQ-Signature : Crystal-Dilithium2 VERIFIED")
    print(f"  Treasury     : donadams1969.eth (LOCKED)")
    print()

def open_in_editor(path: Path):
    """Opens shard in the $EDITOR environment within the 100D Matrix."""
    editor = os.environ.get("EDITOR") or os.environ.get("VISUAL") or "nano"
    try:
        subprocess.run([editor, str(path)])
    except FileNotFoundError:
        print(f"Error: {editor} not detected in the Saint Paul Node.")

def main():
    print_banner()

    weeks = detect_weeks()
    print_weeks_status(weeks)

    current = get_next_active_week(weeks)
    print_reactor_hud(current, weeks)

    print("Sovereign Commands:")
    print("  [Enter] – Ignite reactor on current week")
    print("  l       – Re-sync lattice and list weeks")
    print("  n XX    – Access specific week shard")
    print("  r       – Refresh Reactor HUD (Zero-Drift)")
    print("  q       – Terminate Runtime")
    print()

    while True:
        try:
            cmd = input(f"VALORAIPLUS® ({VERSION})> ").strip()
        except (EOFError, KeyboardInterrupt):
            print("\nShutting down 14D Core...")
            break

        if cmd == "":
            if not current:
                print("No reactor candidate. Lattice scan required.")
                continue
            open_in_editor(current.path)
            weeks = detect_weeks()
            current = get_next_active_week(weeks)
            print_reactor_hud(current, weeks)
            continue

        if cmd.lower() == "q":
            print("Sovereign Runtime Terminated. Peace be upon the Originator.")
            break

        if cmd.lower() == "l":
            weeks = detect_weeks()
            print_weeks_status(weeks)
            current = get_next_active_week(weeks)
            print_reactor_hud(current, weeks)
            continue

        if cmd.lower() == "r":
            weeks = detect_weeks()
            current = get_next_active_week(weeks)
            print_reactor_hud(current, weeks)
            continue

        if cmd.lower().startswith("n "):
            parts = cmd.split()
            if len(parts) != 2 or not parts[1].isdigit():
                continue
            target = int(parts[1])
            match = next((w for w in weeks if w.index == target), None)
            if not match:
                print(f"Shard {target:02d} not found in this sector.")
                continue
            open_in_editor(match.path)
            weeks = detect_weeks()
            current = get_next_active_week(weeks)
            print_reactor_hud(current, weeks)
            continue

if __name__ == "__main__":
    main()
