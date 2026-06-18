"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { getInquiriesRemote, getListingsRemote, type Inquiry, type Listing } from "../../lib/store";
import { money, prettyDate } from "../../lib/pricing";

export default function DashboardPage(){
  const [listings,setListings]=useState<Listing[]>([]);
  const [inquiries,setInquiries]=useState<Inquiry[]>([]);
  const [error,setError]=useState("");
  useEffect(()=>{let alive=true; async function load(){try{const [l,i]=await Promise.all([getListingsRemote(),getInquiriesRemote()]); if(alive){setListings(l);setInquiries(i)}}catch(error){if(alive)setError(error instanceof Error?error.message:"Could not load dashboard.")}} load(); return()=>{alive=false}},[]);
  return <main className="wrap section topspace"><p className="kicker">Host dashboard</p><h1 className="big">Your GapStay dashboard</h1><p className="muted">Everything you have analyzed, published, and heard back on — in one place.</p>
    {error?<div className="errorBox">{error}</div>:null}<section className="section" style={{paddingTop:28}}><div className="heroCardTop"><h2>Furnished-stay offers</h2><Link className="darkpill" href="/host">Analyze a gap</Link></div>{listings.length===0?<div className="card pad" style={{marginTop:16}}><h3>No offers yet.</h3><p className="muted">Import a listing and analyze an open calendar window.</p><Link className="darkpill" href="/host">Analyze a gap</Link></div>:<div className="grid" style={{marginTop:16}}>{listings.map(l=><div className="card pad" key={l.id}><div className="heroCardTop"><div><p className="kicker">{publicationLabel(l)}</p><h3>{l.title}</h3><p className="muted">{l.city}, {l.state} · {prettyDate(l.analysis.startDate)} - {prettyDate(l.analysis.endDate)}</p></div><div style={{textAlign:"right"}}><b style={{fontSize:28}}>{money(l.analysis.recommendedTotal)}</b><p className="small">{money(l.analysis.monthlyEquivalent)}/mo</p></div></div><div className="actions"><Link className="pill" href={`/listing/${l.id}`}>Open offer</Link></div></div>)}</div>}</section>
    <section><h2>Inquiries</h2>{inquiries.length===0?<div className="card pad"><p className="muted">No inquiries yet. Published offers collect renter requests here.</p></div>:<div className="grid">{inquiries.map(inquiry=><InquiryCard key={inquiry.id} inquiry={inquiry}/>)}</div>}</section>
  </main>
}

function publicationLabel(listing:Listing){
  if(listing.publishStatus!=="published") return "Preview";
  if(!listing.paidUntil) return "Published";
  const days=Math.max(0,Math.ceil((new Date(listing.paidUntil).getTime()-Date.now())/86400000));
  return `Published · ${days} ${days===1?"day":"days"} remaining`;
}

function InquiryCard({inquiry}:{inquiry:Inquiry}){
  const subject=encodeURIComponent("Your furnished-stay inquiry");
  const body=encodeURIComponent(`Hi ${inquiry.name},\n\nThanks for your inquiry. I’d be happy to discuss the furnished stay and your dates.\n\n`);
  return <article className="card pad"><div className="heroCardTop"><div><p className="kicker">{inquiry.reason||"New inquiry"}</p><h3>{inquiry.name}</h3><p className="small">Received {new Date(inquiry.createdAt).toLocaleDateString()}</p></div><div className="actions"><a className="darkpill" href={`mailto:${inquiry.email}?subject=${subject}&body=${body}`}>Reply by email</a>{inquiry.phone?<a className="pill" href={`tel:${inquiry.phone}`}>Call {inquiry.phone}</a>:null}</div></div><p className="muted">{inquiry.message}</p><a className="manualLink" href={`mailto:${inquiry.email}`}>{inquiry.email}</a></article>;
}
