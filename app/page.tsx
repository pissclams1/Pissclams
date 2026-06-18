import Link from "next/link";

export default function HomePage() {
  return <main>
    <section className="wrap hero heroPrimary">
      <div>
        <h1 className="h1">Your calendar has money in it. You just can&apos;t see it.</h1>
        <p className="lead">GapStay helps Airbnb and VRBO hosts maximize revenue from the gaps between bookings.</p>
        <form className="importBar" action="/host" method="get">
          <label className="srOnly" htmlFor="listing-url">Airbnb or VRBO listing URL</label>
          <input id="listing-url" className="input" name="url" type="url" placeholder="Paste your Airbnb or VRBO listing URL" required />
          <button className="darkpill" type="submit">Import listing</button>
        </form>
        <Link className="manualLink" href="/host#manual">Enter details manually</Link>
      </div>
      <div className="thesisCard">
        <p>The goal isn&apos;t the highest nightly rate.</p>
        <strong>It&apos;s the most revenue from the entire gap.</strong>
        <div className="calendarVisual" aria-hidden="true">
          <span>Booked</span><span>Booked</span><span className="gapBlock">42-night gap</span><span>Booked</span>
        </div>
      </div>
    </section>

    <section id="how" className="sectionline">
      <div className="wrap section">
        <div className="sectionIntro"><p className="kicker">How it works</p><h2 className="big">From listing link to a better use of the whole gap.</h2></div>
        <div className="grid grid3">
          <Feature number="1" title="Import your listing" text="Paste a public Airbnb or VRBO URL. Review the property details and open dates GapStay can see." />
          <Feature number="2" title="Confirm the gap" text="Edit the dates, nightly rate, occupancy expectation, and property details before analysis." />
          <Feature number="3" title="Compare the revenue" text="See likely nightly revenue beside a furnished-stay offer, then publish the offer if it makes sense." />
        </div>
      </div>
    </section>

    <section className="wrap section thesisSection">
      <div><p className="kicker">Whole-gap revenue</p><h2 className="big">A great nightly rate only matters on nights that book.</h2></div>
      <div><p className="lead" style={{fontSize:18}}>GapStay compares the revenue your open dates are likely to produce as short stays with a single furnished-stay offer for the entire window.</p><ul className="list"><li>Keep Airbnb or VRBO live while you test the fallback.</li><li>Use one clear monthly and all-in price.</li><li>Share the offer where temporary renters already look.</li></ul></div>
    </section>

    <section className="sectionline">
      <div className="wrap section sampleBand">
        <div><p className="kicker">Sample listing</p><h2 className="big">See the furnished-stay offer your analysis can create.</h2><p className="muted">Built to share in Facebook Marketplace, local housing groups, and direct outreach.</p><Link className="darkpill" href="/listing/sample">View sample listing</Link></div>
        <div className="miniOffer"><p className="kicker">Furnished Stay Available</p><h3>Quiet furnished coastal stay</h3><div className="result"><Signal label="Dates" value="Jul 3 – Aug 14"/><Signal label="All-in" value="$3,864"/><Signal label="Bedrooms" value="2"/><Signal label="Bathrooms" value="2"/></div></div>
      </div>
    </section>

    <section className="wrap section">
      <div className="sectionIntro"><p className="kicker">Pricing</p><h2 className="big">Analyze free. Publish only when the offer is worth sharing.</h2></div>
      <div className="grid grid4 pricingPreview">
        <Price name="Free Analysis" price="$0" cta="Analyze a gap" href="/host" />
        <Price name="Publish One Offer" price="$19" cta="Analyze a gap" href="/host" />
        <Price name="Calendar Watch" price="$49/mo" cta="Analyze my property" href="/host" featured />
        <Price name="Portfolio Watch" price="$99/mo" cta="Analyze my portfolio" href="/host" />
      </div>
    </section>
  </main>;
}

function Feature({number,title,text}:{number:string;title:string;text:string}) { return <div className="feature"><span>{number}</span><h3>{title}</h3><p className="muted">{text}</p></div>; }
function Signal({label,value}:{label:string;value:string}) { return <div className="stat"><span>{label}</span><strong>{value}</strong></div>; }
function Price({name,price,cta,href,featured=false}:{name:string;price:string;cta:string;href:string;featured?:boolean}) { return <div className={`priceCard${featured?" featuredPrice":""}`}><p className="kicker">{name}</p><div className="price">{price}</div><Link className={featured?"darkpill":"pill"} href={href}>{cta}</Link></div>; }
