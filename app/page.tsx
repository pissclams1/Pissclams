import Link from "next/link";

export default function HomePage() {
  return <main>
    <section className="wrap hero">
      <div>
        <p className="kicker">For hosts with awkward empty dates</p>
        <h1 className="h1">Fill the empty month.</h1>
        <p className="lead">GapStay finds dead calendar gaps worth packaging, prices them as a believable furnished stay, and creates a professional page to send to renters.</p>
        <div className="actions">
          <Link className="darkpill" href="/host">Check my empty dates</Link>
          <Link className="pill" href="/listing/sample">See an example</Link>
        </div>
      </div>
      <div className="card pad">
        <p className="kicker">Why it works</p>
        <h2 className="big">Not every empty date is worth chasing.</h2>
        <p className="muted">The value is not just making a page. It is knowing which dead dates make sense, what number to ask for, and how to present the offer professionally.</p>
      </div>
    </section>

    <section className="sectionline">
      <div className="wrap grid grid4" style={{paddingTop:30,paddingBottom:30}}>
        <Step title="Find" text="Identify vacant dates long enough to package." />
        <Step title="Price" text="Avoid random discounts and fantasy nightly math." />
        <Step title="Publish" text="Create a cleaner page than a rushed post." />
        <Step title="Capture" text="Collect direct renter inquiries." />
      </div>
    </section>

    <section className="wrap section grid grid2">
      <div>
        <p className="kicker">Why not do it yourself?</p>
        <h2 className="big">You can. It is usually not worth your time.</h2>
        <p className="muted">You could build a page, guess a monthly price, make a form, and hope you picked the right gap. GapStay is faster, more professional, and built around the dates that actually make sense.</p>
      </div>
      <div className="card pad">
        <h3>What you get</h3>
        <ul className="list">
          <li>A faster path from empty dates to a usable offer.</li>
          <li>A professional page to share with serious renters.</li>
          <li>A clearer monthly price instead of nightly-rate guessing.</li>
          <li>An inquiry form that captures direct leads.</li>
        </ul>
      </div>
    </section>

    <section id="how" className="wrap section">
      <p className="kicker">How it works</p>
      <h2 className="big">A simple page for the dates Airbnb is not filling.</h2>
      <div className="grid grid3" style={{marginTop:22}}>
        <Feature title="1. Check the gap" text="Enter your open dates, nightly target, expected occupancy, and cleaning cost." />
        <Feature title="2. Price the stay" text="Get a furnished-stay offer built to be believable to a monthly renter." />
        <Feature title="3. Share the page" text="Send the page anywhere and collect direct inquiries from interested renters." />
      </div>
    </section>

    <section className="wrap section grid grid2">
      <div>
        <p className="kicker">Beta pricing</p>
        <h2 className="big">Generate free. Publish only if the page is worth using.</h2>
        <p className="muted">The first paid step is tied to one specific gap page, not a software subscription.</p>
      </div>
      <div className="card pad">
        <div className="price">$19</div>
        <h3>Manual review and 30-day published gap page</h3>
        <p className="muted">Generate the page free. Request publishing when you want to share it with real renters.</p>
        <div className="actions">
          <Link className="darkpill" href="/host">Check my empty dates</Link>
          <Link className="pill" href="/listing/sample">See sample</Link>
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
