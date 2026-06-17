import Link from "next/link";

export default function PaymentSuccessPage({ searchParams }: { searchParams: { session_id?: string } }) {
  return <main className="wrap section topspace"><div className="card pad"><p className="kicker">Payment complete</p><h1 className="big">Your GapStay page is ready to publish.</h1><p className="muted">If Stripe webhooks are configured, the listing will be marked as paid and published automatically. If this is a test deploy, use the dashboard to confirm the payment record and listing status.</p>{searchParams.session_id?<p className="small">Session: {searchParams.session_id}</p>:null}<div className="actions"><Link className="darkpill" href="/dashboard">Go to dashboard</Link><Link className="pill" href="/host">Analyze another gap</Link></div></div></main>
}
