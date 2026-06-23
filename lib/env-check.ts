export function validateProductionEnv() {
  if (process.env.NODE_ENV === 'production') {
    const requiredKeys = ['SUPABASE_SERVICE_ROLE_KEY', 'RESEND_API_KEY'];
    for (const key of requiredKeys) {
      if (!process.env[key]) {
        throw new Error(`CRITICAL: Missing environment variable: ${key}`);
      }
    }
  }
}
