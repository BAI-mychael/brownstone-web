# Brownstone AI & Infrastructure

A high-performance, edge-deployed lead generation and telemetry tracking platform for Fractional CIO & AI Strategy services.

## Architecture

This platform has been engineered for maximum security, zero-trust data sovereignty, and zero-cost operational scalability.

- **Framework:** Next.js (App Router)
- **Deployment:** Cloudflare Pages (Edge Network via `@cloudflare/next-on-pages`)
- **Database:** Supabase (PostgreSQL)
- **Styling:** Tailwind CSS v4
- **Security:** 
  - Row-Level Security (Append-Only Ingestion Vault)
  - Next.js Server Actions with built-in Honeypot spam mitigation
  - Edge-runtime API processing

## Development

First, run the development server locally:

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) with your browser to see the result.

## Cloudflare Pages Deployment

This repository is optimized for **Cloudflare Pages**. 
When connecting to Cloudflare:
1. Select **Next.js** as the framework preset.
2. Ensure the required environment variables (`NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`) are injected securely into the Cloudflare dashboard.
3. The `@cloudflare/next-on-pages` adapter will automatically compile the Server Actions to run natively on Cloudflare's Edge V8 isolates.
