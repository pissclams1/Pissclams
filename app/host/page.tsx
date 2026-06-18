"use client";
import { FormEvent, useState } from "react";
import Link from "next/link";
import { analyzeGap, money, prettyDate } from "../../lib/pricing";
import { saveListingRemote, type Listing } from "../../lib/store";

type Signals = { rating?: string; reviews?: string; guests?: string; bedrooms?: string; bathrooms?: string; nightly?: string; unavailableMentions?: number };
type ImportState = { imported?: boolean; source?: string; title?: string; description?: string; image?: string; note?: string; signals?: Signals } | null;

export default function HostPage(){
  const [form,setForm]=useState({sourceUrl:"",startDate:"2026-07-03",endDate:"2026-08-14",nightlyTarget:"210",expectedOccupancy:"43",cleaningFee:"195",market:"balanced",title:"Quiet furnished stay with workspace",city:"Marco Island",state:"FL",propertyType:"Condo",bedrooms:"2",bathrooms:"2",hostName:"Host",ownerEmail:"",description:"A furnished mid-term stay with fast Wi-Fi, kitchen, laundry, parking, and transparent all-in pricing."});
  const [listing,setListing]=useState<Listing|null>(null);
  const [saving,setSaving]=useState(false);
  const [importing,setImporting]=useState(false);
  const [imported,setImported]=useState<ImportState>(null);
  const [showManual,setShowManual]=useState(false);
  function update(key:string,value:string){setForm(prev=>({...prev,[key]:value}))}
  async function importSourceUrl(){
    setImporting(true);
    try{
      const response=await fetch("/api/import-listing",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({url:form.sourceUrl})});
      const data=await response.json();
      if(!data.ok){alert(data.message||"Could not import listing.");return}
      const s=data.signals||{};
      setImported(data);
      setForm(prev=>({...prev,startDate:data.startDate||prev.startDate,endDate:data.endDate||prev.endDate,title:data.title||prev.title,description:data.description||prev.description,nightlyTarget:s.nightly||prev.nightlyTarget,bedrooms:s.bedrooms||prev.bedrooms,bathrooms:s.bathrooms||prev.bathrooms}));
      setShowManual(true);
    }catch{alert("Could not import this listing. You can enter the details manually.")}
    finally{setImporting(false)}
  }
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
    <div><p className="kicker">Free gap scan</p><h1 className="big">Paste your Airbnb or VRBO link.</h1><p className="muted">GapStay imports what it can, captures visible dates from the link, and gives you a confirm/edit screen before analysis. Manual entry is only the backup.</p>
      <div className="card pad grid" style={{marginTop:24, marginBottom:18}}><Field label="Airbnb or VRBO listing URL" value={form.sourceUrl} onChange={v=>update("sourceUrl",v)} required={false}/><button className="darkpill" type="button" onClick={importSourceUrl} disabled={importing}>{importing?"Importing...":"Import listing"}</button><p className="small">Paste a public listing URL. GapStay imports public metadata, visible signals, and check-in/check-out dates when available.</p></div>
      {imported?<div className="card pad" style={{marginBottom:18}}><p className="kicker">Imported from {imported.source||"listing"}</p><h2>{form.title}</h2><p className="muted">{imported.note||"Confirm the details below before analysis."}</p>{imported.image?<img src={imported.image} alt="Imported listing" style={{width:"100%",borderRadius:18,marginTop:12}}/>:null}<div className="result" style={{marginTop:18}}><Signal label="Start" value={prettyDate(form.startDate)}/><Signal label="End" value={prettyDate(form.endDate)}/><Signal label="Nightly" value={imported.signals?.nightly?`$${imported.signals.nightly}`:"Confirm"}/><Signal label="Reviews" value={imported.signals?.reviews||"Not visible"}/><Signal label="Rating" value={imported.signals?.rating||"Not visible"}/><Signal label="Guests" value={imported.signals?.guests||"Not visible"}/><Signal label="Bedrooms" value={imported.signals?.bedrooms||form.bedrooms}/><Signal label="Bathrooms" value={imported.signals?.bathrooms||form.bathrooms}/><Signal label="Availability clues" value={typeof imported.signals?.unavailableMentions==="number"?`${imported.signals.unavailableMentions} visible mentions`:"Limited"}/></div></div>:null}
      {!showManual?<div className="card pad"><h3>Need to enter it manually?</h3><p className="muted">Use this only if the listing import fails or you do not have a public listing yet.</p><button className="pill" type="button" onClick={()=>setShowManual(true)}>Enter details manually</button></div>:<form onSubmit={submit} className="card pad grid" style={{marginTop:24}}>
        <p className="kicker">Confirm or edit</p>
        <div className="grid grid2"><Field label="Start date" type="date" value={form.startDate} onChange={v=>update("startDate",v)}/><Field label="End date" type="date" value={form.endDate} onChange={v=>update("endDate",v)}/></div>
        <div className="grid grid3"><Field label="Nightly target" value={form.nightlyTarget} onChange={v=>update("nightlyTarget",v)}/><Field label="Expected occupancy %" value={form.expectedOccupancy} onChange={v=>update("expectedOccupancy",v)}/><Field label="Cleaning fee" value={form.cleaningFee} onChange={v=>update("cleaningFee",v)}/></div>
        <label><span className="label">Market</span><select className="input" value={form.market} onChange={e=>update("market",e.target.value)}><option value="soft">Soft / lots of vacancy</option><option value="balanced">Balanced</option><option value="hot">Hot / scarce inventory</option></select></label>
        <div className="grid grid2"><Field label="Listing title" value={form.title} onChange={v=>update("title",v)}/><Field label="Host name" value={form.hostName} onChange={v=>update("hostName",v)}/></div>
        <Field label="Host email" type="email" value={form.ownerEmail} onChange={v=>update("ownerEmail",v)}/>
        <div className="grid grid3"><Field label="City" value={form.city} onChange={v=>update("city",v)}/><Field label="State" value={form.state} onChange={v=>update("state",v)}/><Field label="Type" value={form.propertyType} onChange={v=>update("propertyType",v)}/></div>
        <div className="grid grid2"><Field label="Bedrooms" value={form.bedrooms} onChange={v=>update("bedrooms",v)}/><Field label="Bathrooms" value={form.bathrooms} onChange={v=>update("bathrooms",v)}/></div>
        <label><span className="label">Description</span><textarea className="input textarea" value={form.description} onChange={e=>update("description",e.target.value)}/></label>
        <button className="darkpill" type="submit">{saving?"Saving...":"Analyze imported listing"}</button>
      </form>}
    </div>
    <div className="card pad" style={{alignSelf:"start",position:"sticky",top:96}}>{listing?<Result listing={listing}/>:<p className="muted">Your scan will appear here after import and confirmation. It will compare likely nightly revenue against a furnished-stay fallback offer.</p>}</div>
  </div></main>
}
function Field({label,value,onChange,type="text",required=true}:{label:string;value:string;onChange:(v:string)=>void;type?:string;required?:boolean}){return <label><span className="label">{label}</span><input className="input" type={type} value={value} onChange={e=>onChange(e.target.value)} required={required}/></label>}
function Signal({label,value}:{label:string;value:string}){return <div className="stat"><span>{label}</span><strong>{value}</strong></div>}
function timingCall(startDate:string,nights:number){const days=Math.round((new Date(`${startDate}T12:00:00`).getTime()-Date.now())/86400000);if(days>90)return{label:"Watch",text:"Too early to act. Keep tracking it, but this gap is long enough to keep on the radar."};if(days>60)return{label:"Package now",text:"This is the backup-offer window. Keep Airbnb live, but build the furnished-stay offer before monthly guests move on."};if(days>45)return{label:"Act now",text:"Start sharing the offer. Monthly guests are still possible, but the window is closing."};if(days>30)return{label:"Late",text:"You can still try, but waiting has already reduced the monthly-stay pool."};return{label:"Salvage",text:"Under 30 days is usually discounted nightly, local outreach, or partial-stay salvage."}}
function Result({listing}:{listing:Listing}){const a=listing.analysis;const t=timingCall(a.startDate,a.nights);return <div><p className="kicker">GapStay recommendation</p><h2 className="big">{t.label}</h2><p className="muted">{prettyDate(a.startDate)} - {prettyDate(a.endDate)} · {a.nights} nights · suggested furnished-stay offer {money(a.recommendedTotal)}</p><div className="metric" style={{marginTop:18}}><b>Best next move</b><p className="small">{t.text}</p></div><div className="metric" style={{marginTop:14}}><b>Keep the upside. Add a fallback.</b><p className="small">Keep Airbnb live while you test this furnished-stay offer. Only block the dates when a renter is ready.</p></div><div className="result" style={{marginTop:18}}><div className="stat"><span>Best-case nightly</span><strong>{money(a.fullNightRevenue)}</strong></div><div className="stat"><span>Likely nightly</span><strong>{money(a.likelyShortTermRevenue)}</strong></div><div className="stat"><span>Fallback offer</span><strong>{money(a.recommendedTotal)}</strong></div><div className="stat"><span>Saved turns</span><strong>{money(a.turnoverSavings)}</strong></div></div><ul className="list">{a.explanation.map(x=><li key={x}>{x}</li>)}<li>Post the furnished-stay offer where temporary renters actually look.</li><li>Use Calendar Watch only if you want future gaps monitored.</li></ul><div className="actions"><Link className="darkpill" href="/pricing">Publish this offer - $19</Link><Link className="pill" href={`/listing/${listing.id}`}>Preview offer</Link></div><div className="card pad" style={{marginTop:18}}><h3>Want this for future gaps?</h3><p className="muted">Calendar Watch is early access assisted monitoring for hosts who want future gaps watched.</p><div className="actions"><Link className="pill" href="/pricing">See watch plans</Link></div></div></div>}
