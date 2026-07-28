#!/usr/bin/env python3
import json, sys
from jsonschema import validate, ValidationError

if len(sys.argv) != 3:
    print("Usage: validate_flatline.py <report.json> <schema.json>")
    sys.exit(1)

with open(sys.argv[1]) as f:
    report = json.load(f)
with open(sys.argv[2]) as f:
    schema = json.load(f)

try:
    validate(instance=report, schema=schema)
    print("✓ Flatline schema-valid")
except ValidationError as e:
    print("✗ SCHEMA ERROR:", e.message)
    sys.exit(1)
