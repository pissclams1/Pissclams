"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { getInquiriesRemote, getListingsRemote, type Inquiry, type Listing } from "../../lib/store";
import { money, prettyDate } from "../../lib/pricing";

export default function DashboardPage(){
  const [listings,setListings]=useState<Listing[]>([]);
  const [inquiries,setInquiries]=useState<Inquiry[]>([]);
  useEffect(()=>{let alive=true; async function load(){const [l,i]=await Promise.all([getListingsRemote(),getInquiriesRemote()]); if(alive){setListings(l);setInquiries(i)}} load(); return()=>{alive=false}},[]);
  return <main className="wrap section topspace"><p className="kicker">Host dashboard</p><h1 className="big">Gap pages, guest requests, and publish requests.</h1><p className="muted">Listings and requests are saved to shared storage so generated pages can be opened outside the original browser.</p>
    <section className="section" style={{paddingTop:28}}><div className="heroCardTop"><h2>Gap pages</h2><Link className="darkpill" href="/host">Check another gap</Link></div><div className="grid" style={{marginTop:16}}>{listings.map(l=><div className="card pad" key={l.id}><div className="heroCardTop"><div><h3>{l.title}</h3><p className="muted">{l.city}, {l.state} · {prettyDate(l.analysis.startDate)} - {prettyDate(l.analysis.endDate)}</p></div><div style={{textAlign:"right"}}><b style={{fontSize:28}}>{money(l.analysis.recommendedTotal)}</b><p className="small">{money(l.analysis.monthlyEquivalent)}/mo equivalent</p></div></div><div className="actions"><Link className="pill" href={`/listing/${l.id}`}>Open page</Link></div></div>)}</div></section>
    <section><h2>Requests</h2>{inquiries.length===0?<div className="card pad"><p className="muted">No requests yet. Generate a gap page, open it, and submit either a renter inquiry or publish request.</p></div>:<table className="table card"><thead><tr><th>Name</th><th>Email</th><th>Type</th><th>Message</th></tr></thead><tbody>{inquiries.map(i=><tr key={i.id}><td>{i.name}</td><td>{i.email}</td><td>{i.reason}</td><td>{i.message}</td></tr>)}</tbody></table>}</section>
  </main>
}