import Link from "next/link";

const plans = [
  { name: "Free analysis", price: "$0", text: "Analyze one vacant gap, see the likely Airbnb outcome, and preview the recovery offer.", cta: "Analyze free", featured: false },
  { name: "Publish a gap", price: "$19", text: "Publish one active GapStay page for 30 days. Best for a skeptical host with one dead month.", cta: "Publish a gap", featured: true },
  { name: "One property", price: "$49/mo", text: "Unlimited active gap pages for one property, inquiry capture, and recovery dashboard.", cta: "Start host plan", featured: false },
  { name: "Portfolio", price: "$99/mo", text: "Up to 10 properties, portfolio vacancy dashboard, lead tracking, and gap alerts.", cta: "Start portfolio", featured: false }
];

export default function PricingPage(){
  return <main className="wrap section topspace">
    <p className="kicker">Pricing</p>
    <h1 className="big">Price the first conversion like a recovery attempt, not a subscription.</h1>
    <p className="lead" style={{fontSize:18}}>The host is already frustrated with diminishing returns. GapStay starts free, then asks for a small payment only when the host wants to publish a specific revenue-recovery page.</p>
    <div className="actions"><Link className="pill" href="/demos">See what each plan unlocks</Link></div>
    <div className="grid grid4" style={{marginTop:34}}>{plans.map(p=><div className="card pad" key={p.name} style={p.featured?{outline:"3px solid rgba(180,106,79,.25)"}:{}}><p className="kicker">{p.name}</p><div className="price">{p.price}</div><p className="muted">{p.text}</p><Link className={p.featured?"darkpill":"pill"} href="/host">{p.cta}</Link></div>)}</div>
    <section className="card pad" style={{marginTop:28}}><h2>The $19 vs $49 distinction</h2><p className="muted"><b>$19 is a one-time campaign for one dead gap.</b> <b>$49/month is the operating plan for one property.</b> The first is for skeptical hosts. The second is for hosts who have repeat gaps and want GapStay to stay attached to the property.</p><ul className="list"><li>The free analysis creates the aha moment before payment.</li><li>The $19 page is easy to justify against one possible $3,000 to $5,000 recovered stay.</li><li>The $49 and $99 plans become rational once hosts see multiple gaps.</li><li>A 3% to 7% success fee can come later if GapStay handles booking and payment.</li></ul></section>
  </main>
}
