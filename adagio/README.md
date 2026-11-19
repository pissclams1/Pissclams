# Adagio (swipe prototype)

Build spec: v0.1. This scaffold covers schema/RLS, seed script, API routes, `lib/distribution.ts` + tests. UI and `/admin/metrics` page are not built yet.

## Setup
1. Create a Supabase project, run `supabase/migrations/001_init.sql`.
2. Copy `.env.example` to `.env.local` and fill in values.
3. `npm i && npm test`
4. Placeholder art is already generated (`scripts/gen_placeholders.py`, served from `public/seed`) and rows are loaded. For real art, use `npm run seed -- seed.csv ./images` (needs the service-role key). Permission log: `PERMISSIONS.md`.

## Env vars (also set on Vercel)
- `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` (server only)
- `METRICS_SECRET` (header `x-metrics-secret`)

Vercel: set Root Directory to `adagio`.
