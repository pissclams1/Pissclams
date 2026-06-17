import Link from "next/link";
import { money, prettyDate } from "../lib/pricing";
import { sampleListing } from "../lib/store";

export default function HomePage() {
  const a = sampleListing.analysis;
  return <main>
    <section className="wrap hero">
      <div>
        <p className="kicker">For Airbnb & VRBO hosts</p>
        <h1 className="h1">Fill the empty month.</h1>
        <p className="lead">GapStay turns vacant 14-90 day calendar gaps into realistic furnished-stay offers with transparent monthly pricing guests can actually say yes to.</p>
        <div className="actions"><Link className="darkpill" href="/host">Analyze a gap</Link><Link className="pill" href="/listing/sample">See sample listing</Link></div>
      </div>
      <div className="card pad">
        <div className="heroCardTop"><div><p className="kicker">Live example</p><h2 className="big" style={{marginTop:8}}>One gap. One stay. Less nonsense.</h2></div><span className="badge">{a.certaintyScore}% certainty</span></div>
        <p className="muted">{prettyDate(a.startDate)} - {prettyDate(a.endDate)} · {a.nights} nights open</p>
        <div className="result" style={{marginTop:18}}>
          <div className="stat"><span>Current target</span><strong>{money(a.fullNightRevenue)}</strong><p className="small">If every night booked at the nightly target.</p></div>
          <div className="stat"><span>Likely short-term</span><strong>{money(a.likelyShortTermRevenue)}</strong><p className="small">Based on expected occupancy.</p></div>
          <div className="stat"><span>GapStay offer</span><strong>{money(a.recommendedTotal)}</strong><p className="small">One mid-term stay at {money(a.recommendedNightly)}/night.</p></div>
          <div className="stat"><span>Monthly equivalent</span><strong>{money(a.monthlyEquivalent)}</strong><p className="small">Guest-friendly all-in pricing.</p></div>
        </div>
      </div>
    </section>
    <section className="sectionline"><div className="wrap grid grid4" style={{paddingTop:30,paddingBottom:30}}>
      <div className="metric"><b>14-90</b><span className="small">Ideal vacant gap length.</span></div>
      <div className="metric"><b>Host-first</b><span className="small">Start with supply pain, not marketplace fantasy.</span></div>
      <div className="metric"><b>All-in</b><span className="small">No fee shock. No checkout chore theater.</span></div>
      <div className="metric"><b>Gap → offer</b><span className="small">The entire product loop.</span></div>
    </div></section>
    <section className="wrap section grid grid3">
      <Feature title="Find the empty gap" text="Paste a calendar later; for MVP, enter the vacant dates and current nightly target." />
      <Feature title="Price for certainty" text="GapStay recommends a mid-term rate that trades imaginary ADR for actual occupancy." />
      <Feature title="Publish a clean page" text="Generate a simple furnished-stay page with transparent price, dates, amenities, and inquiry form." />
    </section>
  </main>;
}
function Feature({title,text}:{title:string;text:string}){return <div className="card pad"><h3>{title}</h3><p className="muted">{text}</p></div>}
