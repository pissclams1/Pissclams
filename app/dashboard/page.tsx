"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { getInquiriesRemote, getListingsRemote, type Inquiry, type Listing } from "../../lib/store";
import { money, prettyDate } from "../../lib/pricing";
import { getSupabaseBrowserClient } from "../../lib/supabase";

export default function DashboardPage(){
  const [listings,setListings]=useState<Listing[]>([]);
  const [inquiries,setInquiries]=useState<Inquiry[]>([]);
  const [error,setError]=useState("");
  const [userEmail,setUserEmail]=useState<string|null>(null);const [checkingAuth,setCheckingAuth]=useState(true);
  useEffect(()=>{let alive=true;const client=getSupabaseBrowserClient();async function load(){const {data}=client?await client.auth.getSession():{data:{session:null}};if(!alive)return;if(!data.session){setCheckingAuth(false);return}setUserEmail(data.session.user.email||"");try{const [l,i]=await Promise.all([getListingsRemote(),getInquiriesRemote()]);if(alive){setListings(l);setInquiries(i)}}catch(error){if(alive)setError(error instanceof Error?error.message:"Could not load dashboard.")}finally{if(alive)setCheckingAuth(false)}}void load();return()=>{alive=false}},[]);
  if(checkingAuth)return <main className="wrap section topspace"><div className="card pad"><p className="muted">Loading your dashboard…</p></div></main>;
  if(!userEmail)return <main className="wrap section topspace"><div className="card pad authCard"><p className="kicker">Host account</p><h1 className="big">Sign in to open your Calendar CFO dashboard.</h1><p className="muted">Build a calendar plan without signing in. Sign in when you want to save plans, manage monitored properties, receive alerts, and track furnished-stay inquiries.</p><div className="actions"><Link className="darkpill" href="/auth?next=/dashboard">Sign in</Link><Link className="pill" href="/host">Build calendar plan</Link></div></div></main>;
  return <main className="wrap section topspace"><p className="kicker">Host dashboard</p><h1 className="big">Your Calendar CFO dashboard</h1><p className="muted">Saved calendar plans, monitored properties, furnished-stay offers, alerts, and renter inquiries — in one place.</p>
    <div className="actions"><span className="small">Signed in as {userEmail}</span><button className="manualLink buttonLink" onClick={async()=>{await getSupabaseBrowserClient()?.auth.signOut();location.reload()}}>Sign out</button></div>
    {error?<div className="errorBox">{error}</div>:null}<section className="section" style={{paddingTop:28}}><div className="heroCardTop"><h2>Calendar plans and furnished-stay offers</h2><Link className="darkpill" href="/host">Build calendar plan</Link></div>{listings.length===0?<div className="card pad" style={{marginTop:16}}><h3>No calendar plans yet.</h3><p className="muted">Paste your Airbnb or VRBO listing URL to generate an AIRBNB / WATCH / FURNISHED calendar plan.</p><Link className="darkpill" href="/host">Build calendar plan</Link></div>:<div className="grid" style={{marginTop:16}}>{listings.map(l=><div className="card pad" key={l.id}><div className="heroCardTop"><div><p className="kicker">{publicationLabel(l)}</p><h3>{l.title}</h3><p className="muted">{l.city}, {l.state} · {prettyDate(l.analysis.startDate)} - {prettyDate(l.analysis.endDate)}</p></div><div style={{textAlign:"right"}}><b style={{fontSize:28}}>{money(l.analysis.recommendedTotal)}</b><p className="small">Furnished offer · {money(l.analysis.monthlyEquivalent)}/mo</p></div></div><div className="actions"><Link className="pill" href={`/listing/${l.id}`}>Open offer</Link></div></div>)}</div>}</section>
    <section><h2>Renter inquiries</h2>{inquiries.length===0?<div className="card pad"><p className="muted">No inquiries yet. Published furnished-stay offers collect renter requests here.</p></div>:<div className="grid">{inquiries.map(inquiry=><InquiryCard key={inquiry.id} inquiry={inquiry}/>)}</div>}</section>
  </main>
}

function publicationLabel(listing:Listing){
  if(listing.publishStatus!=="published") return "Plan preview";
  if(!listing.paidUntil) return "Published furnished-stay offer";
  const days=Math.max(0,Math.ceil((new Date(listing.paidUntil).getTime()-Date.now())/86400000));
  return `Published offer · ${days} ${days===1?"day":"days"} remaining`;
}

function InquiryCard({inquiry}:{inquiry:Inquiry}){
  const subject=encodeURIComponent("Your furnished-stay inquiry");
  const body=encodeURIComponent(`Hi ${inquiry.name},\n\nThanks for your inquiry. I’d be happy to discuss the furnished stay and your dates.\n\n`);
  return <article className="card pad"><div className="heroCardTop"><div><p className="kicker">{inquiry.reason||"New inquiry"}</p><h3>{inquiry.name}</h3><p className="small">Received {new Date(inquiry.createdAt).toLocaleDateString()}</p></div><div className="actions"><a className="darkpill" href={`mailto:${inquiry.email}?subject=${subject}&body=${body}`}>Reply by email</a>{inquiry.phone?<a className="pill" href={`tel:${inquiry.phone}`}>Call {inquiry.phone}</a>:null}</div></div><p className="muted">{inquiry.message}</p><a className="manualLink" href={`mailto:${inquiry.email}`}>{inquiry.email}</a></article>;
}