import Link from "next/link";

const plans = [
  { name: "Free", price: "$0", text: "Check one empty calendar gap, see a furnished-stay offer, and preview the page before paying.", cta: "Check dates", href: "/host", featured: false },
  { name: "Publish one gap", price: "$19", text: "One 30-day public page for a specific vacant-date offer. Best for testing one painful opening.", cta: "Publish a gap", href: "/host", featured: true },
  { name: "One property", price: "$49/mo", text: "For hosts who want GapStay attached to one property and available whenever another gap appears.", cta: "Start property plan", href: "/host", featured: false },
  { name: "Portfolio", price: "$99/mo", text: "For operators managing multiple furnished rentals and recurring calendar gaps.", cta: "Start portfolio", href: "/host", featured: false }
];

export default function PricingPage(){
  return <main className="wrap section topspace">
    <p className="kicker">Pricing</p>
    <h1 className="big">Start with one gap. Upgrade when the problem repeats.</h1>
    <p className="lead" style={{fontSize:18}}>GapStay is priced around the host's actual problem: empty dates that may be worth turning into a furnished-stay offer.</p>
    <div className="grid grid4" style={{marginTop:34}}>{plans.map(p=><div className="card pad" key={p.name} style={p.featured?{outline:"3px solid rgba(180,106,79,.25)"}:{}}><p className="kicker">{p.name}</p><div className="price">{p.price}</div><p className="muted">{p.text}</p><Link className={p.featured?"darkpill":"pill"} href={p.href}>{p.cta}</Link></div>)}</div>
    <section className="card pad" style={{marginTop:28}}>
      <h2>The clean distinction</h2>
      <ul className="list">
        <li><b>$19</b> is for one vacant-date campaign.</li>
        <li><b>$49/month</b> is for one property with repeat gaps.</li>
        <li><b>$99/month</b> is for hosts or operators managing multiple properties.</li>
        <li>Plans can run as early-access checkout while automation continues to improve.</li>
      </ul>
    </section>
  </main>
}