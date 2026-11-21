# Adagio (swipe prototype)

Build spec: v0.1. This scaffold covers schema/RLS, seed script, API routes, `lib/distribution.ts` + tests. UI and `/admin/metrics` page are not built yet.

## Setup
1. Create a Supabase project, run `supabase/migrations/001_init.sql`.
2. Copy `.env.example` to `.env.local` and fill in values.
3. `npm i && npm test`
4. Put your images and `seed.csv` in `adagio/seed/` (columns: `title,creator_name,tools,commercial_ok,category,filename`, optional `portfolio_url,contact_email`). Check them with `npm run seed -- seed --dry-run`, then load with `npm run seed -- seed` (add `--deactivate-others` to retire the old placeholder rows). Log permissions in `PERMISSIONS.md`. A 12-image test set is in `seed-test/`.

## Env vars (also set on Vercel)
- `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` (server only)
- `METRICS_SECRET` (header `x-metrics-secret`)

Vercel: set Root Directory to `adagio`.
