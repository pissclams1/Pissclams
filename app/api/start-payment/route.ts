import { NextResponse } from "next/server";
import { planMode, priceMap, stripe } from "../../../lib/stripe";

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const plan = String(body.plan || "publish_gap");
  const listingId = String(body.listingId || "");
  const ownerToken = String(body.ownerToken || "");
  const email = body.email ? String(body.email) : undefined;
  const origin = request.headers.get("origin") || process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  if (!stripe) {
    return NextResponse.json({ ok: false, message: "Payment is not configured yet." }, { status: 503 });
  }

  const price = priceMap[plan];
  if (!price) return NextResponse.json({ ok: false, message: `Missing price for ${plan}.` }, { status: 400 });
  if (plan === "publish_gap" && (!listingId || !ownerToken)) return NextResponse.json({ ok: false, message: "Analyze and save a listing before publishing." }, { status: 400 });

  const session = await stripe.checkout.sessions.create({
    mode: planMode(plan),
    ...(planMode(plan) === "payment" ? { customer_creation: "always" as const } : {}),
    line_items: [{ price, quantity: 1 }],
    customer_email: email,
    allow_promotion_codes: true,
    success_url: `${origin}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/pricing`,
    metadata: { product: "gapstay", plan, listingId, ownerToken }
  });

  return NextResponse.json({ ok: true, url: session.url });
}
