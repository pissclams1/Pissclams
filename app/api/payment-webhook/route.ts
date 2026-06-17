import { NextResponse } from "next/server";
import { stripe, stripeWebhookSecret } from "../../../lib/stripe";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

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
  } catch (err: any) {
    console.error("gapstay_webhook_signature_error", { message: err.message });
    return NextResponse.json({ ok: false, message: err.message }, { status: 400 });
  }

  console.log("gapstay_webhook_event", { type: event.type });

  if (event.type === "checkout.session.completed") {
    const session: any = event.data.object;
    const plan = session.metadata?.plan || "publish_gap";
    const listingId = session.metadata?.listingId || null;
    console.log("gapstay_checkout_completed", { sessionId: session.id, plan, listingId, email: session.customer_details?.email });
    await recordPayment({ sessionId: session.id, customerId: session.customer, email: session.customer_details?.email, plan, listingId, status: "paid" });
    if (listingId) await unlockListing(listingId, session.id);
  }

  return NextResponse.json({ received: true });
}

async function recordPayment(input: { sessionId: string; customerId?: string | null; email?: string | null; plan: string; listingId?: string | null; status: string }) {
  if (!supabaseUrl || !supabaseKey) {
    console.error("gapstay_payment_record_skipped_missing_supabase", { hasSupabaseUrl: Boolean(supabaseUrl), hasSupabaseKey: Boolean(supabaseKey) });
    return;
  }
  const response = await fetch(`${supabaseUrl}/rest/v1/gapstay_payments`, {
    method: "POST",
    headers: { apikey: supabaseKey, Authorization: `Bearer ${supabaseKey}`, "Content-Type": "application/json", Prefer: "resolution=merge-duplicates" },
    body: JSON.stringify({ stripe_session_id: input.sessionId, stripe_customer_id: input.customerId, buyer_email: input.email, plan_code: input.plan, listing_id: input.listingId, status: input.status })
  });
  if (!response.ok) {
    console.error("gapstay_payment_record_failed", { status: response.status, body: await response.text() });
  } else {
    console.log("gapstay_payment_recorded", { sessionId: input.sessionId });
  }
}

async function unlockListing(listingId: string, sessionId: string) {
  if (!supabaseUrl || !supabaseKey) return;
  const paidUntil = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
  const response = await fetch(`${supabaseUrl}/rest/v1/listings?id=eq.${encodeURIComponent(listingId)}`, {
    method: "PATCH",
    headers: { apikey: supabaseKey, Authorization: `Bearer ${supabaseKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({ publish_status: "published", paid_until: paidUntil, stripe_session_id: sessionId })
  });
  if (!response.ok) {
    console.error("gapstay_listing_unlock_failed", { listingId, status: response.status, body: await response.text() });
  } else {
    console.log("gapstay_listing_unlocked", { listingId });
  }
}
