# Brownstone AI & Infrastructure

A high-performance, edge-deployed lead generation and telemetry tracking platform for Fractional CIO & AI Strategy services.

## Architecture

This platform is engineered for maximum security, zero-trust data sovereignty, and zero-cost operational scalability.

- **Framework:** Next.js 16 (App Router)
- **Build Adapter:** OpenNext for Cloudflare (`@opennextjs/cloudflare`)
- **Deployment:** Cloudflare Workers (Edge Network via Wrangler)
- **Database:** Supabase (PostgreSQL)
- **Email Notifications:** Resend API (fetch-based, edge-compatible)
- **Styling:** Tailwind CSS v4
- **Security:**
  - Row-Level Security (Append-Only Ingestion Vault)
  - Next.js Server Actions with built-in Honeypot spam mitigation
  - Edge-runtime API processing

## Environment Variables

The following secrets must be configured in the Cloudflare Dashboard (**Workers & Pages > brownstone-web > Settings > Variables**) and in `.dev.vars` for local development:

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key (for server-side inserts) |
| `RESEND_API_KEY` | Resend API key for email notifications |
| `ADMIN_EMAIL` | Primary notification recipient (e.g., mychael.brown@brownstone-ai.com) |
| `ADMIN_SMS_GATEWAY` | Email-to-SMS gateway for high-priority alerts |

## Development

Run the local Wrangler dev server (mirrors the Cloudflare Workers runtime):

```bash
npx wrangler dev


## Cloudflare Pages Deployment

This repository is optimized for **Cloudflare Pages**.
When connecting to Cloudflare:

1. Select **Next.js** as the framework preset.
2. Ensure the required environment variables (`NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`) are injected securely into the Cloudflare dashboard.
3. The `@cloudflare/next-on-pages` adapter will automatically compile the Server Actions to run natively on Cloudflare's Edge V8 isolates.
