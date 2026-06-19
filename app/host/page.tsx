"use client";
import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { analyzeGap, money, prettyDate } from "../../lib/pricing";
import { saveListingRemote, type Listing } from "../../lib/store";
import CheckoutButton from "../../components/CheckoutButton";
import { detectMarket, scoreGap, type MarketSignal } from "../../lib/market-intelligence";

type Signals = { rating?: string; reviews?: string; guests?: string; bedrooms?: string; bathrooms?: string; nightly?: string; city?: string; state?: string; unavailableMentions?: number };
type Gap = { start: string; end: string; nights: number };
type ImportState = { imported?: boolean; source?: string; title?: string; description?: string; image?: string; note?: string; signals?: Signals; calendarOk?: boolean; gaps?: Gap[]; nextGap?: Gap | null; marketKey?: string; marketLabel?: string } | null;
type Advisor = { recommendation: "hold" | "package" | "split" | "salvage"; confidence: number; headline: string; reasoning: string[]; riskOfWaiting: string; nextAction: string; postCopy: string; fallback?: boolean } | null;

export default function HostPage(){
  const [form,setForm]=useState({sourceUrl:"",startDate:"",endDate:"",nightlyTarget:"",expectedOccupancy:"50",cleaningFee:"150",market:"balanced",title:"",city:"",state:"",propertyType:"Home",bedrooms:"2",bathrooms:"1",hostName:"Host",ownerEmail:"",description:""});
  const [listing,setListing]=useState<Listing|null>(null);
  const [advisor,setAdvisor]=useState<Advisor>(null);
  const [saving,setSaving]=useState(false);
  const [importing,setImporting]=useState(false);
  const [imported,setImported]=useState<ImportState>(null);
  const [showManual,setShowManual]=useState(false);
  const [error,setError]=useState("");
  const [signal,setSignal]=useState<MarketSignal|null>(null);

  useEffect(()=>{const sourceUrl=new URLSearchParams(window.location.search).get("url");if(sourceUrl){setForm(prev=>({...prev,sourceUrl}));void importSourceUrl(sourceUrl)}},[]);

  function update(key:string,value:string){setForm(prev=>({...prev,[key]:value}))}
  function refreshSignal(next:any){
    const startDate=next.startDate||form.startDate;
    const endDate=next.endDate||form.endDate;
    if(!startDate||!endDate) return;
    const nights=Math.max(0,Math.round((new Date(`${endDate}T12:00:00`).getTime()-new Date(`${startDate}T12:00:00`).getTime())/86400000));
    const marketKey=imported?.marketKey||next.marketKey||detectMarket(next.sourceUrl||form.sourceUrl,next.city||form.city,next.state||form.state);
    const daysUntil=Math.max(0,Math.round((new Date(`${startDate}T12:00:00`).getTime()-Date.now())/86400000));
    const s=scoreGap(startDate,nights,marketKey,daysUntil);
    setSignal(s);
    setForm(prev=>({...prev,expectedOccupancy:String(Math.round(s.fillProbability*100))}));
  }

  async function importSourceUrl(sourceUrl=form.sourceUrl){
    setError("");setImporting(true);setAdvisor(null);setListing(null);
    try{
      const response=await fetch("/api/import-listing",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({url:sourceUrl})});
      const data=await response.json();
      if(!data.ok){setImported(null);setShowManual(true);setError("We couldn’t import this listing automatically. Confirm the details below.");return}
      const s=data.signals||{};
      const next={sourceUrl,startDate:data.startDate||data.nextGap?.start||"",endDate:data.endDate||data.nextGap?.end||"",title:data.title||"",description:data.description||"",city:s.city||"",state:s.state||"",nightlyTarget:s.nightly||"",bedrooms:s.bedrooms||"2",bathrooms:s.bathrooms||"1",marketKey:data.marketKey};
      setImported(data);
      setForm(prev=>({...prev,sourceUrl,startDate:next.startDate||prev.startDate,endDate:next.endDate||prev.endDate,title:next.title||prev.title,description:next.description||prev.description,city:next.city||prev.city,state:next.state||prev.state,nightlyTarget:next.nightlyTarget||prev.nightlyTarget,bedrooms:next.bedrooms||prev.bedrooms,bathrooms:next.bathrooms||prev.bathrooms}));
      setShowManual(true);
      refreshSignal(next);
    }catch{setImported(null);setShowManual(true);setError("We couldn’t import this listing automatically. Confirm the details below.")}
    finally{setImporting(false)}
  }

  function chooseGap(gap:Gap){
    setForm(prev=>({...prev,startDate:gap.start,endDate:gap.end}));
    setAdvisor(null);setListing(null);
    refreshSignal({...form,startDate:gap.start,endDate:gap.end});
  }

  async function getAdvisor(analysis:any): Promise<Advisor>{
    const daysUntil=Math.max(0,Math.round((new Date(`${form.startDate}T12:00:00`).getTime()-Date.now())/86400000));
    const payload={
      listingTitle:form.title,city:form.city,state:form.state,propertyType:form.propertyType,bedrooms:Number(form.bedrooms)||2,bathrooms:Number(form.bathrooms)||1,rating:imported?.signals?.rating,reviews:imported?.signals?.reviews,sourceUrl:form.sourceUrl,
      gap:{startDate:form.startDate,endDate:form.endDate,nights:analysis.nights,daysUntil},
      economics:{nightlyRate:Number(form.nightlyTarget||0),likelyShortStayRevenue:analysis.likelyShortTermRevenue,furnishedOffer:analysis.recommendedTotal,monthlyEquivalent:analysis.monthlyEquivalent,fillProbability:analysis.fillProbability},
      marketSignal:signal?{marketLabel:signal.marketLabel,isPeakSeason:signal.isPeakSeason,nearHoliday:signal.nearHoliday,holidayName:signal.holidayName,reasoning:signal.reasoning,recommendation:signal.recommendation}:undefined
    };
    const response=await fetch("/api/ai-advisor",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(payload)});
    const data=await response.json();
    return data.advisor||null;
  }

  async function submit(e:FormEvent){
    e.preventDefault();setSaving(true);setAdvisor(null);
    const analysis=analyzeGap({startDate:form.startDate,endDate:form.endDate,nightlyTarget:Number(form.nightlyTarget||0),expectedOccupancy:Number(form.expectedOccupancy||50),cleaningFee:Number(form.cleaningFee||0),market:form.market as "soft"|"balanced"|"hot",fillProbability:signal?.fillProbability,marketLabel:signal?.marketLabel});
    const aiAdvisor=await getAdvisor(analysis).catch(()=>null);
    const next:Listing={id:`listing-${Date.now().toString(36)}`,title:form.title||`Furnished stay in ${form.city||"your area"}`,city:form.city,state:form.state,propertyType:form.propertyType,bedrooms:Number(form.bedrooms)||2,bathrooms:Number(form.bathrooms)||1,hostName:form.hostName||"Host",description:form.description,amenities:["Fast Wi-Fi","Workspace","Kitchen","Laundry","Parking","Utilities included"],rules:["No smoking","Normal checkout cleaning","Quiet hours after 10 PM"],analysis,sourceUrl:form.sourceUrl||undefined,imageUrl:imported?.image,rating:imported?.signals?.rating,reviews:imported?.signals?.reviews,guestCount:imported?.signals?.guests,nightlyRate:imported?.signals?.nightly};
    try{const saved=await saveListingRemote(next, form.ownerEmail || undefined);setListing(saved);setAdvisor(aiAdvisor)}catch(error){setError(error instanceof Error?error.message:"Could not save this analysis.");setAdvisor(aiAdvisor)}
    finally{setSaving(false)}
  }

  return <main className="wrap section topspace"><div className="grid grid2"><div><p className="kicker">AI calendar advisor</p><h1 className="big">Paste your Airbnb or VRBO listing URL.</h1><p className="muted">GapStay reads your calendar feed when available, finds open gaps, scores the next window, and uses AI to explain whether to wait or package it as a furnished stay.</p>
    <div className="card pad grid" style={{marginTop:24,marginBottom:18}}><Field label="Airbnb or VRBO listing URL" value={form.sourceUrl} onChange={v=>update("sourceUrl",v)} required={false}/><button className="darkpill" type="button" onClick={()=>importSourceUrl()} disabled={importing}>{importing?"Reading calendar...":"Read my calendar"}</button><p className="small">If the public calendar feed is available, GapStay finds actual open windows. If not, you can confirm the gap manually.</p></div>
    {error?<div className="errorBox">{error}</div>:null}
    {imported?<div className="card pad importedCard" style={{marginBottom:18}}><p className="kicker">{imported.calendarOk?`Calendar read — ${imported.gaps?.length||0} gap(s) found`:imported.imported?`Imported from ${imported.source||"listing"}`:"Manual entry ready"}</p><h2>{form.title||"Listing imported"}</h2>{imported.image?<img src={imported.image} alt={form.title} />:null}<p className="small muted">{imported.note}</p>{imported.gaps&&imported.gaps.length>0?<div className="gapList" style={{display:"flex",gap:8,flexWrap:"wrap",marginTop:14}}>{imported.gaps.slice(0,6).map((g,i)=><button key={`${g.start}-${i}`} className="pill" type="button" onClick={()=>chooseGap(g)}>{prettyDate(g.start)} – {prettyDate(g.end)} · {g.nights}n</button>)}</div>:null}<div className="result" style={{marginTop:18}}><Signal label="Selected gap" value={`${prettyDate(form.startDate)} – ${prettyDate(form.endDate)}`}/><Signal label="Market" value={imported.marketLabel||signal?.marketLabel||"Not detected"}/><Signal label="Nightly rate" value={form.nightlyTarget?`$${form.nightlyTarget}`:"Confirm"}/><Signal label="Reviews" value={imported.signals?.reviews||"Not visible"}/><Signal label="Rating" value={imported.signals?.rating||"Not visible"}/><Signal label="Bedrooms" value={form.bedrooms}/><Signal label="Bathrooms" value={form.bathrooms}/></div></div>:null}
    {signal?<div className="card pad" style={{marginBottom:18}}><p className="kicker">{signal.recommendation==="furnished"?"Recommendation preview: package the gap":"Recommendation preview: hold nightly for now"}</p><h3>Estimated short-stay fill probability: {Math.round(signal.fillProbability*100)}%</h3><ul className="list">{signal.reasoning.map(r=><li key={r}>{r}</li>)}</ul></div>:null}
    {!showManual?<div id="manual" className="manualPrompt"><button className="manualLink buttonLink" type="button" onClick={()=>setShowManual(true)}>Enter details manually</button></div>:<form onSubmit={submit} className="card pad grid" style={{marginTop:24}}><p className="kicker">Confirm or edit</p><div className="grid grid2"><Field label="Gap start date" type="date" value={form.startDate} onChange={v=>{update("startDate",v);refreshSignal({...form,startDate:v})}}/><Field label="Gap end date" type="date" value={form.endDate} onChange={v=>{update("endDate",v);refreshSignal({...form,endDate:v})}}/></div><div className="grid grid3"><Field label="Nightly rate" value={form.nightlyTarget} onChange={v=>update("nightlyTarget",v)}/><Field label="Fill probability %" value={form.expectedOccupancy} onChange={v=>update("expectedOccupancy",v)}/><Field label="Cleaning fee" value={form.cleaningFee} onChange={v=>update("cleaningFee",v)}/></div><label><span className="label">Market conditions</span><select className="input" value={form.market} onChange={e=>update("market",e.target.value)}><option value="soft">Soft / lots of vacancy</option><option value="balanced">Balanced</option><option value="hot">Hot / scarce inventory</option></select></label><div className="grid grid2"><Field label="Listing title" value={form.title} onChange={v=>update("title",v)}/><Field label="Host name" value={form.hostName} onChange={v=>update("hostName",v)}/></div><div className="grid grid3"><Field label="City" value={form.city} onChange={v=>update("city",v)}/><Field label="State" value={form.state} onChange={v=>update("state",v)}/><Field label="Type" value={form.propertyType} onChange={v=>update("propertyType",v)}/></div><div className="grid grid2"><Field label="Bedrooms" value={form.bedrooms} onChange={v=>update("bedrooms",v)}/><Field label="Bathrooms" value={form.bathrooms} onChange={v=>update("bathrooms",v)}/></div><label><span className="label">Description</span><textarea className="input textarea" value={form.description} onChange={e=>update("description",e.target.value)}/></label><button className="darkpill" type="submit">{saving?"Asking AI advisor...":"Analyze this gap"}</button></form>}
  </div><div className="card pad" style={{alignSelf:"start",position:"sticky",top:96}}>{listing?<Result listing={listing} advisor={advisor}/>:<p className="muted">After the calendar is read and details are confirmed, GapStay will compare likely short-stay revenue against one furnished-stay offer and explain the recommendation.</p>}</div></div></main>
}
function Field({label,value,onChange,type="text",required=true}:{label:string;value:string;onChange:(v:string)=>void;type?:string;required?:boolean}){return <label><span className="label">{label}</span><input className="input" type={type} value={value} onChange={e=>onChange(e.target.value)} required={required}/></label>}
function Signal({label,value}:{label:string;value:string}){return <div className="stat"><span>{label}</span><strong>{value}</strong></div>}
function Result({listing,advisor}:{listing:Listing;advisor:Advisor}){const a=listing.analysis;return <div><p className="kicker">GapStay recommendation</p><h2 className="big">{advisor?.headline|| (a.recommendation==="furnished"?"Package this gap":"Hold for short stays")}</h2><p className="muted">{prettyDate(a.startDate)} - {prettyDate(a.endDate)} · {a.nights} nights · furnished-stay offer {money(a.recommendedTotal)}</p>{advisor?<div className="metric" style={{marginTop:18}}><b>AI advisor · {advisor.confidence}% confidence</b><p className="small">{advisor.nextAction}</p></div>:null}<div className="result" style={{marginTop:18}}><div className="stat"><span>Best-case nightly</span><strong>{money(a.fullNightRevenue)}</strong></div><div className="stat"><span>Likely short-stay</span><strong>{money(a.likelyShortTermRevenue)}</strong></div><div className="stat"><span>Furnished offer</span><strong>{money(a.recommendedTotal)}</strong></div><div className="stat"><span>Fill probability</span><strong>{Math.round(a.fillProbability*100)}%</strong></div></div>{advisor?<div className="card pad" style={{marginTop:18}}><p className="kicker">Why</p><ul className="list">{advisor.reasoning.map(x=><li key={x}>{x}</li>)}</ul><p className="small"><b>Risk of waiting:</b> {advisor.riskOfWaiting}</p><p className="small"><b>Post-ready copy:</b> {advisor.postCopy}</p></div>:<ul className="list">{a.explanation.map(x=><li key={x}>{x}</li>)}</ul>}<div className="actions"><CheckoutButton plan="publish_gap" listingId={listing.id}>Publish this offer — $19</CheckoutButton><Link className="pill" href={`/listing/${listing.id}`}>Preview offer</Link></div></div>}
