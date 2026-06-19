import Link from "next/link";

export default function HomePage() {
  return <main>
    <section className="wrap hero heroPrimary">
      <div>
        <p className="kicker">AI Calendar CFO for Airbnb &amp; VRBO hosts</p>
        <h1 className="h1">Your property has 365 opportunities to earn.</h1>
        <p className="lead">GapStay tells you which days belong on Airbnb and which should be marketed as furnished housing.</p>
        <p className="muted heroSupport">GapStay analyzes your calendar, comparable local rents, seasonality, events, and booking likelihood to generate a 365-day revenue plan for your property.</p>
        <form className="importBar" action="/host" method="get">
          <label className="srOnly" htmlFor="listing-url">Airbnb or VRBO listing URL</label>
          <input id="listing-url" className="input" name="url" type="url" placeholder="Paste your Airbnb or VRBO listing URL" required />
          <button className="darkpill" type="submit">Build my calendar plan</button>
        </form>
        <Link className="manualLink" href="/host#manual">Enter details manually</Link>
      </div>
      <div className="thesisCard">
        <p className="kicker" style={{color:"rgba(251,247,239,.55)"}}>Every day gets a recommendation</p>
        <div style={{display:"grid",gap:14,marginTop:20}}>
          <Decision label="AIRBNB" text="Hold for nightly bookings." color="#7ecfaa" />
          <Decision label="WATCH" text="Keep it on Airbnb for now. Re-evaluate as demand develops." color="#ead27b" />
          <Decision label="FURNISHED STAY" text="Market this period as furnished housing." color="#e87b6a" />
        </div>
        <p style={{fontSize:13,color:"rgba(251,247,239,.45)",marginTop:20,paddingTop:20,borderTop:"1px solid rgba(255,255,255,.1)",lineHeight:1.6}}>The model can be complex. The answer should not be. GapStay turns 365 days into a simple property plan.</p>
      </div>
    </section>

    <section className="sectionline">
      <div className="wrap section">
        <div className="sectionIntro">
          <p className="kicker">The core insight</p>
          <h2 className="big">365 days. Two strategies. One goal.</h2>
          <p className="muted" style={{maxWidth:640,fontSize:18}}>Maximize the total cash your property generates over the year. Some days are worth holding for Airbnb. Others earn more as furnished housing. GapStay tells you which is which.</p>
        </div>
        <div className="grid grid3">
          <div className="ruleCard" style={{background:"white",border:"1px solid rgba(82,98,79,.25)",borderRadius:22,padding:28}}>
            <p className="kicker" style={{color:"var(--moss)"}}>AIRBNB</p>
            <ul className="list"><li>Peak season for your property</li><li>Major holiday or event demand</li><li>Short-stay upside beats furnished-rental economics</li></ul>
          </div>
          <div className="ruleCard" style={{background:"white",border:"1px solid rgba(210,176,80,.35)",borderRadius:22,padding:28}}>
            <p className="kicker">WATCH</p>
            <ul className="list"><li>Leave it on Airbnb for now</li><li>Demand is not decisive yet</li><li>GapStay keeps checking for the switch point</li></ul>
          </div>
          <div className="ruleCard" style={{background:"white",border:"1px solid rgba(180,106,79,.25)",borderRadius:22,padding:28}}>
            <p className="kicker">FURNISHED STAY</p>
            <ul className="list"><li>Comparable furnished-rental cash flow wins</li><li>Short-stay demand is weak</li><li>The open block is long enough to market directly</li></ul>
          </div>
        </div>
      </div>
    </section>

    <section id="how" className="sectionline">
      <div className="wrap section">
        <div className="sectionIntro"><p className="kicker">How it works</p><h2 className="big">From listing URL to annual revenue plan.</h2></div>
        <div className="grid grid3">
          <Feature number="1" title="Import your listing" text="Paste your Airbnb or VRBO URL. GapStay reads calendar data when available and imports the property details it can see." />
          <Feature number="2" title="Get a 365-day plan" text="Every day is scored against short-stay demand, comparable local rent, furnished-rental premium, seasonality, events, and lead time." />
          <Feature number="3" title="Follow the recommendation" text="Use Airbnb on the days it earns more. Use furnished housing when that produces better total cash. Watch borderline periods as conditions change." />
        </div>
      </div>
    </section>

    <section className="sectionline">
      <div className="wrap section sampleBand">
        <div><p className="kicker">What you receive</p><h2 className="big">A calendar plan, not another dashboard.</h2><p className="muted">GapStay gives you clear date ranges, a recommendation for each range, and the furnished-stay copy to act when the plan says switch.</p><Link className="darkpill" href="/host" style={{marginTop:18,display:"inline-flex"}}>Build my calendar plan</Link></div>
        <div className="miniOffer"><p className="kicker">Example calendar plan</p><h3>July 1–7: AIRBNB</h3><p className="muted" style={{fontSize:14,marginBottom:18}}>Hold for holiday demand. July 8–31 moves to FURNISHED STAY because comparable furnished-rental cash flow beats the expected short-stay outcome.</p><div style={{background:"#fbf7ef",borderLeft:"3px solid var(--clay)",padding:"14px 16px",borderRadius:4,fontSize:13,lineHeight:1.7,color:"rgba(17,17,17,.7)"}}><strong>Furnished stay available July 8–31</strong><br/>Fully furnished 2BR. Utilities included.<br/>Priced against comparable local rent plus furnished flexibility premium.</div><div className="result" style={{marginTop:14}}><Signal label="Likely Airbnb" value="$1,350"/><Signal label="Furnished offer" value="$2,800"/></div></div>
      </div>
    </section>

    <section className="wrap section">
      <div className="sectionIntro"><p className="kicker">Pricing</p><h2 className="big">365 days. Two strategies. One goal.</h2><p className="muted">Get a 365-day calendar plan for one property. Subscribe when you want the plan continuously monitored and updated.</p></div>
      <div className="grid grid3 pricingPreview" style={{maxWidth:860,margin:"0 auto"}}><Price name="Single Analysis" price="$29" cta="Get my plan" href="/host" /><Price name="Calendar Watch" price="$49/mo" cta="Start monitoring" href="/host" featured /><Price name="Portfolio Watch" price="$99/mo" cta="Monitor my portfolio" href="/host" /></div>
    </section>
  </main>;
}

function Decision({label,text,color}:{label:string;text:string;color:string}) { return <div style={{display:"grid",gridTemplateColumns:"18px 1fr",gap:12,alignItems:"start"}}><span style={{width:14,height:14,borderRadius:999,background:color,marginTop:4}}/><div><strong style={{color:"#fbf7ef"}}>{label}</strong><p style={{margin:"4px 0 0",fontSize:13,color:"rgba(251,247,239,.6)",lineHeight:1.5}}>{text}</p></div></div>; }
function Feature({number,title,text}:{number:string;title:string;text:string}) { return <div className="feature"><span>{number}</span><h3>{title}</h3><p className="muted">{text}</p></div>; }
function Signal({label,value}:{label:string;value:string}) { return <div className="stat"><span>{label}</span><strong>{value}</strong></div>; }
function Price({name,price,cta,href,featured=false}:{name:string;price:string;cta:string;href:string;featured?:boolean}) { return <div className={`priceCard${featured?" featuredPrice":""}`}><p className="kicker">{name}</p><div className="price">{price}</div><Link className={featured?"darkpill":"pill"} href={href}>{cta}</Link></div>; }
