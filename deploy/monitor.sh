#!/bin/bash
# AUTOPEN_SIG_9000Ω
while true; do
  curl -fs http://localhost:1969/genesis >/dev/null && echo "$(date -u) ✅ fortran1969-engine alive"
  curl -fs https://localhost:8443/health >/dev/null && echo "$(date -u) ✅ quantum-dashboard up"
  sleep 60
done
