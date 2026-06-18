import Link from "next/link";

const plans = [
  { name: "Free scan", price: "$0", text: "Check one open gap and preview the kind of recommendation GapStay gives before subscribing.", cta: "Check a gap", href: "/host", featured: false },
  { name: "Calendar Watch", price: "$49/mo", text: "For one property. GapStay watches your calendar, alerts you when empty dates become a revenue decision, and creates the furnished-stay marketing page when it is time to act.", cta: "Start watching one property", href: "/host", featured: true },
  { name: "Portfolio Watch", price: "$99/mo", text: "For up to 3 properties. Prioritized alerts, advisory reports, and furnished-stay pages across multiple under-booked calendars.", cta: "Start portfolio watch", href: "/host", featured: false },
  { name: "Extra property", price: "+$25/mo", text: "Add more properties after setup. No unlimited portfolio promises, no surprise usage limits hidden later.", cta: "Add after setup", href: "/host", featured: false }
];

export default function PricingPage(){
  return <main className="wrap section topspace">
    <p className="kicker">Pricing</p>
    <h1 className="big">Monthly calendar watch. Cancel anytime.</h1>
    <p className="lead" style={{fontSize:18}}>GapStay is for hosts who do not want to notice expensive empty months too late. We monitor the calendar, advise the next move, and give you the marketing page to act on it.</p>
    <div className="grid grid4" style={{marginTop:34}}>{plans.map(p=><div className="card pad" key={p.name} style={p.featured?{outline:"3px solid rgba(180,106,79,.25)"}:{}}><p className="kicker">{p.name}</p><div className="price">{p.price}</div><p className="muted">{p.text}</p><Link className={p.featured?"darkpill":"pill"} href={p.href}>{p.cta}</Link></div>)}</div>
    <section className="card pad" style={{marginTop:28}}>
      <h2>What you are paying for</h2>
      <ul className="list">
        <li><b>Reminder:</b> GapStay watches for long open stretches before they become expensive.</li>
        <li><b>Advisor:</b> GapStay tells you whether to wait, reprice, split the gap, package it, or salvage it.</li>
        <li><b>Marketing collateral:</b> when a furnished-stay play makes sense, GapStay gives you a shareable page and posting guidance.</li>
        <li><b>Limits:</b> Calendar Watch includes 1 property and up to 4 full advisory reports/month. Portfolio Watch includes up to 3 properties and up to 10 full advisory reports/month. Status checks run quietly in the background.</li>
      </ul>
    </section>
    <section className="card pad" style={{marginTop:28}}>
      <h2>What happens after the free scan?</h2>
      <p className="muted">The free scan shows the idea. The paid plan is the watch service: GapStay keeps looking, sends email or text alerts when a gap becomes a revenue decision, and produces the page you can post when it is time to look for a furnished-stay tenant.</p>
      <div className="actions"><Link className="darkpill" href="/host">Check my first gap</Link><Link className="pill" href="/listing/sample">See sample listing</Link></div>
    </section>
  </main>
}
