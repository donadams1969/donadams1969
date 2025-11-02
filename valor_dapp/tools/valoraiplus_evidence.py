import json

print("Generating evidence bundle...")
evidence = {"evidence": "bundle"}
with open("evidence/valoraiplus_evidence_bundle.json", "w") as f:
    json.dump(evidence, f)
print("Evidence bundle generated.")
