# Adagio (swipe prototype)

Build spec: v0.1. This scaffold covers schema/RLS, seed script, API routes, `lib/distribution.ts` + tests. UI and `/admin/metrics` page are not built yet.

## Setup
1. Create a Supabase project, run `supabase/migrations/001_init.sql`.
2. Copy `.env.example` to `.env.local` and fill in values.
3. `npm i && npm test`
4. `npm run seed -- seed.csv ./images` (permission log for images: `PERMISSIONS.md`).

## Env vars (also set on Vercel)
- `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` (server only)
- `METRICS_SECRET` (header `x-metrics-secret`)

Vercel: set Root Directory to `adagio`.
