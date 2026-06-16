#!/usr/bin/env bash
# Executes the RLS policies from 002_android_rebuild.sql against a live Postgres.
# Usage: PGHOST=localhost PGPORT=55432 ./run_rls_tests.sh
set -u
PSQL="psql -h ${PGHOST:-localhost} -p ${PGPORT:-55432} -U ${PGUSER:-postgres} -d ${PGDB:-sohoj} -v ON_ERROR_STOP=1 -qtA"
HERE="$(cd "$(dirname "$0")" && pwd)"

echo "== applying harness + migration + grants + seed =="
$PSQL -q -f "$HERE/rls_harness.sql"
$PSQL -q -f "$HERE/../migrations/002_android_rebuild.sql"
$PSQL -q -f "$HERE/rls_grants.sql"
$PSQL -q -f "$HERE/rls_seed.sql"

A=00000000-0000-0000-0000-0000000000aa
B=00000000-0000-0000-0000-0000000000bb
U1=00000000-0000-0000-0000-0000000000c1
DA=00000000-0000-0000-0000-0000000000da
DB=00000000-0000-0000-0000-0000000000db

pass=0; fail=0
ok()   { echo "PASS  $1"; pass=$((pass+1)); }
no()   { echo "FAIL  $1"; fail=$((fail+1)); }

# expect a scalar query (run as a role+uid) to equal a value
expect_eq() { # desc role uid sql expected
  local got; got=$($PSQL -c "set role $2; set app.uid='$3'; $4" 2>/dev/null | tr -d '[:space:]')
  [ "$got" = "$5" ] && ok "$1 (= $5)" || no "$1 (got '$got', want '$5')"
}
# expect an insert to be REJECTED by RLS
expect_blocked() { # desc role uid sql
  if $PSQL -c "set role $2; set app.uid='$3'; $4" >/dev/null 2>&1; then no "$1 (insert was ALLOWED)"; else ok "$1 (insert blocked)"; fi
}
# expect an insert to SUCCEED
expect_allowed() { # desc role uid sql
  if $PSQL -c "set role $2; set app.uid='$3'; $4" >/dev/null 2>&1; then ok "$1 (insert allowed)"; else no "$1 (insert blocked)"; fi
}

echo "== assertions =="
expect_eq  "tenant isolation: u1 sees only own txns"      authenticated "$U1" "select count(*) from bkash_transactions;" "1"
expect_eq  "no cross-tenant rows visible"                  authenticated "$U1" "select count(*) from bkash_transactions where organization_id='$B';" "0"
expect_eq  "org-member isolation"                          authenticated "$U1" "select count(*) from organization_members;" "1"
expect_eq  "subscriptions isolation (none cross-tenant)"   authenticated "$U1" "select count(*) from android_devices where organization_id='$B';" "0"
expect_allowed "device-scoped insert (own active device)"  authenticated "$U1" "insert into bkash_transactions(organization_id,device_id,type,amount,fee,source,dedupe_hash) values ('$A','$DA','cash_in',1,0,'manual_paste','t_ok');"
expect_blocked "cross-device insert blocked"               authenticated "$U1" "insert into bkash_transactions(organization_id,device_id,type,amount,fee,source,dedupe_hash) values ('$A','$DB','cash_in',1,0,'manual_paste','t_xd');"
expect_blocked "cross-tenant insert blocked"               authenticated "$U1" "insert into bkash_transactions(organization_id,device_id,type,amount,fee,source,dedupe_hash) values ('$B','$DB','cash_in',1,0,'manual_paste','t_xt');"
expect_blocked "audit_logs client insert blocked"          authenticated "$U1" "insert into audit_logs(action) values ('forge');"
expect_blocked "usage_events client insert blocked"        authenticated "$U1" "insert into usage_events(organization_id,kind) values ('$A','forge');"
expect_eq  "anon sees nothing"                             anon          ""    "select count(*) from bkash_transactions;" "0"

echo "== result: $pass passed, $fail failed =="
[ "$fail" -eq 0 ]
