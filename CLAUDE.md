# AdStake — Claude Code Instructions

## Repo
This is the AdStake codebase. Live site: useadstake.com
Stack: Next.js (App Router), Supabase, Stripe, deployed on Vercel.

## Branch rules
- `main` is the only branch. Always commit to `main` (or a `claude/...` session branch that gets PR'd into `main`).
- Never create long-lived feature branches without explicit instruction.
- Never deploy directly from a branch other than `main` via the Vercel CLI. Doing so in the past caused production to end up out of sync with what's in git — see "Known incident" below.
- Always confirm the current production deployment's commit SHA (Vercel deployment `meta.githubCommitSha`) matches `main`'s HEAD before making changes, and confirm it again before any deploy.

## Known incident (read before touching deploys or branches)
A branch called `rebuild-assurance` once held a fully-built version of AdStake (real Stripe checkout, Supabase-backed accounts, an audit flow at `/audit/new`, `/agencies`, `/blog`, `/guides`, `/sample-report`, quarterly Continuous Assurance plan) and was deployed to production directly via the Vercel CLI, bypassing `main`. `main` was far behind — it still had `package.json` name `"gapstay"` and dozens of unrelated dead routes. At some point `main` was redeployed to production, overwriting the real build with the stale one. `rebuild-assurance` was then deleted and its commits are unreachable (confirmed via GitHub API and `git fetch` by SHA — this is permanent, not recoverable from git).

**Lesson: never deploy to production from anything other than `main`, and never delete a branch that production is currently running from until `main` has caught up and been verified live.** If a Vercel deployment's `meta.githubCommitRef` isn't `main`, stop and flag it before doing anything else.

As of this writing, `main` has been cleaned of dead GapStay/Cleanup Desk code (see below) but does **not** contain the real Stripe/Supabase/audit-flow implementation — that logic needs to be rebuilt from scratch or recovered from another source (a local clone, a teammate's checkout, etc.), it cannot be reconstructed from this repo alone.

## What this repo is
AdStake is an independent marketing audit product. It is NOT:
- GapStay (short-term rental tool — defunct, code removed from `main`)
- Cleanup Desk (bookkeeping cleanup-prep tool — defunct, code removed from `main`)
- BindIQ (property inspection/underwriting tool — separate Vercel project, not in this repo)

If you encounter code referencing any of the above, it is dead code and can be removed.

## Key files (current state of `main`)
- `app/layout.tsx` — global nav, footer, metadata
- `app/page.tsx` — homepage
- `app/globals.css` — all styles
- `app/connect/page.tsx` — audit request form (posts to `/api/audit-request`, sends email via Resend — this is NOT the real audit flow the live site currently runs; the live site's real flow is at `/audit/new` and is not present in this repo)
- `app/api/audit-request/route.ts`, `app/api/geo/route.ts` — the only remaining API routes

Everything else that existed under `app/`, `components/`, and `lib/` (GapStay listing/host/dashboard code, Cleanup Desk intake/review-packet stubs, ~40 placeholder `cleanup-*` routes) has been deleted as dead code.

## Supabase
Project: adstake (`leaoopekngceqvrhsdpv`), region: us-east-1. This project has real user data (accounts, audits, subscriptions, agency accounts) — treat it as production, not a sandbox.
RLS is enabled on all tables. Do not disable RLS on any table.

## Vercel
Project: adstake, team: andreas11735-gmailcoms-projects
Should deploy automatically from `main`. Before deploying, verify the current production deployment's `githubCommitRef` — if it's not `main`, stop and ask before proceeding.

## Stripe
Account: "AdStake" (`acct_17R7shAD9v8suvv9`).
Per product intent: three audit tiers ($149 Marketing Health Audit, $399 Independent Audit, $1,500 Due Diligence Audit) plus a $129/quarter Continuous Assurance plan. This repo's current code does not implement Stripe checkout at all — confirm actual product/price IDs in the Stripe dashboard before wiring anything up, don't assume the numbers above are still current.
Do not change pricing without explicit instruction.
