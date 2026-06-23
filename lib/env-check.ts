// /lib/env-check.ts
export function validateProductionEnv() {
  const required = ['SUPABASE_SERVICE_ROLE_KEY', 'RESEND_API_KEY'];
  required.forEach((key) => {
    if (!process.env[key]) {
      throw new Error(`CRITICAL: Missing production variable: ${key}`);
    }
  });
}