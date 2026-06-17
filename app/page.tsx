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
        <p className="lead">GapStay builds a shareable mid-term rental page for the dead calendar days that actually make sense, with a price designed to be the most money a serious renter is still likely to say yes to.</p>
        <div className="actions"><Link className="darkpill" href="/host">Check my empty dates</Link><Link className="pill" href="/listing/sample">See an example</Link></div>
        <div className="grid grid3" style={{marginTop:34}}>
          <Proof stat="Free" text="to see the math for one real vacant gap" />
          <Proof stat="$19" text="to request manual review and publish for 30 days" />
          <Proof stat="14-90" text="night gaps that vacation demand often ignores" />
        </div>
      </div>
      <div className="card pad">
        <div className="heroCardTop"><div><p className="kicker">Host value moment</p><h2 className="big" style={{marginTop:8}}>Not a random discount. A believable monthly offer.</h2></div><span className="badge">{a.certaintyScore}% certainty</span></div>
        <p className="muted">{prettyDate(a.startDate)} - {prettyDate(a.endDate)} · {a.nights} nights open</p>
        <div className="result" style={{marginTop:18}}>
          <div className="stat"><span>Fantasy Airbnb revenue</span><strong>{money(a.fullNightRevenue)}</strong><p className="small">What the calendar would earn if every night booked.</p></div>
          <div className="stat"><span>Likely Airbnb outcome</span><strong>{money(a.likelyShortTermRevenue)}</strong><p className="small">What may actually happen with partial booking.</p></div>
          <div className="stat"><span>GapStay offer</span><strong>{money(a.recommendedTotal)}</strong><p className="small">Priced to beat waiting, without scaring off monthly renters.</p></div>
          <div className="stat"><span>Monthly equivalent</span><strong>{money(a.monthlyEquivalent)}</strong><p className="small">Clear furnished-stay price guests understand.</p></div>
        </div>
      </div>
    </section>

    <section className="sectionline"><div className="wrap grid grid4" style={{paddingTop:30,paddingBottom:30}}>
      <div className="metric"><b>Find</b><span className="small">Identify which dead dates are long enough to package.</span></div>
      <div className="metric"><b>Price</b><span className="small">Calculate the highest believable furnished-stay offer.</span></div>
      <div className="metric"><b>Publish</b><span className="small">Create a more professional page than a rushed post or spreadsheet.</span></div>
      <div className="metric"><b>Capture</b><span className="small">Collect name, email, phone, stay type, and message in the dashboard.</span></div>
    </div></section>

    <section className="wrap section grid grid2">
      <div><p className="kicker">Why not just do this yourself?</p><h2 className="big">You can. It is usually not worth your time.</h2><p className="muted">You could build a page, guess a monthly price, write a post, make a form, and hope you picked the right gap. GapStay does the parts that slow hosts down: it finds the dates that make sense, prices them as a believable furnished stay, and gives you a cleaner page to share in minutes.</p></div>
      <div className="card pad"><h3>What GapStay gives you</h3><ul className="list"><li>A faster path from empty dates to a usable page.</li><li>A more professional page than a rushed Facebook post or homemade PDF.</li><li>A price that is lower than nightly fantasy but aimed above likely short-term outcome.</li><li>Clear monthly-equivalent pricing for renters who are not shopping like tourists.</li><li>An inquiry form that captures direct leads you own.</li></ul></div>
    </section>

    <section id="how" className="wrap section">
      <p className="kicker">How it works</p>
      <h2 className="big">A page you can share when Airbnb is not filling the gap.</h2>
      <div className="grid grid3" style={{marginTop:22}}>
        <Feature title="1. Find the gap worth packaging" text="Enter the open dates, nightly target, expected occupancy, and cleaning cost. GapStay shows whether those dead days are long enough to sell as one furnished stay." />
        <Feature title="2. Price it without guessing" text="The recommendation is built to find the highest believable all-in furnished-stay price, not an arbitrary discount." />
        <Feature title="3. Share a professional page" text="Send the page anywhere. Each request captures contact details, stay reason, and message so the host can follow up directly." />
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
      <div className="card pad"><div className="price">$19</div><h3>Manual review + 30-day published gap page</h3><p className="muted">Generate the page free. Request publishing when you want to share it with real renters.</p><div className="actions"><Link className="darkpill" href="/host">Check my empty dates</Link><Link className="pill" href="/listing/sample">See sample</Link></div></div>
    </section>
  </main>;
}
function Feature({title,text}:{title:string;text:string}){return <div className="card pad"><h3>{title}</h3><p className="muted">{text}</p></div>}
function Proof({stat,text}:{stat:string}){return <div><b style={{fontSize:30,letterSpacing:"-.04em"}}>{stat}</b><p className="small">{text}</p></div>}
