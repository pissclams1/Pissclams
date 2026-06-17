import Link from "next/link";

export default function PricingPage(){
  return <main className="wrap section topspace">
    <p className="kicker">Pricing</p>
    <h1 className="big">Generate free. Publish only if the page is worth using.</h1>
    <p className="lead" style={{fontSize:18}}>GapStay is in manual beta. Check one vacant gap for free, then request manual review when you want a 30-day page to share with real renters.</p>
    <div className="grid grid2" style={{marginTop:34}}>
      <div className="card pad">
        <p className="kicker">Free</p>
        <div className="price">$0</div>
        <p className="muted">Check one empty calendar gap, see a furnished-stay offer, and preview the page before paying anything.</p>
        <Link className="pill" href="/host">Check my empty dates</Link>
      </div>
      <div className="card pad" style={{outline:"3px solid rgba(180,106,79,.25)"}}>
        <p className="kicker">Manual publish</p>
        <div className="price">$19</div>
        <p className="muted">Manual review plus one 30-day published gap page for a specific set of vacant dates. No subscription.</p>
        <Link className="darkpill" href="/host">Start with my gap</Link>
      </div>
    </div>
    <section className="card pad" style={{marginTop:28}}>
      <h2>What the $19 covers</h2>
      <ul className="list">
        <li>Review the gap and offer before it is used publicly.</li>
        <li>Publish one professional page for 30 days.</li>
        <li>Keep the host flow manual while the product is being validated.</li>
        <li>Stripe subscriptions and automated publishing come later, after proof.</li>
      </ul>
    </section>
  </main>
}
