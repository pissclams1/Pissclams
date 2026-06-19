import Link from "next/link";

const plans = [
  {
    name: "Single Property",
    price: "$29/month",
    text: "One listing monitored year-round. Gap scoring against your market's seasonal patterns and holiday calendar, with alerts when the math turns against you and a ready-to-post furnished-stay listing.",
    features: ["1 listing monitored", "Public calendar-feed reading", "Gap scoring + fill probability", "Holiday and season checks", "Ready-to-post furnished-stay copy", "Email alerts"],
    cta: "Start monitoring",
    href: "/host",
    featured: false
  },
  {
    name: "Portfolio",
    price: "$79/month",
    text: "Up to 10 listings monitored. Everything in Single Property, plus a portfolio view that surfaces which properties have the most revenue at risk right now.",
    features: ["Up to 10 listings monitored", "Portfolio revenue view", "Gap scoring + fill probability", "Holiday and season checks", "Ready-to-post copy for every gap", "Email alerts + priority support"],
    cta: "Monitor my portfolio",
    href: "/host",
    featured: true
  }
];

const faqs = [
  { q: "How does GapStay read my calendar?", a: "Airbnb and VRBO listings can expose a public iCal-style calendar feed used for calendar syncing. GapStay attempts to read that feed to identify booked and open dates. If it is unavailable, you can confirm the gap manually." },
  { q: "Does it work for VRBO listings?", a: "Yes. VRBO listings can use the same calendar-feed format. Paste the listing URL and GapStay will attempt to read the available calendar information." },
  { q: "What markets does GapStay know about?", a: "We have seasonal patterns for Florida, Marco Island, Naples, the Hamptons, Long Island, Miami, NYC, Nashville, New Orleans, Charleston, Savannah, and major ski markets. More are added regularly." },
  { q: "What if my market isn't listed?", a: "We use a sensible seasonal default and you can override the fill probability manually. The analysis and copy generation work in any market." },
  { q: "Do I need to cancel Airbnb to use a furnished stay?", a: "No. Keep your Airbnb listing live while you post the furnished-stay offer. Only block the dates once a renter commits. You stay on both paths until there is a real booking." },
  { q: "Can I cancel anytime?", a: "Yes. Cancel from your dashboard before the next billing date and you will not be charged again." }
];

export default function PricingPage() {
  return <main className="wrap section topspace">
    <p className="kicker">Pricing</p>
    <h1 className="big">One empty month costs more than a year of GapStay.</h1>
    <p className="lead" style={{fontSize:18,maxWidth:600}}>Start with a free analysis. Subscribe when you want your calendar monitored year-round.</p>

    <div className="grid grid2 pricingGrid" style={{maxWidth:680,margin:"40px auto 0"}}>
      {plans.map(plan =>
        <div className={`priceCard${plan.featured ? " featuredPrice" : ""}`} key={plan.name}>
          <p className="kicker">{plan.name}</p>
          <div className="price">{plan.price}</div>
          <p className="muted" style={{fontSize:14,margin:"12px 0 16px",lineHeight:1.6}}>{plan.text}</p>
          <ul className="list" style={{fontSize:13,marginBottom:20}}>
            {plan.features.map(f => <li key={f}>{f}</li>)}
          </ul>
          <Link className={plan.featured ? "darkpill" : "pill"} href={plan.href}>{plan.cta}</Link>
        </div>
      )}
    </div>

    <p className="successBox" style={{maxWidth:600,margin:"24px auto 0",textAlign:"center"}}>
      <strong>Free analysis always available.</strong> Paste your listing URL, get the recommendation, see the copy. Subscribe only when you want year-round monitoring.
    </p>

    <div style={{maxWidth:640,margin:"64px auto 0"}}>
      <p className="kicker">Common questions</p>
      {faqs.map(f =>
        <div key={f.q} style={{padding:"22px 0",borderTop:"1px solid var(--line)"}}>
          <strong style={{fontSize:16}}>{f.q}</strong>
          <p className="muted" style={{marginTop:8,fontSize:14,lineHeight:1.7}}>{f.a}</p>
        </div>
      )}
    </div>
  </main>;
}
