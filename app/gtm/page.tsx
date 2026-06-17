import Link from "next/link";

const channels = [
  ["Facebook host groups", "Find hosts complaining about empty calendars and offer the free analyzer as a diagnostic, not a sales pitch."],
  ["Reddit and forums", "Use problem-led posts about pricing long gaps. Move interested hosts into the calculator."],
  ["Direct host outreach", "Target listings with visible 14-90 day gaps and show the specific recovery angle."],
  ["Small property managers", "Pitch portfolio gap recovery across multiple STR units."],
  ["SEO", "Own searches around Airbnb occupancy down, empty calendar, and mid-term pricing."]
];

export default function GTMPage(){
  return <main className="wrap section topspace">
    <p className="kicker">Go to market</p>
    <h1 className="big">Sell the diagnosis before the product.</h1>
    <p className="lead" style={{fontSize:18}}>The first buyer is not looking for another SaaS subscription. They are looking at a dead calendar block and trying to decide whether it can still make money.</p>
    <section className="grid grid3" style={{marginTop:30}}>
      <Card title="ICP" text="1-3 property hosts and small STR managers in soft or seasonal markets with visible 14-90 day gaps." />
      <Card title="Activation" text="The host sees fantasy Airbnb revenue vs likely outcome vs GapStay recovery offer." />
      <Card title="Paid conversion" text="$19 to publish one recovery page for 30 days after the free analysis." />
    </section>
    <section className="section"><p className="kicker">Channels</p><h2 className="big">Start where hosts already complain.</h2><div className="grid grid2" style={{marginTop:22}}>{channels.map(([title,text])=><Card key={title} title={title} text={text}/>)}</div></section>
    <section className="card pad"><p className="kicker">Launch message</p><h2>Your $8,000 Airbnb gap may not be worth $8,000. See what it is actually worth as a furnished mid-term stay.</h2><p className="muted">This creates the hook without promising demand we do not yet control. The page then shows the host a publishable offer.</p><div className="actions"><Link className="darkpill" href="/host">Analyze a gap</Link><Link className="pill" href="/pricing">Pricing</Link></div></section>
  </main>
}
function Card({title,text}:{title:string;text:string}){return <div className="card pad"><h3>{title}</h3><p className="muted">{text}</p></div>}
