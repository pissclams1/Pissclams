import Link from "next/link";
import { money, prettyDate } from "../lib/pricing";
import { sampleListing } from "../lib/store";

export default function HomePage() {
  const a = sampleListing.analysis;
  return <main>
    <section className="wrap hero">
      <div>
        <p className="kicker">Revenue recovery for Airbnb & VRBO hosts</p>
        <h1 className="h1">Fill the empty month.</h1>
        <p className="lead">GapStay finds vacant 14-90 day calendar gaps, prices them as realistic furnished stays, and turns them into direct inquiry pages hosts can share anywhere.</p>
        <div className="actions"><Link className="darkpill" href="/host">Analyze my gap free</Link><Link className="pill" href="/listing/sample">See an example</Link></div>
        <div className="grid grid3" style={{marginTop:34}}>
          <Proof stat="1" text="dead calendar gap is enough to justify the product" />
          <Proof stat="$19" text="to publish one recovery page for skeptical hosts" />
          <Proof stat="14-90" text="night gaps where vacation demand often fails" />
        </div>
      </div>
      <div className="card pad">
        <div className="heroCardTop"><div><p className="kicker">Host value moment</p><h2 className="big" style={{marginTop:8}}>Show the lost-revenue math immediately.</h2></div><span className="badge">{a.certaintyScore}% certainty</span></div>
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
      <div className="metric"><b>Find</b><span className="small">Open blocks hiding inside the host calendar.</span></div>
      <div className="metric"><b>Reprice</b><span className="small">Convert nightly-rate fantasy into a realistic stay offer.</span></div>
      <div className="metric"><b>Publish</b><span className="small">Generate a direct page for relocation, insurance, remote work, and between-home demand.</span></div>
      <div className="metric"><b>Capture</b><span className="small">Turn page visits into host-owned inquiries.</span></div>
    </div></section>

    <section id="how" className="wrap section">
      <p className="kicker">How GapStay helps the paid host</p>
      <h2 className="big">It is not another booking marketplace. It is a recovery workflow.</h2>
      <div className="grid grid3" style={{marginTop:22}}>
        <Feature title="1. Diagnose the dead gap" text="The host enters vacant dates, nightly target, occupancy expectation, and cleaning cost. GapStay shows the gap between fantasy revenue and likely outcome." />
        <Feature title="2. Package the stay" text="GapStay recommends a mid-term furnished-stay price and creates a page built for serious temporary housing demand, not vacation browsing." />
        <Feature title="3. Get direct inquiries" text="The host shares the page in Facebook groups, relocation channels, insurance housing outreach, Furnished Finder descriptions, or their own site." />
      </div>
    </section>

    <section className="sectionline" id="competition"><div className="wrap section">
      <p className="kicker">Competitive wedge</p>
      <h2 className="big">The alternatives solve adjacent problems. GapStay solves vacant calendar conversion.</h2>
      <div className="grid grid3" style={{marginTop:22}}>
        <Feature title="Airbnb / VRBO" text="Massive demand, but nightly-rate anchored and fee-sensitive. They do not repackage a dead calendar month into a clean mid-term offer." />
        <Feature title="PriceLabs / Beyond / Wheelhouse" text="Useful STR pricing tools, but they optimize nightly yield. GapStay focuses on converting awkward 14-90 day gaps into furnished-stay offers." />
        <Feature title="Furnished Finder / Facebook / Zillow" text="Demand channels exist, but hosts still need pricing, packaging, a direct page, and an inquiry workflow. GapStay is the bridge." />
      </div>
    </div></section>

    <section className="wrap section grid grid2">
      <div><p className="kicker">Pricing psychology</p><h2 className="big">Do not ask a frustrated host to buy software. Ask them to try recovering one empty month.</h2><p className="muted">The first paid conversion should be tied to publishing a specific gap page, not a vague subscription. The host pays because they can see the revenue problem directly.</p></div>
      <div className="card pad"><div className="price">$19</div><h3>Publish one gap page for 30 days</h3><p className="muted">Then $49/month for one property or $99/month for small managers with multiple active gaps.</p><div className="actions"><Link className="darkpill" href="/pricing">View pricing</Link><Link className="pill" href="/host">Analyze free</Link></div></div>
    </section>
  </main>;
}
function Feature({title,text}:{title:string;text:string}){return <div className="card pad"><h3>{title}</h3><p className="muted">{text}</p></div>}
function Proof({stat,text}:{stat:string;text:string}){return <div><b style={{fontSize:30,letterSpacing:"-.04em"}}>{stat}</b><p className="small">{text}</p></div>}
