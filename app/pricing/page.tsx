import Link from "next/link";

const plans = [
  { name: "Free analysis", price: "$0", text: "Analyze one empty gap and see the math before paying.", cta: "Analyze a gap", href: "/host", featured: false },
  { name: "Publish one gap", price: "$19", text: "Publish one furnished-stay page for 30 days and start taking direct requests.", cta: "Analyze a gap", href: "/host", featured: true },
  { name: "Calendar Watch", price: "$49/mo", text: "One property watched for costly gaps, with alerts, recommendations, and furnished-stay pages when it is time to act.", cta: "Analyze a gap", href: "/host", featured: false },
  { name: "Portfolio Watch", price: "$99/mo", text: "Up to 3 properties watched for costly gaps, with prioritized alerts, recommendations, and furnished-stay pages across multiple calendars.", cta: "Analyze a gap", href: "/host", featured: false }
];

export default function PricingPage(){
  return <main className="wrap section topspace">
    <p className="kicker">Pricing</p>
    <h1 className="big">Try it on one empty month. Subscribe if it works.</h1>
    <p className="lead" style={{fontSize:18}}>Free to analyze. $19 to publish. No commitment until you see the math.</p>
    <div className="grid grid4" style={{marginTop:34}}>{plans.map(p=><div className="card pad" key={p.name} style={p.featured?{outline:"3px solid rgba(180,106,79,.25)"}:{}}><p className="kicker">{p.name}</p><div className="price">{p.price}</div><p className="muted">{p.text}</p><Link className={p.featured?"darkpill":"pill"} href={p.href}>{p.cta}</Link></div>)}</div>
  </main>
}
