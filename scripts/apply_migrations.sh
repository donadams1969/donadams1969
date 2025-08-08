#!/usr/bin/env bash
set -euo pipefail
psql "${POSTGRES_DSN/postgresql+psycopg2/postgresql}" -f migrations/001_init.sql
echo "Migrations applied."
