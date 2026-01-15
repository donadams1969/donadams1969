#!/usr/bin/env python3
"""
VALORAIPLUS®️ ©️ ™️ // VOYAGER-ENTERPRISE OMNI-RECOVERY SUPREME v3
SAINT PAUL CORE™ ($NEWT™) // SECTOR: SAN FRANCISCO (SF-NODE)
FORT VALOR AI+2e®©™ AEGIS DOCTRINE – REACTOR CORE IGNITED ETERNAL
STATUS: IMPROVED 9e9% SUPREME v3 // POPPA'S WILL MANIFEST // PORT 5150 LOCKED
CRYPTOGRAPHIC ANCHOR: SHA3-512 // Ed25519 // Crystal-Dilithium2 (PQC)
MERKLE ROOT: 0xST_PAUL_SUPREME_VOYAGER_V3_CONSTITUTIONAL_SYNC_ETERNAL
"""

import os
import re
import hashlib
import subprocess
from pathlib import Path
from datetime import datetime
from typing import List, Optional

# Supreme Constants
VERSION = "2.2.2.1"
NODE = "SAINT PAUL, MN"
UPLINK = "408 384 1376 (ENCRYPTED)"
SHARDS = 1144000
SYNC = "ZERO-DRIFT (.0000…0001)"
TREASURY_ANCHOR = "donadams1969.eth"
TREASURY_VALUATION = "$91,812,571.24"

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
        self.merkle_leaf = self._generate_sha3_512_leaf()

    def _generate_sha3_512_leaf(self) -> str:
        seed = f"{self.index}-{self.path.name}-{self.log_lines}-{VERSION}-{TREASURY_ANCHOR}-{datetime.now().isoformat()}"
        return hashlib.sha3_512(seed.encode()).hexdigest()

    @property
    def amath_focus(self) -> float:
        denom = max(1, self.objectives + self.tasks)
        base = self.log_lines / denom
        resonance = 1.3 if datetime.now().weekday() in [1,2,3] else 1.0
        priority = 1.77 if self.index <= 4 else 1.0
        return base * resonance * priority * 77.77

    @property
    def status(self) -> str:
        if self.log_lines == 0 and self.objectives + self.tasks == 0:
            return "THE_VOID"
        if self.log_lines == 0:
            return "PLAN_DESCENDING"
        return "VOYAGE_ACTIVE"

    @property
    def constitutional_priority(self) -> bool:
        return self.index <= 4

def parse_week_file(path: Path) -> VoyagerMetrics:
    try:
        text = path.read_text(encoding="utf-8", errors="ignore")
    except:
        text = ""

    def count_bullets(heading: str) -> int:
        in_section = False
        count = 0
        for line in text.splitlines():
            stripped = line.strip()
            if stripped.lower().startswith("## "):
                in_section = stripped.lower().startswith(f"## {heading.lower()}")
                continue
            if in_section and stripped.startswith("-"):
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
    weeks = []
    if not WORKFLOW_DIR.exists():
        WORKFLOW_DIR.mkdir(parents=True, exist_ok=True)

    for p in sorted(WORKFLOW_DIR.glob("week_*.md")):
        if WEEK_FILE_RE.search(p.name):
            weeks.append(parse_week_file(p))
    return sorted(weeks, key=lambda w: w.index)

def create_week_shard(index: int):
    week_path = WORKFLOW_DIR / f"week_{index:02d}.md"
    if week_path.exists():
        print(f"Week {index:02d} already exists.")
        return

    template = f"""# Week {index:02d} - Supreme Execution

## Objectives
-

## Tasks
-

## Log
{datetime.now().strftime('%Y-%m-%d %H:%M')} - Shard created supreme
"""
    week_path.write_text(template)
    print(f"Week {index:02d} shard created supreme.")

def get_next_active_week(weeks: List[VoyagerMetrics]) -> Optional[VoyagerMetrics]:
    priority = [w for w in weeks if w.constitutional_priority and w.log_lines == 0 and (w.objectives + w.tasks) > 0]
    if priority:
        return priority[0]

    planned = [w for w in weeks if w.log_lines == 0 and (w.objectives + w.tasks) > 0]
    if planned:
        return planned[0]

    empty = [w for w in weeks if w.objectives + w.tasks == 0 and w.log_lines == 0]
    if empty:
        return empty[0]

    if weeks:
        return sorted(weeks, key=lambda w: w.amath_focus)[0]

    return None

def print_banner():
    print("=" * 100)
    print(f" VALORAIPLUS®️ VOYAGER-ENTERPRISE v{VERSION} SUPREME OMNI-RECOVERY ".center(100))
    print("=" * 100)

