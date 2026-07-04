#!/usr/bin/env bash
# Recrée une base propre, applique les migrations et lance les tests.
# Usage : supabase/tests/run.sh
set -euo pipefail
DB=forma_test
PSQL="psql -v ON_ERROR_STOP=1 -X -q"
HERE="$(cd "$(dirname "$0")" && pwd)"
MIG="$HERE/../migrations"

run() { su postgres -c "$PSQL -d $DB -f '$1'"; }

su postgres -c "dropdb --if-exists $DB"
su postgres -c "createdb $DB"

run "$HERE/00_auth_shim.sql"
run "$MIG/0001_schema.sql"
run "$MIG/0002_rls.sql"
run "$MIG/0003_functions.sql"
run "$HERE/01_grants.sql"
su postgres -c "$PSQL -d $DB -f '$HERE/10_tests.sql'"
