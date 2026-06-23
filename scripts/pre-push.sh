#!/bin/bash
echo "--- Brownstone Security Gate: Scanning ---"

# Flag if we find a secret definition (e.g., = 'value')
# IGNORE node_modules and ignore process.env/Deno.env lookups
if grep -rE "(SERVICE_ROLE_KEY|RESEND_API_KEY|SECRET|PASSWORD)\s*=\s*['\"]" . \
  --exclude-dir=node_modules \
  --include="*.ts" --include="*.tsx" --include="*.js" | grep -vE "process\.env|Deno\.env"; then
  echo "CRITICAL: Hardcoded secret value detected in source code!"
  exit 1
fi

echo "--- Security Gate Passed ---"