#!/usr/bin/env bash
# Runs the submitLead tests on the emulators. The fake key means no real email is sent.
set -euo pipefail
trap 'rm -f functions/.secret.local' EXIT
echo "RESEND_API_KEY=re_test_invalid" > functions/.secret.local
firebase emulators:exec --only functions,firestore --project demo-growth-buddies "node --test tests/submit-lead.test.mjs"
