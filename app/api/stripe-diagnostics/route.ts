import { NextResponse } from "next/server";
import { stripe } from "../../../lib/stripe";

export async function GET(request: Request) {
  if (!stripe) {
    return NextResponse.json({ ok: false, message: "Stripe is not configured." }, { status: 503 });
  }

  const { searchParams } = new URL(request.url);
  const sessionId = searchParams.get("session_id");

  try {
    const account = await stripe.accounts.retrieve();
    const result: any = {
      ok: true,
      account: {
        id: account.id,
        email: account.email || null,
        country: account.country || null,
        business_profile: account.business_profile || null,
        charges_enabled: account.charges_enabled,
        payouts_enabled: account.payouts_enabled
      }
    };

    if (sessionId) {
      const session = await stripe.checkout.sessions.retrieve(sessionId, {
        expand: ["payment_intent", "line_items"]
      });
      result.session = {
        id: session.id,
        mode: session.mode,
        status: session.status,
        payment_status: session.payment_status,
        amount_total: session.amount_total,
        currency: session.currency,
        customer: session.customer,
        customer_email: session.customer_details?.email || session.customer_email || null,
        payment_intent: typeof session.payment_intent === "string" ? session.payment_intent : session.payment_intent?.id || null,
        metadata: session.metadata || {}
      };
    }

    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json({ ok: false, message: err.message }, { status: 500 });
  }
}
