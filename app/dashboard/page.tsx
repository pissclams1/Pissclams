"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { getInquiries, getListings, type Inquiry, type Listing } from "../../lib/store";
import { money, prettyDate } from "../../lib/pricing";

export default function DashboardPage(){
  const [listings,setListings]=useState<Listing[]>([]);
  const [inquiries,setInquiries]=useState<Inquiry[]>([]);
  useEffect(()=>{setListings(getListings());setInquiries(getInquiries())},[]);
  return <main className="wrap section topspace"><p className="kicker">Host dashboard</p><h1 className="big">Your gap offers and guest requests.</h1><p className="muted">This MVP uses browser storage so the product works immediately without auth or a database.</p>
    <section className="section" style={{paddingTop:28}}><div className="heroCardTop"><h2>Listings</h2><Link className="darkpill" href="/host">Analyze another gap</Link></div><div className="grid" style={{marginTop:16}}>{listings.map(l=><div className="card pad" key={l.id}><div className="heroCardTop"><div><h3>{l.title}</h3><p className="muted">{l.city}, {l.state} · {prettyDate(l.analysis.startDate)} - {prettyDate(l.analysis.endDate)}</p></div><div style={{textAlign:"right"}}><b style={{fontSize:28}}>{money(l.analysis.recommendedTotal)}</b><p className="small">{money(l.analysis.monthlyEquivalent)}/mo equivalent</p></div></div><div className="actions"><Link className="pill" href={`/listing/${l.id}`}>Open public page</Link></div></div>)}</div></section>
    <section><h2>Requests</h2>{inquiries.length===0?<div className="card pad"><p className="muted">No guest requests yet. Submit the sample listing form to see this populate.</p></div>:<table className="table card"><thead><tr><th>Name</th><th>Email</th><th>Stay type</th><th>Message</th></tr></thead><tbody>{inquiries.map(i=><tr key={i.id}><td>{i.name}</td><td>{i.email}</td><td>{i.reason}</td><td>{i.message}</td></tr>)}</tbody></table>}</section>
  </main>
}
