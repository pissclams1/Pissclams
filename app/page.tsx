import Link from "next/link";

export default function HomePage() {
  return <main>
    <section className="wrap hero heroPrimary">
      <div>
        <p className="kicker">For Airbnb &amp; VRBO hosts</p>
        <h1 className="h1">Airbnb works in the Hamptons. It&apos;s costing you money everywhere else.</h1>
        <p className="lead">Most hosts outside top-tier vacation markets earn less than half their potential revenue. Not because of bad pricing — because they waited for short stays that never came.</p>
        <p className="muted heroSupport">GapStay reads your live calendar, scores each open gap against seasonal demand and holidays, and tells you when to stop waiting — with a furnished-stay listing ready to post in 30 seconds.</p>
        <form className="importBar" action="/host" method="get">
          <label className="srOnly" htmlFor="listing-url">Airbnb or VRBO listing URL</label>
          <input id="listing-url" className="input" name="url" type="url" placeholder="Paste your Airbnb or VRBO listing URL" required />
          <button className="darkpill" type="submit">Analyze free</button>
        </form>
        <Link className="manualLink" href="/host#manual">Enter details manually</Link>
      </div>
      <div className="thesisCard">
        <p className="kicker" style={{color:"rgba(251,247,239,.55)"}}>The math your dashboard won&apos;t show you</p>
        <div className="mathCompare">
          <div>
            <p style={{fontSize:13,color:"rgba(251,247,239,.55)",margin:"0 0 4px",textTransform:"uppercase",letterSpacing:".1em",fontWeight:700}}>Airbnb reality</p>
            <strong style={{fontSize:48,letterSpacing:"-.04em",color:"#e87b6a",lineHeight:1}}>$1,350</strong>
            <p style={{fontSize:13,color:"rgba(251,247,239,.55)",marginTop:6}}>$150 × 30 nights × 30% occupancy. 21 nights empty.</p>
          </div>
          <div style={{textAlign:"center",color:"rgba(251,247,239,.3)",fontSize:28,padding:"0 8px"}}>vs</div>
          <div>
            <p style={{fontSize:13,color:"rgba(251,247,239,.55)",margin:"0 0 4px",textTransform:"uppercase",letterSpacing:".1em",fontWeight:700}}>Furnished stay</p>
            <strong style={{fontSize:48,letterSpacing:"-.04em",color:"#7ecfaa",lineHeight:1}}>$2,800</strong>
            <p style={{fontSize:13,color:"rgba(251,247,239,.55)",marginTop:6}}>One tenant. One payment. Zero empty nights.</p>
          </div>
        </div>
        <p style={{fontSize:13,color:"rgba(251,247,239,.45)",marginTop:20,paddingTop:20,borderTop:"1px solid rgba(255,255,255,.1)",lineHeight:1.6}}>The host earning $1,350 still thinks Airbnb is working. Their dashboard shows a great nightly rate. It doesn&apos;t show 21 empty nights. GapStay does.</p>
      </div>
    </section>

    <section className="sectionline">
      <div className="wrap section">
        <div className="sectionIntro">
          <p className="kicker">The core insight</p>
          <h2 className="big">Airbnb is worth it for maybe 6 weeks a year in most markets. GapStay tells you which 6.</h2>
          <p className="muted" style={{maxWidth:620,fontSize:18}}>Outside of peak season, major holidays, and local demand spikes, a single furnished-stay tenant almost always produces more total revenue than short-stay bookings — with zero vacancy risk. The hard part is knowing which window is which.</p>
        </div>
        <div className="grid grid2">
          <div className="ruleCard" style={{background:"white",border:"1px solid rgba(82,98,79,.25)",borderRadius:22,padding:28}}>
            <p className="kicker" style={{color:"var(--moss)"}}>Stay on Airbnb when</p>
            <ul className="list"><li>Peak season for your specific market</li><li>A major holiday is within 3 weeks</li><li>A local event is driving short-stay demand</li><li>GapStay puts fill probability above 55%</li></ul>
          </div>
          <div className="ruleCard" style={{background:"white",border:"1px solid rgba(180,106,79,.25)",borderRadius:22,padding:28}}>
            <p className="kicker">Switch to furnished stay when</p>
            <ul className="list"><li>Off-season in your market</li><li>Gap is 14+ nights with no booking yet</li><li>3 weeks out and still open</li><li>GapStay puts fill probability below 45%</li></ul>
          </div>
        </div>
      </div>
    </section>

    <section id="how" className="sectionline">
      <div className="wrap section">
        <div className="sectionIntro"><p className="kicker">How it works</p><h2 className="big">From URL to decision in under a minute.</h2></div>
        <div className="grid grid3">
          <Feature number="1" title="Paste your listing URL" text="GapStay reads your live iCal feed — the same one Airbnb uses to sync with other calendars. Real booked and open dates, no manual entry required." />
          <Feature number="2" title="We score your gaps" text="Each open window is measured against your market&apos;s seasonal patterns, upcoming holidays, and local events. Fill probability, not a generic occupancy guess." />
          <Feature number="3" title="Act or hold" text="If the math says switch, you get a furnished-stay listing ready to post on Facebook Marketplace in 30 seconds. If the math says hold, we tell you exactly when to re-check." />
        </div>
      </div>
    </section>

    <section className="sectionline">
      <div className="wrap section sampleBand">
        <div><p className="kicker">What you receive</p><h2 className="big">A recommendation. And the listing to act on it.</h2><p className="muted">Not a dashboard you&apos;ll check once and forget. A clear call, with copy ready to paste into Facebook Marketplace when it&apos;s time to switch.</p><Link className="darkpill" href="/listing/sample" style={{marginTop:18,display:"inline-flex"}}>View sample listing</Link></div>
        <div className="miniOffer"><p className="kicker">GapStay alert — 27 nights open</p><h3>Switch to furnished stay.</h3><p className="muted" style={{fontSize:14,marginBottom:18}}>August is off-peak in Massapequa. Fill probability: 22%. You&apos;re on pace to earn $810 this month. A furnished stay at $2,400 beats that by $1,590.</p><div style={{background:"#fbf7ef",borderLeft:"3px solid var(--clay)",padding:"14px 16px",borderRadius:4,fontSize:13,lineHeight:1.7,color:"rgba(17,17,17,.7)"}}>🏠 <strong>Furnished stay available Aug 2–29 · Massapequa, NY</strong><br/>Quiet 2BR, fully equipped. 35 min to Manhattan.<br/>$2,400 all-in. No cleaning fees. Message to book.</div><div className="result" style={{marginTop:14}}><Signal label="Airbnb estimate" value="$810"/><Signal label="Furnished offer" value="$2,400"/></div></div>
      </div>
    </section>

    <section className="wrap section">
      <div className="sectionIntro"><p className="kicker">Pricing</p><h2 className="big">GapStay pays for itself the first time it saves you an empty month.</h2></div>
      <div className="grid grid2 pricingPreview" style={{maxWidth:640,margin:"0 auto"}}><Price name="Single Property" price="$29/mo" cta="Start monitoring" href="/host" /><Price name="Portfolio" price="$79/mo" cta="Monitor my portfolio" href="/host" featured /></div>
      <p className="successBox" style={{maxWidth:640,margin:"18px auto 0",textAlign:"center"}}>Start with a free analysis. Subscribe when you want your calendar watched year-round.</p>
    </section>
  </main>;
}

function Feature({number,title,text}:{number:string;title:string;text:string}) { return <div className="feature"><span>{number}</span><h3>{title}</h3><p className="muted">{text}</p></div>; }
function Signal({label,value}:{label:string;value:string}) { return <div className="stat"><span>{label}</span><strong>{value}</strong></div>; }
function Price({name,price,cta,href,featured=false}:{name:string;price:string;cta:string;href:string;featured?:boolean}) { return <div className={`priceCard${featured?" featuredPrice":""}`}><p className="kicker">{name}</p><div className="price">{price}</div><Link className={featured?"darkpill":"pill"} href={href}>{cta}</Link></div>; }
