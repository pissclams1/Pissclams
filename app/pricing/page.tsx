import Link from "next/link";

const plans = [
  { name: "Free analysis", price: "$0", text: "Analyze one empty gap and see the math before paying.", cta: "Analyze a gap", href: "/host", featured: false },
  { name: "Publish one offer", price: "$19", text: "Create one shareable furnished-stay offer for 30 days with dates, price, renter fit, posting guidance, and an inquiry form.", cta: "Analyze a gap", href: "/host", featured: true },
  { name: "Calendar Watch", price: "$49/mo", text: "Early access assisted monitoring for one property, with recommendations when open dates should be watched, repriced, split, or packaged.", cta: "Analyze a gap", href: "/host", featured: false },
  { name: "Portfolio Watch", price: "$99/mo", text: "Early access assisted monitoring for up to 3 properties, with prioritized gap recommendations across multiple calendars.", cta: "Analyze a gap", href: "/host", featured: false }
];

export default function PricingPage(){
  return <main className="wrap section topspace">
    <p className="kicker">Pricing</p>
    <h1 className="big">Free to analyze. $19 to publish one furnished-stay offer.</h1>
    <p className="lead" style={{fontSize:18}}>Free to analyze. $19 to publish. No commitment until you see the math.</p>
    <div className="grid grid4" style={{marginTop:34}}>{plans.map(p=><div className="card pad" key={p.name} style={p.featured?{outline:"3px solid rgba(180,106,79,.25)"}:{}}><p className="kicker">{p.name}</p><div className="price">{p.price}</div><p className="muted">{p.text}</p><Link className={p.featured?"darkpill":"pill"} href={p.href}>{p.cta}</Link></div>)}</div>
  </main>
}
