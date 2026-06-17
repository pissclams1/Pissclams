import Link from "next/link";
import { money, prettyDate } from "../lib/pricing";
import { sampleListing } from "../lib/store";

export default function HomePage() {
  const a = sampleListing.analysis;
  return <main>
    <section className="wrap hero">
      <div>
        <p className="kicker">For Airbnb & VRBO hosts with awkward empty dates</p>
        <h1 className="h1">Fill the empty month.</h1>
        <p className="lead">GapStay builds a shareable mid-term rental page for your dead calendar gap, with pricing serious renters can understand.</p>
        <div className="actions"><Link className="darkpill" href="/host">Analyze my gap free</Link><Link className="pill" href="/listing/sample">See an example</Link></div>
        <div className="grid grid3" style={{marginTop:34}}>
          <Proof stat="Free" text="to see the math for one real vacant gap" />
          <Proof stat="$19" text="to request manual review and publish for 30 days" />
          <Proof stat="14-90" text="night gaps that vacation demand often ignores" />
        </div>
      </div>
      <div className="card pad">
        <div className="heroCardTop"><div><p className="kicker">Host value moment</p><h2 className="big" style={{marginTop:8}}>See whether one monthly offer beats waiting for short-term bookings.</h2></div><span className="badge">{a.certaintyScore}% certainty</span></div>
        <p className="muted">{prettyDate(a.startDate)} - {prettyDate(a.endDate)} · {a.nights} nights open</p>
        <div className="result" style={{marginTop:18}}>
          <div className="stat"><span>Fantasy Airbnb revenue</span><strong>{money(a.fullNightRevenue)}</strong><p className="small">What the host hopes the gap is worth.</p></div>
          <div className="stat"><span>Likely Airbnb outcome</span><strong>{money(a.likelyShortTermRevenue)}</strong><p className="small">What may actually happen with partial booking.</p></div>
          <div className="stat"><span>GapStay offer</span><strong>{money(a.recommendedTotal)}</strong><p className="small">One mid-term stay. One guest. Less churn.</p></div>
          <div className="stat"><span>Monthly equivalent</span><strong>{money(a.monthlyEquivalent)}</strong><p className="small">Clear furnished-stay price guests understand.</p></div>
        </div>
      </div>
    </section>

    <section className="sectionline"><div className="wrap grid grid4" style={{paddingTop:30,paddingBottom:30}}>
      <div className="metric"><b>Find</b><span className="small">Spot the open block that is quietly costing money.</span></div>
      <div className="metric"><b>Price</b><span className="small">Turn nightly-rate guessing into a realistic furnished-stay offer.</span></div>
      <div className="metric"><b>Publish</b><span className="small">Create one page you can send to serious monthly renters.</span></div>
      <div className="metric"><b>Capture</b><span className="small">Collect name, email, phone, stay type, and message in the dashboard.</span></div>
    </div></section>

    <section id="how" className="wrap section">
      <p className="kicker">How it works</p>
      <h2 className="big">A page you can share when Airbnb is not filling the gap.</h2>
      <div className="grid grid3" style={{marginTop:22}}>
        <Feature title="1. Analyze the empty dates" text="Enter the gap, nightly target, expected occupancy, and cleaning cost. GapStay shows what waiting for short-term bookings may actually produce." />
        <Feature title="2. Package one monthly offer" text="GapStay recommends an all-in furnished-stay price and turns it into a page built for relocating families, insurance stays, remote workers, and between-home renters." />
        <Feature title="3. Collect direct inquiries" text="Share the page anywhere. Each request captures contact details, stay reason, and message so the host can follow up directly." />
      </div>
    </section>

    <section className="sectionline"><div className="wrap section grid grid2">
      <div><p className="kicker">Example outcome</p><h2 className="big">A 38-night Sarasota gap becomes a $3,400 furnished-stay offer.</h2><p className="muted">Instead of waiting for scattered weekend bookings, the host has one clean page for relocation groups, local employers, insurance housing leads, and Facebook housing posts.</p></div>
      <div className="card pad"><p className="muted">“The math made the decision obvious. I stopped hoping the calendar would fill itself and had one page to send people.”</p><p className="small">Example host scenario · Sarasota, FL · 38-night fall gap</p></div>
    </div></section>

    <section className="wrap section">
      <p className="kicker">Why not just use another marketplace?</p>
      <h2 className="big">Marketplaces wait for renters to find you. GapStay gives you a page to send out.</h2>
      <div className="grid grid3" style={{marginTop:22}}>
        <Feature title="Airbnb / VRBO" text="Great for vacation demand, but awkward month-long gaps often sit between weekend trips and seasonal stays." />
        <Feature title="Pricing tools" text="They adjust nightly rates. GapStay repackages the dates into one furnished-stay offer someone can say yes to." />
        <Feature title="Furnished Finder / Facebook / Zillow" text="Useful channels, but hosts still need a clean page, clear price, and inquiry form. GapStay gives them that asset." />
      </div>
    </section>

    <section className="wrap section grid grid2">
      <div><p className="kicker">Beta pricing</p><h2 className="big">Generate the analysis free. Publish only if the page is worth using.</h2><p className="muted">The first paid step is tied to one specific gap page, not a software subscription.</p></div>
      <div className="card pad"><div className="price">$19</div><h3>Manual review + 30-day published gap page</h3><p className="muted">Generate the page free. Request publishing when you want to share it with real renters.</p><div className="actions"><Link className="darkpill" href="/host">Analyze free</Link><Link className="pill" href="/listing/sample">See sample</Link></div></div>
    </section>
  </main>;
}
function Feature({title,text}:{title:string;text:string}){return <div className="card pad"><h3>{title}</h3><p className="muted">{text}</p></div>}
function Proof({stat,text}:{stat:string}){return <div><b style={{fontSize:30,letterSpacing:"-.04em"}}>{stat}</b><p className="small">{text}</p></div>}
