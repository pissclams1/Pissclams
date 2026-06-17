"use client";
import { useEffect, useState } from "react";

export default function ReadinessPage(){
  const [data,setData]=useState<any>(null);
  useEffect(()=>{fetch("/api/health").then(r=>r.json()).then(setData).catch(err=>setData({ok:false,error:err.message}))},[]);
  return <main className="wrap section topspace"><p className="kicker">Readiness</p><h1 className="big">Temporary deploy checklist.</h1><p className="lead" style={{fontSize:18}}>Use this page on the Vercel preview URL before buying a domain. Green means the dependency is configured. Missing means the app will show demo or config errors for that flow.</p><div className="card pad" style={{marginTop:24}}>{!data?<p className="muted">Checking...</p>:<><h2>{data.ok?"Ready for live payment/auth testing":"Not fully configured"}</h2>{data.error?<p className="muted">{data.error}</p>:null}<div className="grid grid3" style={{marginTop:18}}>{data.checks?Object.entries(data.checks).map(([key,value])=><div className="metric" key={key}><b>{value?"OK":"Missing"}</b><p className="small">{key}</p></div>):null}</div>{data.missing?.length?<div className="metric" style={{marginTop:18}}><b>Missing required live settings</b><p className="small">{data.missing.join(", ")}</p></div>:null}</>}</div></main>
}
