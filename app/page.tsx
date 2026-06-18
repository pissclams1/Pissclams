import Link from "next/link";

export default function HomePage() {
  return <main>
    <section className="wrap hero">
      <div>
        <p className="kicker">For short-term rental hosts with empty calendar gaps</p>
        <h1 className="h1">Your calendar has money in it. You just can&apos;t see it.</h1>
        <p className="lead">GapStay spots the open stretches between bookings, prices them as furnished monthly stays, and gives you a page worth sharing.</p>
        <div className="actions">
          <Link className="darkpill" href="/host">Find my gaps</Link>
          <Link className="pill" href="/listing/sample">See a sample listing</Link>
        </div>
      </div>
      <div className="card pad">
        <p className="kicker">The missed opportunity</p>
        <h2 className="big">Airbnb optimizes for nightly bookings.</h2>
        <p className="muted">A 3-week gap in November is not three weeks of failure. It is a furnished-stay offer you have not made yet.</p>
      </div>
    </section>

    <section className="sectionline">
      <div className="wrap grid grid4" style={{paddingTop:30,paddingBottom:30}}>
        <Step title="Finds" text="The gaps worth packaging — not every open date qualifies." />
        <Step title="Prices" text="A monthly rate that makes sense, not nightly math multiplied by 30." />
        <Step title="Publishes" text="A clean listing page built for a different kind of guest." />
        <Step title="Captures" text="Direct inquiries, with no platform cut." />
      </div>
    </section>

    <section className="wrap section grid grid2">
      <div>
        <p className="kicker">Why this is not a 20-minute DIY project</p>
        <h2 className="big">The work is not just making a page.</h2>
        <p className="muted">Figuring out which gaps are worth offering, what a monthly guest will actually pay, and building something professional enough to forward is a few hours of work for one booking that might not happen. GapStay does it in minutes, and only charges when the page is worth publishing.</p>
      </div>
      <div className="card pad">
        <h3>What the host gets</h3>
        <ul className="list">
          <li>A faster way to find open dates worth packaging.</li>
          <li>A monthly-stay price that does not feel random.</li>
          <li>A shareable listing page for relocation, insurance, work, and between-home stays.</li>
          <li>Direct inquiries the host owns.</li>
        </ul>
      </div>
    </section>

    <section id="how" className="wrap section">
      <p className="kicker">How it works</p>
      <h2 className="big">From open calendar window to shareable furnished-stay offer.</h2>
      <div className="grid grid3" style={{marginTop:22}}>
        <Feature title="1. Enter your dates" text="Drop in your open window, nightly rate, typical occupancy, and cleaning cost." />
        <Feature title="2. Get a priced offer" text="GapStay calculates a furnished-stay rate that makes sense to a monthly guest — not a number you would be embarrassed to send." />
        <Feature title="3. Publish and share" text="Use a clean listing page you can text, email, or post anywhere. Direct inquiries come straight to you." />
      </div>
    </section>

    <section className="wrap section grid grid2">
      <div>
        <p className="kicker">Pricing</p>
        <h2 className="big">Free to generate. $19 to publish.</h2>
        <p className="muted">Build the page and see the pricing before you spend a cent. Pay only when you have something worth sharing — for that specific gap, not a monthly subscription.</p>
      </div>
      <div className="card pad">
        <div className="price">$19</div>
        <h3>Manual review + 30-day published listing</h3>
        <p className="muted">Publish one furnished-stay offer for one specific gap.</p>
        <div className="actions">
          <Link className="darkpill" href="/host">Find my gaps</Link>
          <Link className="pill" href="/listing/sample">See a sample listing</Link>
        </div>
      </div>
    </section>
  </main>;
}

function Step({title,text}:{title:string;text:string}) {
  return <div className="metric"><b>{title}</b><span className="small">{text}</span></div>;
}

function Feature({title,text}:{title:string;text:string}) {
  return <div className="card pad"><h3>{title}</h3><p className="muted">{text}</p></div>;
}
