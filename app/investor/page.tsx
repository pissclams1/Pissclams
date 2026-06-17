import Link from "next/link";

export default function InvestorPage(){
  return <main className="wrap section topspace">
    <p className="kicker">Investor narrative</p>
    <h1 className="big">GapStay monetizes distressed short-term rental supply.</h1>
    <p className="lead" style={{fontSize:18}}>Airbnb and VRBO are optimized for nightly demand. GapStay is a host-side layer that finds vacant 14-90 day gaps and converts them into realistic furnished-stay offers.</p>
    <section className="grid grid3" style={{marginTop:30}}>
      <Card title="Problem" text="Hosts are anchored to fantasy nightly rates while calendars sit empty. Furnished-stay guests want clear monthly pricing." />
      <Card title="Product" text="Analyze the gap, recommend a mid-term offer, generate a direct page, and capture host-owned requests." />
      <Card title="Business model" text="Free analysis, $19 gap publishing, $49 one-property plan, $99 portfolio plan, and later booking success fees." />
    </section>
    <section className="sectionline" style={{marginTop:40}}><div className="wrap section"><p className="kicker">Strategic value</p><h2 className="big">This is a host-retention problem for the platforms.</h2><p className="muted">If hosts cannot make money, supply churns. GapStay creates a recovery path for supply that nightly marketplaces fail to clear.</p></div></section>
    <section className="section grid grid2"><Card title="What we are not" text="Not Airbnb but cheaper. Not a marketplace-first liquidity bet. Not generic dynamic pricing."/><Card title="What we are" text="A revenue recovery workflow for underperforming STR inventory that bridges hosts to mid-term furnished demand."/></section>
    <div className="actions"><Link className="darkpill" href="/host">See product flow</Link><Link className="pill" href="/gtm">GTM plan</Link></div>
  </main>
}
function Card({title,text}:{title:string;text:string}){return <div className="card pad"><h3>{title}</h3><p className="muted">{text}</p></div>}
