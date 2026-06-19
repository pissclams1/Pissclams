import Link from "next/link";

const plans = [
  {
    name: "Single Analysis",
    price: "$29",
    tagline: "A snapshot of where you stand today.",
    text: "One 90-day calendar plan for one property. GapStay tells you which near-term dates belong on Airbnb, which should be watched, and which periods should be marketed as furnished housing.",
    features: ["1 property", "90-day calendar snapshot", "AIRBNB / WATCH / FURNISHED recommendations", "Comparable local rent anchor", "Furnished-stay offer guidance", "Post-ready copy for selected ranges"],
    cta: "Get my snapshot",
    href: "/host",
    featured: false
  },
  {
    name: "Calendar Watch",
    price: "$49/month",
    tagline: "The answer changes. So should your plan.",
    text: "One property monitored year-round. GapStay keeps the full 365-day plan updated as lead time changes, events approach, and unbooked windows become more expensive to ignore.",
    features: ["1 property monitored", "Full 365-day calendar plan", "Updated calendar recommendations", "Public calendar-feed reading", "Season, holiday, and event checks", "Email alerts"],
    cta: "Start monitoring",
    href: "/host",
    featured: true
  },
  {
    name: "Portfolio Watch",
    price: "$99/month",
    tagline: "For hosts managing more than one calendar.",
    text: "Multiple properties monitored. GapStay surfaces which calendars have the most cash at risk and where furnished housing should replace waiting for nightly bookings.",
    features: ["Up to 5 properties", "Portfolio revenue view", "Full 365-day plans", "Priority risk alerts", "Ready-to-post copy", "Priority support"],
    cta: "Monitor my portfolio",
    href: "/host",
    featured: false
  }
];

const faqs = [
  { q: "Why subscribe after buying a Single Analysis?", a: "A Single Analysis is a snapshot. Calendar Watch is an ongoing advisor. The recommendation can change as events are announced, lead time shrinks, seasons shift, and unbooked windows become more expensive to ignore." },
  { q: "What do I get with a Single Analysis?", a: "You get a 90-day calendar snapshot for one property. Each day is marked AIRBNB, WATCH, or FURNISHED based on short-stay demand, comparable local rent, furnished-stay premium, seasonality, events, and lead time." },
  { q: "What does Calendar Watch add?", a: "The full 365-day plan keeps updating. GapStay re-checks your calendar and alerts you when an unbooked window should stay on Airbnb, be watched, or switch to furnished housing." },
  { q: "How does GapStay price furnished housing?", a: "GapStay starts with comparable unfurnished rent for a similar local property, then applies a premium for furniture, flexibility, utilities, and shorter commitment. Airbnb nightly rate is used as upside comparison, not the pricing anchor." },
  { q: "How does GapStay read my calendar?", a: "Airbnb and VRBO listings can expose a public iCal-style calendar feed used for calendar syncing. GapStay attempts to read that feed to identify booked and unbooked dates. If it is unavailable, you can confirm dates manually." },
  { q: "Can I cancel anytime?", a: "Yes. Cancel anytime. Your service continues through the end of your current billing period. We do not provide prorated refunds for unused time." }
];

export default function PricingPage() {
  return <main className="wrap section topspace">
    <p className="kicker">Pricing</p>
    <h1 className="big">365 days. Two strategies. One goal.</h1>
    <p className="lead" style={{fontSize:18,maxWidth:620}}>Start with a near-term snapshot. Subscribe when you want the full 365-day plan continuously monitored and updated.</p>

    <div className="grid grid3 pricingGrid" style={{maxWidth:920,margin:"40px auto 0"}}>
      {plans.map(plan =>
        <div className={`priceCard${plan.featured ? " featuredPrice" : ""}`} key={plan.name}>
          <p className="kicker">{plan.name}</p>
          <div className="price">{plan.price}</div>
          <p style={{fontWeight:700,margin:"8px 0 8px"}}>{plan.tagline}</p>
          <p className="muted" style={{fontSize:14,margin:"12px 0 16px",lineHeight:1.6}}>{plan.text}</p>
          <ul className="list" style={{fontSize:13,marginBottom:20}}>
            {plan.features.map(f => <li key={f}>{f}</li>)}
          </ul>
          <Link className={plan.featured ? "darkpill" : "pill"} href={plan.href}>{plan.cta}</Link>
        </div>
      )}
    </div>

    <p className="successBox" style={{maxWidth:720,margin:"24px auto 0",textAlign:"center"}}>
      <strong>Why subscribe?</strong> A calendar snapshot shows where you stand today. Calendar Watch updates the answer as events, seasonality, lead time, and demand signals change throughout the year.
    </p>

    <div style={{maxWidth:680,margin:"64px auto 0"}}>
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
