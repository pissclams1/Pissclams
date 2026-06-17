import Link from "next/link";

export default function PaymentSuccessPage({ searchParams }: { searchParams: { session_id?: string } }) {
  return <main className="wrap section topspace">
    <div className="card pad">
      <p className="kicker">Payment status</p>
      <h1 className="big">Manual publishing is still handled by review.</h1>
      <p className="muted">This beta does not automatically publish pages from the success screen. If a Stripe test session was created, confirm the payment in Stripe and handle publishing manually.</p>
      {searchParams.session_id ? <p className="small">Stripe session: {searchParams.session_id}</p> : null}
      <div className="actions">
        <Link className="darkpill" href="/dashboard">Open demo dashboard</Link>
        <Link className="pill" href="/host">Check another gap</Link>
      </div>
    </div>
  </main>
}
