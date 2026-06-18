import { NextResponse } from "next/server";
import { stripe, stripeWebhookSecret } from "../../../lib/stripe";
import { finalizePaidListing } from "../../../lib/gapstay-server";
import type Stripe from "stripe";

export async function POST(request: Request) {
  if (!stripe || !stripeWebhookSecret) {
    console.error("gapstay_webhook_not_configured", { hasStripe: Boolean(stripe), hasWebhookSecret: Boolean(stripeWebhookSecret) });
    return NextResponse.json({ ok: false, message: "Webhook not configured." }, { status: 503 });
  }

  const body = await request.text();
  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    console.error("gapstay_webhook_missing_signature");
    return NextResponse.json({ ok: false, message: "Missing signature." }, { status: 400 });
  }

  let event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, stripeWebhookSecret);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Invalid signature.";
    console.error("gapstay_webhook_signature_error", { message });
    return NextResponse.json({ ok: false, message }, { status: 400 });
  }

  console.log("gapstay_webhook_event", { type: event.type });

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const plan = session.metadata?.plan || "publish_gap";
    const listingId = session.metadata?.listingId || null;
    const ownerToken = session.metadata?.ownerToken || null;
    console.log("gapstay_checkout_completed", { sessionId: session.id, plan, listingId, email: session.customer_details?.email });
    if (listingId && ownerToken) await finalizePaidListing({ listingId, ownerToken, sessionId: session.id, customerId: typeof session.customer === "string" ? session.customer : session.customer?.id, email: session.customer_details?.email, plan, amountCents: session.amount_total });
  }

  return NextResponse.json({ received: true });
}
