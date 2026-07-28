# VALORAIPLUS™ OMNIBUS CODEX — USAGE GUIDE

## Quick Start
```
# Validate POS
python3 scripts/validate_pos.py reports/POS_77_77X_LEGAL_ANCHOR_v0.json schemas/pos_77_77x_schema.json

# Validate Flatline
python3 scripts/validate_flatline.py reports/VALORAIPLUS_TRAFFIC_FLATLINE_REPORT_v0.json schemas/traffic_flatline_schema.json

# Math lane tag
python3 scripts/math_lane_tag.py 7460035951

# Log timestamp
./scripts/timestamp_log.sh

# Append note
python3 scripts/append_note.py reports/VALORAIPLUS_TRAFFIC_FLATLINE_REPORT_v0.json "Your note here"

# Hash snapshot
./scripts/hash_snapshot.sh
```

## File Structure
```
├── reports/               # JSON reports (POS, Tokenomics, Flatline)
├── schemas/               # JSON Schema validators
├── scripts/               # Python & Bash utilities
├── logs/                  # Timestamp and operation logs
├── exports/               # Hash manifests
├── audit/                 # Audit chain (if extended)
├── diagrams/              # Generated flowcharts (if extended)
├── README_SCOPE_GUARD.md  # Critical: read first
└── USAGE.md               # This file
```

## Next Steps
1. Review `README_SCOPE_GUARD.md` — understand what this is and isn't
2. Run validators to ensure all reports are schema-valid
3. Update `SGAU_TOKENOMICS.v0.json` with your actual values
4. Use timestamp logs to create audit trail of your observations
5. For legal action: engage licensed counsel using these records as supporting documentation

---
**All code is local-only, descriptive, and non-fabricating.**
