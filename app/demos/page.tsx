import Link from "next/link";

export default function DemosPage(){
  return <main className="wrap section topspace">
    <p className="kicker">Manual beta flow</p>
    <h1 className="big">Check the gap. Price the stay. Request manual publish.</h1>
    <p className="lead" style={{fontSize:18}}>This page documents the current MVP flow. GapStay is not yet selling subscriptions, gap alerts, or automated payment-gated publishing.</p>
    <div className="grid grid3" style={{marginTop:32}}>
      <div className="card pad"><p className="kicker">1</p><h3>Check empty dates</h3><p className="muted">Enter a vacant gap and basic host assumptions.</p></div>
      <div className="card pad"><p className="kicker">2</p><h3>Review the offer</h3><p className="muted">See a furnished-stay price and a shareable page preview.</p></div>
      <div className="card pad"><p className="kicker">3</p><h3>Request publish</h3><p className="muted">Ask for manual review and a 30-day page when it is worth using.</p></div>
    </div>
    <section className="card pad" style={{marginTop:30}}>
      <h2>What is intentionally not automated yet</h2>
      <ul className="list">
        <li>No automatic Stripe publishing.</li>
        <li>No recurring host plans.</li>
        <li>No claim that pricing is AI-researched market comp data.</li>
        <li>No account-dependent workflow required for the first beta test.</li>
      </ul>
      <div className="actions"><Link className="darkpill" href="/host">Check my empty dates</Link><Link className="pill" href="/pricing">View pricing</Link></div>
    </section>
  </main>
}
