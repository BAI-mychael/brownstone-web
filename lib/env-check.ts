export function validateProductionEnv() {
  // If we are currently building, skip the check
  if (process.env.NEXT_PHASE === 'phase-production-build') {
    return;
  }

  // Otherwise, run the security check
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error("CRITICAL: Missing environment variable: SUPABASE_SERVICE_ROLE_KEY");
  }
}
