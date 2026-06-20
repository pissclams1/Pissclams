"use client";
import { FormEvent, useState } from "react";

type RateDay = { date: string; currentRate: number; recommendedRate: number; delta: number; status: "overpriced" | "underpriced" | "ok" | "urgent"; expectedOccupancy: number; confidence: number; reason: string };
type Result = { ok: boolean; message?: string; needsRate?: boolean; baseRate?: number; city?: string; state?: string; summary?: { overpriced: number; underpriced: number; urgent: number; avgRecommendedRate: number }; days?: RateDay[] };

function money(value:number){return new Intl.NumberFormat("en-US",{style:"currency",currency:"USD",maximumFractionDigits:0}).format(value||0)}
function dateLabel(value:string){return new Date(`${value}T12:00:00`).toLocaleDateString("en-US",{month:"short",day:"numeric",weekday:"short"})}
function statusLabel(status:RateDay["status"]){if(status==="urgent")return"Cut now";if(status==="overpriced")return"Likely high";if(status==="underpriced")return"Likely low";return"Close"}
function statusColor(status:RateDay["status"]){if(status==="urgent")return"#b46a4f";if(status==="overpriced")return"#e87b6a";if(status==="underpriced")return"#7ecfaa";return"#ead27b"}

export default function PricePage(){
  const [url,setUrl]=useState("");
  const [baseRate,setBaseRate]=useState("");
  const [loading,setLoading]=useState(false);
  const [result,setResult]=useState<Result|null>(null);
  async function submit(e:FormEvent){e.preventDefault();setLoading(true);setResult(null);try{const response=await fetch("/api/rate-check",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({url,baseRate:Number(baseRate||0)})});setResult(await response.json())}catch{setResult({ok:false,message:"Could not run the rate check."})}finally{setLoading(false)}}
  const urgent=result?.summary?.urgent||0;const over=result?.summary?.overpriced||0;const under=result?.summary?.underpriced||0;
  return <main className="wrap section topspace">
    <p className="kicker">Airbnb Rate Rescue</p>
    <h1 className="big">Find the nights your Airbnb price is probably wrong.</h1>
    <p className="lead" style={{fontSize:18,maxWidth:720}}>Paste your Airbnb or VRBO link. GapStay checks the next 90 days and shows which nights look overpriced, underpriced, or urgent based on season, holiday proximity, lead time, and day of week.</p>
    <form onSubmit={submit} className="card pad grid" style={{marginTop:28,maxWidth:780}}>
      <label><span className="label">Airbnb or VRBO listing URL</span><input className="input" type="url" value={url} onChange={e=>setUrl(e.target.value)} placeholder="Paste listing URL" required/></label>
      {result?.needsRate?<label><span className="label">Current nightly rate</span><input className="input" type="number" value={baseRate} onChange={e=>setBaseRate(e.target.value)} placeholder="285" required/></label>:null}
      <button className="darkpill" type="submit" disabled={loading}>{loading?"Checking rates...":"Check my rates"}</button>
      <p className="small">No calendar sync. No PMS. No setup maze. This is a diagnostic, not an autopilot.</p>
    </form>
    {result&&!result.ok?<div className="errorBox" style={{marginTop:18,maxWidth:780}}>{result.message}</div>:null}
    {result?.ok?<section style={{marginTop:32}}>
      <div className="card pad" style={{background:"#111",color:"#fbf7ef"}}><p className="kicker" style={{color:"rgba(251,247,239,.55)"}}>Detected current rate</p><div className="grid grid3"><div><strong style={{fontSize:42}}>{money(result.baseRate||0)}</strong><p style={{color:"rgba(251,247,239,.6)"}}>Your anchor rate.</p></div><div><strong style={{fontSize:42}}>{over}</strong><p style={{color:"rgba(251,247,239,.6)"}}>Likely overpriced nights.</p></div><div><strong style={{fontSize:42}}>{under}</strong><p style={{color:"rgba(251,247,239,.6)"}}>Likely underpriced nights.</p></div></div>{urgent?<p style={{color:"#fbf7ef",marginTop:14}}><b>{urgent} urgent nights</b> may need a cut soon if you want them booked.</p>:null}</div>
      <div style={{display:"grid",gap:10,marginTop:22}}>{(result.days||[]).slice(0,30).map(day=><article key={day.date} className="card pad" style={{display:"grid",gridTemplateColumns:"120px 1fr 120px",gap:16,alignItems:"center",borderLeft:`6px solid ${statusColor(day.status)}`}}><div><p className="kicker">{dateLabel(day.date)}</p><strong>{statusLabel(day.status)}</strong></div><div><p style={{margin:0}}><b>{money(day.currentRate)}</b> current → <b>{money(day.recommendedRate)}</b> recommended</p><p className="small" style={{margin:"6px 0 0"}}>{day.reason}</p></div><div style={{textAlign:"right"}}><strong>{day.expectedOccupancy}%</strong><p className="small" style={{margin:0}}>expected occupancy<br/>{day.confidence}% confidence</p></div></article>)}</div>
      <div className="successBox" style={{marginTop:18}}><strong>Paid report idea:</strong> unlock all 90 days, CSV export, and weekly updates when recommendations change.</div>
    </section>:null}
  </main>
}
