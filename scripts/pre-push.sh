#!/bin/bash
# /scripts/pre-push.sh

echo "--- Brownstone Security Gate: Scanning ---"

# Check for hardcoded secrets
if grep -r "NEXT_PUBLIC_" . | grep -q "KEY\|SECRET"; then
  echo "CRITICAL: Potential secret leak detected!"
  exit 1
fi

# Audit high-level vulnerabilities
npm audit --audit-level=high || exit 1

echo "--- Security Gate Passed ---"