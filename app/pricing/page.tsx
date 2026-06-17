import Link from "next/link";

const plans = [
  { name: "Free", price: "$0", text: "Analyze one gap and generate a sample listing page.", cta: "Start free" },
  { name: "Host", price: "$29/mo", text: "For one furnished property. Unlimited gap analyses and direct inquiry pages.", cta: "Analyze a gap" },
  { name: "Pro", price: "$99/mo", text: "For multi-property hosts and small managers who need repeatable gap pricing.", cta: "Use pro" }
];

export default function PricingPage(){
  return <main className="wrap section topspace"><p className="kicker">Pricing</p><h1 className="big">Simple enough for a host to understand in ten seconds.</h1><p className="lead" style={{fontSize:18}}>GapStay starts as a host-side tool. The job is not to become Airbnb. The job is to turn vacant dates into a realistic furnished-stay offer.</p><div className="grid grid3" style={{marginTop:34}}>{plans.map(p=><div className="card pad" key={p.name}><h2>{p.name}</h2><div className="price">{p.price}</div><p className="muted">{p.text}</p><Link className={p.name==="Host"?"darkpill":"pill"} href="/host">{p.cta}</Link></div>)}</div><section className="card pad" style={{marginTop:28}}><h2>Later revenue options</h2><ul className="list"><li>5% success fee on confirmed direct bookings.</li><li>Property manager plan for portfolio-level gap alerts.</li><li>Insurance displacement workflow for documented temporary housing requests.</li></ul></section></main>
}
