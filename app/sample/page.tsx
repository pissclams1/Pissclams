import Link from "next/link";
import { buildCalendarPlan } from "../../lib/calendar-plan";

const profiles: Record<string, { title: string; city: string; state: string; sourceUrl: string; bedrooms: number; nightly: number; furnishedMonthly: number; marketRent: number }> = {
  NY: { title: "Massapequa, NY house", city: "Massapequa", state: "NY", sourceUrl: "https://www.airbnb.com/rooms/massapequa-sample", bedrooms: 4, nightly: 285, furnishedMonthly: 3600, marketRent: 3000 },
  FL: { title: "Marco Island furnished condo", city: "Marco Island", state: "FL", sourceUrl: "https://www.airbnb.com/rooms/marco-island-sample", bedrooms: 2, nightly: 220, furnishedMonthly: 3900, marketRent: 3100 },
  UT: { title: "Park City ski-market home", city: "Park City", state: "UT", sourceUrl: "https://www.airbnb.com/rooms/park-city-sample", bedrooms: 3, nightly: 425, furnishedMonthly: 6200, marketRent: 4900 },
  default: { title: "Suburban furnished house", city: "Your market", state: "", sourceUrl: "https://www.airbnb.com/rooms/sample", bedrooms: 3, nightly: 185, furnishedMonthly: 3600, marketRent: 3000 }
};

type MonthVerdict = { key: string; name: string; decision: "AIRBNB" | "FURNISHED"; airbnbLikely: number; furnished: number; delta: number; reason: string };

function money(v:number){return new Intl.NumberFormat("en-US",{style:"currency",currency:"USD",maximumFractionDigits:0}).format(v)}
function monthName(key:string){return new Date(`${key}-15T12:00:00`).toLocaleDateString("en-US",{month:"long"})}
function color(decision:string){return decision==="AIRBNB"?"#7ecfaa":"#e87b6a"}
function dayAirbnbWeight(decision:string){return decision==="AIRBNB"?0.92:decision==="WATCH"?0.58:0.18}

function buildVerdicts(profile: typeof profiles.default): MonthVerdict[] {
  const plan = buildCalendarPlan({ sourceUrl: profile.sourceUrl, city: profile.city, state: profile.state, horizonDays: 365 });
  const grouped = new Map<string, typeof plan.days>();
  for (const day of plan.days) grouped.set(day.monthKey, [...(grouped.get(day.monthKey) || []), day]);
  return Array.from(grouped.entries()).slice(0,12).map(([key,days]) => {
    const airbnbLikely = Math.round(days.reduce((sum,d)=>sum + profile.nightly * dayAirbnbWeight(d.decision),0));
    const furnished = Math.round(profile.furnishedMonthly * (days.length / 30));
    const decision = airbnbLikely >= furnished ? "AIRBNB" : "FURNISHED";
    const delta = Math.abs(furnished - airbnbLikely);
    const airbnbDays = days.filter(d=>d.decision==="AIRBNB").length;
    const watchDays = days.filter(d=>d.decision==="WATCH").length;
    const reason = decision === "AIRBNB"
      ? `${airbnbDays} strong Airbnb days${watchDays ? ` plus ${watchDays} watch days` : ""} make short-stay upside worth holding.`
      : "Comparable furnished-rental cash flow beats the likely short-stay outcome.";
    return { key, name: monthName(key), decision, airbnbLikely, furnished, delta, reason };
  });
}

export default function SamplePage({ searchParams }: { searchParams?: { state?: string } }) {
  const state = String(searchParams?.state || "NY").toUpperCase();
  const profile = profiles[state] || profiles.default;
  const verdicts = buildVerdicts(profile);
  const airbnbTotal = verdicts.reduce((sum,v)=>sum+v.airbnbLikely,0);
  const optimizedTotal = verdicts.reduce((sum,v)=>sum+(v.decision==="AIRBNB"?v.airbnbLikely:v.furnished),0);
  const gain = optimizedTotal - airbnbTotal;
  return <main className="wrap section topspace">
    <p className="kicker">Sample Calendar CFO plan</p>
    <h1 className="big">{profile.title} could leave {money(gain)} on the table this year.</h1>
    <p className="lead" style={{fontSize:18,maxWidth:760}}>This is what GapStay sells: a plain-English calendar that tells the host which months belong on Airbnb and which should be marketed as furnished housing.</p>

    <section className="card pad" style={{background:"#111",color:"#fbf7ef",margin:"28px 0"}}>
      <div className="grid grid3">
        <div><p className="kicker" style={{color:"rgba(251,247,239,.55)"}}>Airbnb-only path</p><strong style={{fontSize:38}}>{money(airbnbTotal)}</strong><p style={{color:"rgba(251,247,239,.58)"}}>Likely annual short-stay revenue if every month stays on Airbnb.</p></div>
        <div><p className="kicker" style={{color:"rgba(251,247,239,.55)"}}>GapStay plan</p><strong style={{fontSize:38}}>{money(optimizedTotal)}</strong><p style={{color:"rgba(251,247,239,.58)"}}>Use Airbnb when it wins. Use furnished housing when it wins.</p></div>
        <div><p className="kicker" style={{color:"rgba(251,247,239,.55)"}}>Potential gain</p><strong style={{fontSize:38,color:"#7ecfaa"}}>{money(gain)}</strong><p style={{color:"rgba(251,247,239,.58)"}}>The value is not one high-rate weekend. It is the full-year plan.</p></div>
      </div>
    </section>

    <section className="grid grid3" style={{marginTop:24}}>
      {verdicts.map(v=><article key={v.key} className="card pad" style={{borderLeft:`6px solid ${color(v.decision)}`}}><p className="kicker">{v.name}</p><h3 style={{whiteSpace:"nowrap"}}>{v.decision}</h3><p className="muted">{v.reason}</p><p className="small">Airbnb likely: <b>{money(v.airbnbLikely)}</b><br/>Furnished: <b>{money(v.furnished)}</b><br/>Difference: <b>{money(v.delta)}</b></p></article>)}
    </section>

    <section className="successBox" style={{marginTop:28}}><strong>What the paid plan adds:</strong> your real listing URL, your calendar openings, your local rent anchor, and day-level recommendations with WATCH states when the answer should update over time.</section>
    <div className="actions" style={{marginTop:24}}><Link className="darkpill" href="/host">Build my plan</Link><Link className="pill" href="/pricing">See pricing</Link></div>
  </main>;
}
