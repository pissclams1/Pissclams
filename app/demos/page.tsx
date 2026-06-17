import Link from "next/link";

const tiers = [
  {
    name: "Free analysis",
    price: "$0",
    buyer: "Curious or skeptical host",
    job: "Show me whether this empty block is worth trying to recover.",
    gives: ["Enter one gap", "See fantasy revenue vs likely Airbnb outcome", "See recommended furnished-stay offer", "Preview what the page would look like", "No public page", "No inquiry capture"],
    cta: "Analyze free"
  },
  {
    name: "Publish one gap",
    price: "$19 / 30 days",
    buyer: "Host with one painful vacancy",
    job: "Let me try to fill this specific dead month without starting another subscription.",
    gives: ["Everything in Free", "One live public GapStay page", "Shareable link", "Guest request form", "Requests saved in dashboard", "Expires after 30 days unless renewed"],
    cta: "Publish one gap"
  },
  {
    name: "One property plan",
    price: "$49 / month",
    buyer: "Host with repeat gaps",
    job: "Keep this property optimized whenever another gap appears.",
    gives: ["Unlimited gap pages for one property", "Persistent dashboard", "Multiple active listings", "Request tracking", "Gap alerts", "Better fit once the host has more than two gaps per quarter"],
    cta: "Start property plan"
  }
];

export default function DemosPage(){
  return <main className="wrap section topspace">
    <p className="kicker">Plan demos</p>
    <h1 className="big">Free proves the math. $19 tests one gap. $49 manages the property.</h1>
    <p className="lead" style={{fontSize:18}}>The $19 plan is not meant to compete with the $49 plan. It is a low-friction bridge for a host who does not want another subscription yet.</p>
    <div className="grid grid3" style={{marginTop:32}}>{tiers.map(t=><div className="card pad" key={t.name}><p className="kicker">{t.name}</p><div className="price">{t.price}</div><p className="muted"><b>Buyer:</b> {t.buyer}</p><p className="muted"><b>Job:</b> {t.job}</p><ul className="list">{t.gives.map(x=><li key={x}>{x}</li>)}</ul><Link className={t.name.includes("Publish")?"darkpill":"pill"} href="/host">{t.cta}</Link></div>)}</div>
    <section className="card pad" style={{marginTop:30}}><p className="kicker">The clean distinction</p><h2>$19 is a campaign. $49 is an operating system.</h2><p className="muted">A host buys $19 when they have one ugly opening and want to see if GapStay can help recover it. A host buys $49 when they believe GapStay should stay attached to the property and handle every future gap.</p></section>
  </main>
}
