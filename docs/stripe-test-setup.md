# GapStay Stripe Test Setup

Stripe account:
- Display name: Lease Offer
- Account ID: acct_17R7shAD9v8suvv9
- Mode: test

Product:
- GapStay: prod_UiprtTrTCUly0k

Prices:
- STRIPE_PRICE_PUBLISH_GAP=price_1TjOCmAD9v8suvv97mAKJmV6
- STRIPE_PRICE_HOST_MONTHLY=price_1TjODAAD9v8suvv9LzHwrAFS
- STRIPE_PRICE_PORTFOLIO_MONTHLY=price_1TjODFAD9v8suvv9SNP25MsL

Plans:
- $19 one-time: Publish one gap page for 30 days
- $49/month: One property plan
- $99/month: Portfolio plan

Required deploy secrets:
- STRIPE_SECRET_KEY
- STRIPE_WEBHOOK_SECRET
- STRIPE_PRICE_PUBLISH_GAP
- STRIPE_PRICE_HOST_MONTHLY
- STRIPE_PRICE_PORTFOLIO_MONTHLY

Required test route:
- /payment/test

Expected result:
- If Stripe is configured, /payment/test creates a checkout session and redirects to Stripe.
- If Stripe is not configured, /payment/test shows a clear config error.

Webhook route:
- /api/payment-webhook

Webhook event needed:
- checkout.session.completed

After webhook success:
- Insert payment into gapstay_payments
- Mark listing publish_status as published
- Set paid_until 30 days forward for one-gap publishing
- Store stripe_session_id on listing
