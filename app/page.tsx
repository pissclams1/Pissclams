import Link from "next/link";

export default function HomePage() {
  return <main>
    <section className="wrap hero">
      <div>
        <p className="kicker">For under-booked Airbnb and VRBO hosts</p>
        <h1 className="h1">Your empty calendar needs a second plan.</h1>
        <p className="lead">GapStay watches your calendar, tells you when an open stretch has become a revenue decision, and gives you the furnished-stay marketing page to act on it.</p>
        <div className="actions">
          <Link className="darkpill" href="/host">Check my first gap</Link>
          <Link className="pill" href="/listing/sample">See sample listing</Link>
        </div>
      </div>
      <div className="card pad">
        <p className="kicker">Reminder + advisor + page builder</p>
        <h2 className="big">Do not notice the problem when it is already too late.</h2>
        <p className="muted">GapStay is built for hosts who are not watching their calendar closely enough and still need the property to make more than a plain yearly rental.</p>
      </div>
    </section>

    <section className="sectionline">
      <div className="wrap grid grid4" style={{paddingTop:30,paddingBottom:30}}>
        <Step title="Watches" text="Rolling calendar monitoring for long open stretches." />
        <Step title="Advises" text="Wait, reprice, split, package, or salvage." />
        <Step title="Packages" text="A furnished-stay offer with dates, price, and positioning." />
        <Step title="Markets" text="A shareable page plus places to post it." />
      </div>
    </section>

    <section className="wrap section grid grid2">
      <div>
        <p className="kicker">The number that matters</p>
        <h2 className="big">Highest nightly rate does not pay the mortgage. Highest yearly revenue does.</h2>
        <p className="muted">A high nightly price feels good on the calendar. Empty nights do not. GapStay helps hosts stop measuring the property by the rate they wish they could get and start measuring it by how much money the calendar actually produces.</p>
        <p className="muted">Some dates should stay nightly. Some open blocks should be sold differently. The goal is not to win the ADR screenshot. The goal is to cover the year.</p>
      </div>
      <div className="card pad">
        <h3>The math is not personal</h3>
        <ul className="list">
          <li>$250/night for zero nights is still zero.</li>
          <li>A lower monthly rate can beat scattered high-rate weekends.</li>
          <li>Fewer turnovers means less cleaning, less damage risk, and less platform dependency.</li>
          <li>The right move depends on the whole block, not one imagined night.</li>
        </ul>
      </div>
    </section>

    <section className="sectionline">
      <div className="wrap section grid grid3">
        <div className="card pad">
          <p className="kicker">Sample alert</p>
          <h3>Your September–October gap is now in the package window.</h3>
          <p className="muted">It starts in 68 days, is still mostly open, and waiting for scattered nightly bookings is now the riskier bet.</p>
        </div>
        <div className="card pad">
          <p className="kicker">Sample recommendation</p>
          <h3>Package now. Keep Airbnb live until a tenant is real.</h3>
          <p className="muted">Create the furnished-stay offer today. Block the dates only after a qualified renter is ready.</p>
        </div>
        <div className="card pad">
          <p className="kicker">Sample collateral</p>
          <h3>A clean furnished-stay page to post anywhere.</h3>
          <p className="muted">Dates, total price, monthly equivalent, amenities, rules, and inquiry capture in one shareable link.</p>
        </div>
      </div>
    </section>

    <section className="wrap section grid grid2">
      <div>
        <p className="kicker">The decision most hosts wait too long to make</p>
        <h2 className="big">When should you stop waiting on Airbnb?</h2>
        <p className="muted">GapStay does not send generic reminders. It alerts you when an open stretch becomes a revenue decision: long enough to sell as a block, close enough to matter, and still open enough to become expensive.</p>
        <p className="muted">For a 30- to 60-day gap, the useful action window is usually 60–90 days before the gap starts. Under 30 days is usually salvage, not strategy.</p>
      </div>
      <div className="card pad">
        <h3>The simple status system</h3>
        <ul className="list">
          <li><b>Watch:</b> too early or demand may still protect the dates.</li>
          <li><b>Package:</b> build the furnished-stay offer, but keep Airbnb live.</li>
          <li><b>Act:</b> start posting and outreach now.</li>
          <li><b>Split:</b> hold high-demand nights and package the rest.</li>
          <li><b>Salvage:</b> discount, shorten, or chase partial stays.</li>
        </ul>
      </div>
    </section>

    <section className="wrap section grid grid2">
      <div>
        <p className="kicker">Where GapStay tells you to post</p>
        <h2 className="big">The page is only useful if you know where to put it.</h2>
        <p className="muted">When a furnished-stay play makes sense, GapStay gives you a page and points you toward the best channels for that kind of renter.</p>
      </div>
      <div className="card pad">
        <h3>Common channels</h3>
        <ul className="list">
          <li>Furnished Finder and travel-nurse housing groups.</li>
          <li>Local Facebook housing, relocation, and sublet groups.</li>
          <li>Local realtors and people between homes.</li>
          <li>Hospitals, universities, employers, and contract-worker communities.</li>
          <li>Insurance displacement and temporary-housing contacts.</li>
        </ul>
      </div>
    </section>

    <section id="how" className="wrap section">
      <p className="kicker">How it works</p>
      <h2 className="big">From calendar gap to action.</h2>
      <div className="grid grid3" style={{marginTop:22}}>
        <Feature title="1. Check one gap" text="Enter your open window, nightly target, expected occupancy, and cleaning cost." />
        <Feature title="2. Get the recommendation" text="GapStay shows whether the better move is to wait, reprice, split, package, or salvage." />
        <Feature title="3. Turn on watch" text="Subscribe so GapStay keeps monitoring the calendar and alerts you before the next gap gets expensive." />
      </div>
    </section>

    <section className="wrap section grid grid2">
      <div>
        <p className="kicker">Pricing</p>
        <h2 className="big">Monthly calendar watch. Cancel anytime.</h2>
        <p className="muted">Start with a free scan. Subscribe when you want GapStay watching the property, advising the next move, and creating the marketing page when it is time to look for a furnished-stay tenant.</p>
      </div>
      <div className="card pad">
        <div className="price">$49/mo</div>
        <h3>Calendar Watch for one property</h3>
        <p className="muted">Rolling calendar monitoring, gap alerts, advisory reports, and shareable furnished-stay pages.</p>
        <div className="actions">
          <Link className="darkpill" href="/host">Check my first gap</Link>
          <Link className="pill" href="/pricing">See pricing</Link>
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