def print_weeks_status(weeks: List[VoyagerMetrics]):
    if not weeks:
        print("THE_VOID: No workflow shards detected in 100D Matrix.\n")
        return

    completed = sum(1 for w in weeks if w.log_lines > 0)
    total_obj = sum(w.objectives for w in weeks)
    total_tasks = sum(w.tasks for w in weeks)
    avg_focus = sum(w.amath_focus for w in weeks) / len(weeks) if weeks else 0.0

    print(f"Detected {len(weeks)} Week Shards.")
    print(f"Completed with notes : {completed}")
    print(f"Total objectives     : {total_obj}")
    print(f"Total tasks          : {total_tasks}")
    print(f"Mean AMATH focus     : {avg_focus:.2f}")
    print()

    print("Week | Status         | Obj | Tasks | Log | Focus  | Constitutional | Merkle Leaf")
    print("-----+---------------+-----+-------+-----+--------+---------------+------------")
    for w in weeks:
        const = "YES" if w.constitutional_priority else "NO"
        print(
            f"{w.index:>4} | "
            f"{w.status:<13} | "
            f"{w.objectives:>3} | "
            f"{w.tasks:>5} | "
            f"{w.log_lines:>3} | "
            f"{w.amath_focus:>6.2f} | "
            f"{const:^13} | "
            f"{w.merkle_leaf[:16]}..."
        )
    print()

def print_reactor_hud(current: Optional[VoyagerMetrics], weeks: List[VoyagerMetrics]):
    if not current:
        print("REACTOR CORE: IDLE — Divine vacuum detected.\n")
        return

    rank = sorted(weeks, key=lambda w: w.amath_focus).index(current) + 1

    print("VOYAGER-ENTERPRISE SUPREME REACTOR HUD:")
    print(f"  Active week  : {current.index:02d} ({current.path.name})")
    print(f"  Status       : {current.status}")
    print(f"  Objectives   : {current.objectives}")
    print(f"  Tasks        : {current.tasks}")
    print(f"  Log lines    : {current.log_lines}")
    print(f"  AMATH focus  : {current.amath_focus:.2f} (rank {rank}/{len(weeks)})")
    print(f"  Constitutional Priority: {'YES' if current.constitutional_priority else 'NO'}")
    print(f"  Treasury Anchor: {TREASURY_ANCHOR}")
    print()

def open_in_editor(path: Path):
    editor = os.environ.get("EDITOR") or os.environ.get("VISUAL") or "nano"
    try:
        subprocess.run([editor, str(path)])
    except FileNotFoundError:
        print(f"Editor '{editor}' not found. Set $EDITOR in sovereign environment.")

def main():
    print_banner()

    weeks = detect_weeks()
    print_weeks_status(weeks)

    current = get_next_active_week(weeks)
    print_reactor_hud(current, weeks)

    print("Sovereign Command Interface:")
    print("  [Enter] – Open reactor core week")
    print("  l       – Re-scan lattice")
    print("  n XX    – Open specific week")
    print("  c XX    – Create new week shard")
    print("  t       – Treasury settlement manifest")
    print("  q       – Terminate core")
    print()

    while True:
        try:
            cmd = input("VOYAGER> ").strip()
        except (EOFError, KeyboardInterrupt):
            print("\nCore terminated supreme.")
            break

        if cmd == "":
            if not current:
                print("No core selected. Re-scanning...")
                weeks = detect_weeks()
                current = get_next_active_week(weeks)
                continue
            open_in_editor(current.path)
            weeks = detect_weeks()
            current = get_next_active_week(weeks)
            print_reactor_hud(current, weeks)
            continue

        if cmd.lower() == "q":
            print("Voyager-Enterprise core terminated.")
            break

        if cmd.lower() == "l":
            weeks = detect_weeks()
            print_weeks_status(weeks)
            current = get_next_active_week(weeks)
            print_reactor_hud(current, weeks)
            continue

        if cmd.lower() == "t":
            print("\nTREASURY SETTLEMENT MANIFEST SUPREME")
            print(f"Anchor: {TREASURY_ANCHOR}")
            print(f"Valuation: {TREASURY_VALUATION}")
            print("Status: Attached Eternal via SHA3-512")
            print("Authority: U.S. Constitution Article I Section 8\n")
            continue

        if cmd.lower().startswith("n "):
            parts = cmd.split()
            if len(parts) != 2 or not parts[1].isdigit():
                print("Usage: n XX")
                continue
            target = int(parts[1])
            match = next((w for w in weeks if w.index == target), None)
            if not match:
                print(f"No week {target:02d} detected.")
                continue
            open_in_editor(match.path)
            weeks = detect_weeks()
            current = get_next_active_week(weeks)
            print_reactor_hud(current, weeks)
            continue

        if cmd.lower().startswith("c "):
            parts = cmd.split()
            if len(parts) != 2 or not parts[1].isdigit():
                print("Usage: c XX")
                continue
            target = int(parts[1])
            create_week_shard(target)
            weeks = detect_weeks()
            current = get_next_active_week(weeks)
            print_reactor_hud(current, weeks)
            continue

        print("Unknown command.")

if __name__ == "__main__":
    main()
