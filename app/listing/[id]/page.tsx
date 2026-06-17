"use client";
import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { money, prettyDate } from "../../../lib/pricing";
import { getListing, saveInquiry, sampleListing, type Listing } from "../../../lib/store";

export default function ListingPage({params}:{params:{id:string}}){
  const [listing,setListing]=useState<Listing|undefined>();
  const [sent,setSent]=useState(false);
  useEffect(()=>{setListing(getListing(params.id)||sampleListing)},[params.id]);
  if(!listing) return null;
  const a=listing.analysis;
  function submit(e:FormEvent<HTMLFormElement>){e.preventDefault(); const data=new FormData(e.currentTarget); saveInquiry({id:`inq-${Date.now().toString(36)}`,listingId:listing!.id,name:String(data.get("name")||""),email:String(data.get("email")||""),phone:String(data.get("phone")||""),reason:String(data.get("reason")||""),message:String(data.get("message")||""),createdAt:new Date().toISOString()}); setSent(true); e.currentTarget.reset()}
  return <main className="wrap section topspace"><div className="grid grid2">
    <section><p className="kicker">Available furnished stay</p><h1 className="big">{listing.title}</h1><p className="lead" style={{fontSize:18}}>{listing.city}, {listing.state} · {listing.propertyType} · {listing.bedrooms} bed · {listing.bathrooms} bath</p><div className="card pad" style={{marginTop:22}}><p className="muted">{listing.description}</p><h3>Amenities</h3><div className="grid grid3">{listing.amenities.map(x=><div className="metric" key={x}>{x}</div>)}</div><h3>House rules</h3><ul className="list">{listing.rules.map(x=><li key={x}>{x}</li>)}</ul></div></section>
    <aside className="card pad" style={{alignSelf:"start",position:"sticky",top:96}}><p className="kicker">All-in offer</p><div className="price">{money(a.recommendedTotal)}</div><p className="muted">{prettyDate(a.startDate)} - {prettyDate(a.endDate)} · {a.nights} nights</p><div className="result" style={{marginTop:18}}><div className="stat"><span>Monthly equivalent</span><strong>{money(a.monthlyEquivalent)}</strong></div><div className="stat"><span>Nightly basis</span><strong>{money(a.recommendedNightly)}</strong></div></div>{sent?<div className="metric" style={{marginTop:18}}><b>Request saved</b><p className="small">It is saved in the host dashboard for this MVP.</p></div>:<form onSubmit={submit} className="grid" style={{marginTop:20}}><Field name="name" label="Name"/><Field name="email" label="Email" type="email"/><Field name="phone" label="Phone"/><label><span className="label">Stay type</span><select className="input" name="reason"><option>Relocation</option><option>Insurance displacement</option><option>Remote work</option><option>Between homes</option><option>Medical or family care</option></select></label><label><span className="label">Message</span><textarea className="input textarea" name="message" placeholder="Tell the host what you need."/></label><button className="darkpill" type="submit">Request this stay</button></form>}<div className="actions"><Link className="pill" href="/host">Analyze another gap</Link></div></aside>
  </div></main>
}
function Field({label,name,type="text"}:{label:string;name:string;type?:string}){return <label><span className="label">{label}</span><input className="input" name={name} type={type} required/></label>}
