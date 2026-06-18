"use client";
import { FormEvent, useState } from "react";
import Link from "next/link";
import { analyzeGap, money, prettyDate } from "../../lib/pricing";
import { saveListingRemote, type Listing } from "../../lib/store";

export default function HostPage(){
  const [form,setForm]=useState({startDate:"2026-07-03",endDate:"2026-08-14",nightlyTarget:"210",expectedOccupancy:"43",cleaningFee:"195",market:"balanced",title:"Quiet furnished stay with workspace",city:"Marco Island",state:"FL",propertyType:"Condo",bedrooms:"2",bathrooms:"2",hostName:"Host",ownerEmail:"",description:"A furnished mid-term stay with fast Wi-Fi, kitchen, laundry, parking, and transparent all-in pricing."});
  const [listing,setListing]=useState<Listing|null>(null);
  const [saving,setSaving]=useState(false);
  function update(key:string,value:string){setForm(prev=>({...prev,[key]:value}))}
  async function submit(e:FormEvent){
    e.preventDefault();
    setSaving(true);
    const analysis=analyzeGap({startDate:form.startDate,endDate:form.endDate,nightlyTarget:Number(form.nightlyTarget),expectedOccupancy:Number(form.expectedOccupancy),cleaningFee:Number(form.cleaningFee),market:form.market as any});
    const next:Listing={id:`listing-${Date.now().toString(36)}`,title:form.title,city:form.city,state:form.state,propertyType:form.propertyType,bedrooms:Number(form.bedrooms),bathrooms:Number(form.bathrooms),hostName:form.hostName,description:form.description,amenities:["Fast Wi-Fi","Workspace","Kitchen","Laundry","Parking","Utilities included"],rules:["No smoking","Normal checkout cleaning","Quiet hours after 10 PM"],analysis};
    const saved=await saveListingRemote(next, form.ownerEmail || undefined);
    setListing(saved);
    setSaving(false);
  }
  return <main className="wrap section topspace"><div className="grid grid2">
    <div><p className="kicker">Host analyzer</p><h1 className="big">Turn vacant dates into a realistic furnished-stay offer.</h1><p className="muted">Enter a calendar gap, your current nightly target, and expected occupancy. GapStay calculates the all-in furnished-stay offer and gives you a timing call.</p>
      <form onSubmit={submit} className="card pad grid" style={{marginTop:24}}>
        <div className="grid grid2"><Field label="Start date" type="date" value={form.startDate} onChange={v=>update("startDate",v)}/><Field label="End date" type="date" value={form.endDate} onChange={v=>update("endDate",v)}/></div>
        <div className="grid grid3"><Field label="Nightly target" value={form.nightlyTarget} onChange={v=>update("nightlyTarget",v)}/><Field label="Expected occupancy %" value={form.expectedOccupancy} onChange={v=>update("expectedOccupancy",v)}/><Field label="Cleaning fee" value={form.cleaningFee} onChange={v=>update("cleaningFee",v)}/></div>
        <label><span className="label">Market</span><select className="input" value={form.market} onChange={e=>update("market",e.target.value)}><option value="soft">Soft / lots of vacancy</option><option value="balanced">Balanced</option><option value="hot">Hot / scarce inventory</option></select></label>
        <div className="grid grid2"><Field label="Listing title" value={form.title} onChange={v=>update("title",v)}/><Field label="Host name" value={form.hostName} onChange={v=>update("hostName",v)}/></div>
        <Field label="Host email" type="email" value={form.ownerEmail} onChange={v=>update("ownerEmail",v)}/>
        <div className="grid grid3"><Field label="City" value={form.city} onChange={v=>update("city",v)}/><Field label="State" value={form.state} onChange={v=>update("state",v)}/><Field label="Type" value={form.propertyType} onChange={v=>update("propertyType",v)}/></div>
        <div className="grid grid2"><Field label="Bedrooms" value={form.bedrooms} onChange={v=>update("bedrooms",v)}/><Field label="Bathrooms" value={form.bathrooms} onChange={v=>update("bathrooms",v)}/></div>
        <label><span className="label">Description</span><textarea className="input textarea" value={form.description} onChange={e=>update("description",e.target.value)}/></label>
        <button className="darkpill" type="submit">{saving?"Saving...":"Generate GapStay offer"}</button>
      </form>
    </div>
    <div className="card pad" style={{alignSelf:"start",position:"sticky",top:96}}>{listing?<Result listing={listing}/>:<p className="muted">Your result will appear here. It will compare likely short-term revenue against a furnished-stay offer, then show timing status and a public listing link.</p>}</div>
  </div></main>
}
function Field({label,value,onChange,type="text"}:{label:string;value:string;onChange:(v:string)=>void;type?:string}){return <label><span className="label">{label}</span><input className="input" type={type} value={value} onChange={e=>onChange(e.target.value)} required/></label>}
function timingCall(startDate:string,nights:number){const days=Math.round((new Date(`${startDate}T12:00:00`).getTime()-Date.now())/86400000);if(days>90)return{label:"Watch",text:"Too early to panic. Keep tracking it, but this gap is long enough to keep on the radar."};if(days>60)return{label:"Package now",text:"This is the backup-offer window. Keep Airbnb live, but build the furnished-stay page before monthly guests move on."};if(days>45)return{label:"Act now",text:"Start sharing the page. Monthly guests are still possible, but the window is closing."};if(days>30)return{label:"Late",text:"You can still try, but waiting has already reduced the monthly-stay pool."};return{label:"Salvage",text:"Under 30 days is usually no longer optimization. It is discounted nightly, local outreach, or partial-stay salvage."}}
function Result({listing}:{listing:Listing}){const a=listing.analysis;const t=timingCall(a.startDate,a.nights);return <div><p className="kicker">Recommended offer</p><h2 className="big">{money(a.recommendedTotal)}</h2><p className="muted">{prettyDate(a.startDate)} - {prettyDate(a.endDate)} · {a.nights} nights · {money(a.monthlyEquivalent)}/mo equivalent</p><div className="metric" style={{marginTop:18}}><b>{t.label}</b><p className="small">{t.text}</p></div><div className="metric" style={{marginTop:14}}><b>Annual revenue beats nightly ego.</b><p className="small">The goal is not the highest nightly rate on a screenshot. The goal is the most money collected across the year after empty nights, platform fees, cleaning turns, and carrying costs.</p></div><div className="result" style={{marginTop:18}}><div className="stat"><span>Full nightly target</span><strong>{money(a.fullNightRevenue)}</strong></div><div className="stat"><span>Likely short-term</span><strong>{money(a.likelyShortTermRevenue)}</strong></div><div className="stat"><span>GapStay offer</span><strong>{money(a.recommendedTotal)}</strong></div><div className="stat"><span>Saved turns</span><strong>{money(a.turnoverSavings)}</strong></div></div><ul className="list">{a.explanation.map(x=><li key={x}>{x}</li>)}</ul><div className="actions"><Link className="darkpill" href={`/listing/${listing.id}`}>Open listing</Link><Link className="pill" href="/dashboard">Dashboard</Link></div></div>}
