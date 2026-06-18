import Link from "next/link";
import { finalizePaidListing } from "../../../lib/gapstay-server";
import { stripe } from "../../../lib/stripe";

export default async function PaymentSuccessPage({ searchParams }: { searchParams: Promise<{ session_id?: string }> }) {
  const { session_id } = await searchParams;
  const session = session_id && stripe ? await stripe.checkout.sessions.retrieve(session_id) : null;
  const listingId = session?.metadata?.listingId;
  const ownerToken = session?.metadata?.ownerToken;
  const paid = session?.payment_status === "paid";
  let published = false;
  if (paid && listingId && ownerToken) {
    await finalizePaidListing({ listingId, ownerToken, sessionId: session.id, customerId: typeof session.customer === "string" ? session.customer : session.customer?.id, email: session.customer_details?.email, plan: session.metadata?.plan || "publish_gap", amountCents: session.amount_total });
    published = true;
  }
  return <main className="wrap section topspace">
    <div className="card pad">
      <p className="kicker">{published ? "Offer published" : "Payment status"}</p>
      <h1 className="big">{published ? "Your furnished-stay offer is live." : "We could not confirm this payment."}</h1>
      <p className="muted">{published ? "Share the public page anywhere furnished renters look. New inquiries will appear in your dashboard." : "Return to your analysis and try checkout again, or contact support if you were charged."}</p>
      <div className="actions">
        {published && listingId ? <Link className="darkpill" href={`/listing/${listingId}`}>Open public listing</Link> : <Link className="darkpill" href="/host">Return to analysis</Link>}
        <Link className="pill" href="/dashboard">Open dashboard</Link>
      </div>
    </div>
  </main>
}
