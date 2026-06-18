import Link from "next/link";

const plans = [
  { name: "Free scan", price: "$0", text: "Check one open gap and preview the kind of recommendation GapStay gives before subscribing.", cta: "Analyze a gap", href: "/host", featured: false },
  { name: "Calendar Watch", price: "$49/mo", text: "For one property. GapStay watches your calendar, alerts you when empty dates become a revenue decision, and creates the furnished-stay marketing page when it is time to act.", cta: "Analyze a gap", href: "/host", featured: true },
  { name: "Portfolio Watch", price: "$99/mo", text: "For up to 3 properties. Prioritized alerts, advisory reports, and furnished-stay pages across multiple under-booked calendars.", cta: "Analyze a gap", href: "/host", featured: false },
  { name: "Extra property", price: "+$25/mo", text: "Add more properties after setup. No unlimited portfolio promises, no surprise usage limits hidden later.", cta: "Analyze a gap", href: "/host", featured: false }
];

export default function PricingPage(){
  return <main className="wrap section topspace">
    <p className="kicker">Pricing</p>
    <h1 className="big">Try it on one empty month. Subscribe if it works.</h1>
    <p className="lead" style={{fontSize:18}}>Free to analyze. No commitment until you see the math.</p>
    <div className="grid grid4" style={{marginTop:34}}>{plans.map(p=><div className="card pad" key={p.name} style={p.featured?{outline:"3px solid rgba(180,106,79,.25)"}:{}}><p className="kicker">{p.name}</p><div className="price">{p.price}</div><p className="muted">{p.text}</p><Link className={p.featured?"darkpill":"pill"} href={p.href}>{p.cta}</Link></div>)}</div>
  </main>
}
