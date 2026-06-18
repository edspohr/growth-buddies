#!/usr/bin/env bash
# Verifies hreflang reciprocal cluster across all 4 country pages + homepage.
# Usage: bash scripts/check-hreflang.sh

ROOT="$(cd "$(dirname "$0")/.." && pwd)"

PASS=0
FAIL=0

check_line() {
  local file="$1"
  local locale="$2"
  local url="$3"
  local pattern="hreflang=\"${locale}\" href=\"${url}\""
  if grep -qF "${pattern}" "${file}"; then
    printf "    ✓  %-12s → %s\n" "${locale}" "${url}"
    PASS=$((PASS + 1))
  else
    printf "    ✗  %-12s → %s  [MISSING]\n" "${locale}" "${url}"
    FAIL=$((FAIL + 1))
  fi
}

check_page() {
  local file="$1"
  local label="$2"
  echo ""
  echo "  Page: ${label}  (${file#$ROOT/})"
  echo "  ──────────────────────────────────────────────"
  check_line "$file" "es-CL"    "https://growthbuddies.cl/"
  check_line "$file" "es-CO"    "https://growthbuddies.cl/colombia"
  check_line "$file" "es-PE"    "https://growthbuddies.cl/peru"
  check_line "$file" "es-EC"    "https://growthbuddies.cl/ecuador"
  check_line "$file" "es"       "https://growthbuddies.cl/"
  check_line "$file" "x-default" "https://growthbuddies.cl/"
}

echo ""
echo "══════════════════════════════════════════════════"
echo "  hreflang cluster verification"
echo "══════════════════════════════════════════════════"

check_page "${ROOT}/index.html"          "/"
check_page "${ROOT}/colombia/index.html" "/colombia"
check_page "${ROOT}/peru/index.html"     "/peru"
check_page "${ROOT}/ecuador/index.html"  "/ecuador"

echo ""
echo "══════════════════════════════════════════════════"
echo "  Results: ${PASS} passed, ${FAIL} failed"
echo "══════════════════════════════════════════════════"
echo ""

if [ "${FAIL}" -gt 0 ]; then
  exit 1
fi
