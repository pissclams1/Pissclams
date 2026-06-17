# GapStay Real-Listing Stress Tests

Do not buy or attach a production domain until these pass on a temporary deploy.

## Pass/fail gates

A scenario passes only if:
- Analyzer accepts the inputs without breaking.
- Result shows fantasy revenue, likely Airbnb outcome, GapStay offer, monthly equivalent, saved turns, and certainty score.
- Listing preview is understandable to a host.
- Public page is shareable.
- Inquiry form submits.
- Dashboard records the inquiry.
- Payment page returns either a real Stripe checkout URL or a clear missing-config error.
- Auth returns either a real magic-link flow or a clear missing-config error.

## Scenario 1: Marco Island condo

Inputs:
- Market: Florida coastal
- Property: 2 bed / 2 bath condo
- Gap: 42 nights
- Nightly target: 210
- Expected occupancy: 43%
- Cleaning fee: 195

Expected interpretation:
- Good first demo case.
- Shows why fantasy revenue is misleading.
- GapStay offer should sit near likely Airbnb revenue but with fewer turns.

## Scenario 2: Orlando family STR

Inputs:
- Property: 4 bed vacation home
- Gap: 31 nights between family travel seasons
- Nightly target: 275
- Expected occupancy: 35%
- Cleaning fee: 240

Expected interpretation:
- Strong case for relocation or insurance displacement.
- Host may resist because nightly upside is high; math must explain probability-adjusted outcome.

## Scenario 3: Smoky Mountains cabin

Inputs:
- Property: 3 bed cabin
- Gap: 24 nights
- Nightly target: 235
- Expected occupancy: 45%
- Cleaning fee: 220

Expected interpretation:
- Borderline gap. Good test for whether the product overpromises.
- Recommendation should not pretend a 24-night gap is always easy to fill.

## Scenario 4: Myrtle Beach off-season unit

Inputs:
- Property: 1 bed beach condo
- Gap: 60 nights
- Nightly target: 145
- Expected occupancy: 28%
- Cleaning fee: 160

Expected interpretation:
- Strong soft-market case.
- Monthly equivalent should look guest-friendly.

## Scenario 5: Scottsdale seasonal house

Inputs:
- Property: 3 bed house
- Gap: 35 nights
- Nightly target: 320
- Expected occupancy: 50%
- Cleaning fee: 250

Expected interpretation:
- Must avoid underpricing too aggressively in a hot/seasonal market.
- Host should understand this as certainty pricing, not discount panic.

## Scenario 6: Small property manager portfolio

Inputs:
- 6 properties
- 9 gaps over next 90 days
- Mixed nightly rates: 130-325
- Expected occupancy: 25-55%

Expected interpretation:
- This is the $99 plan case.
- Dashboard should make portfolio recovered revenue obvious.

## Required pre-domain test evidence

Capture screenshots or notes for:
- Homepage
- Analyzer result
- Free preview
- $19 publish attempt
- $49 plan attempt
- Public listing page
- Inquiry form success
- Dashboard after inquiry
- Auth flow state
- Payment flow state

## Decision rule

Buy and attach a domain only after:
- Build passes.
- Temporary deploy works.
- Auth is verified or intentionally disabled behind a clear MVP gate.
- Stripe test checkout works.
- Webhook updates listing status.
- At least 5 real-listing scenarios produce sane outputs.
