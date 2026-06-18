import { createHash } from "crypto";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export function gapStayHeaders(ownerToken?: string, prefer?: string) {
  if (!supabaseKey) throw new Error("Supabase is not configured.");
  return {
    apikey: supabaseKey,
    Authorization: `Bearer ${supabaseKey}`,
    "Content-Type": "application/json",
    ...(ownerToken ? { "x-gapstay-owner-token": ownerToken } : {}),
    ...(prefer ? { Prefer: prefer } : {})
  };
}

export function gapStayRest(path: string) {
  if (!supabaseUrl) throw new Error("Supabase is not configured.");
  return `${supabaseUrl}/rest/v1/${path}`;
}

export function ownerTokenHash(ownerToken: string) {
  return createHash("sha256").update(ownerToken).digest("hex");
}

export async function finalizePaidListing(input: { listingId: string; ownerToken: string; sessionId: string; customerId?: string | null; email?: string | null; plan?: string; amountCents?: number | null }) {
  const paidUntil = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
  const listingResponse = await fetch(gapStayRest(`gapstay_listings?id=eq.${encodeURIComponent(input.listingId)}`), {
    method: "PATCH",
    headers: gapStayHeaders(input.ownerToken),
    body: JSON.stringify({ publish_status: "published", paid_until: paidUntil, stripe_session_id: input.sessionId, stripe_customer_id: input.customerId || null, plan_code: input.plan || "publish_gap", amount_cents: input.amountCents || 1900 })
  });
  if (!listingResponse.ok) throw new Error(`Could not publish listing: ${await listingResponse.text()}`);

  const paymentResponse = await fetch(gapStayRest("gapstay_payments?on_conflict=stripe_session_id"), {
    method: "POST",
    headers: gapStayHeaders(input.ownerToken, "resolution=merge-duplicates"),
    body: JSON.stringify({ stripe_session_id: input.sessionId, stripe_customer_id: input.customerId || null, buyer_email: input.email || null, plan_code: input.plan || "publish_gap", listing_id: input.listingId, amount_cents: input.amountCents || 1900, status: "paid" })
  });
  if (!paymentResponse.ok) throw new Error(`Could not record payment: ${await paymentResponse.text()}`);
}
