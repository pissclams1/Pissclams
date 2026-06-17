"use client";
import { useState } from "react";

const plans = [
  ["publish_gap", "$19 gap page"],
  ["host_monthly", "$49 one property"],
  ["portfolio_monthly", "$99 portfolio"]
];

export default function PaymentTestPage(){
  const [email,setEmail]=useState("test@example.com");
  const [plan,setPlan]=useState("publish_gap");
  const [result,setResult]=useState<string>("");
  async function start(){
    setResult("Testing payment route...");
    const res = await fetch("/api/start-payment", { method:"POST", headers:{"Content-Type":"application/json"}, body: JSON.stringify({ plan, email, listingId:"sample" }) });
    const data = await res.json().catch(()=>({}));
    if(data.url){ window.location.href = data.url; return; }
    setResult(JSON.stringify(data, null, 2));
  }
  return <main className="wrap section topspace"><div className="card pad"><p className="kicker">Payment test</p><h1 className="big">Verify Stripe before buying a domain.</h1><p className="muted">This page attempts to create a checkout session. If Stripe keys or price IDs are missing, it shows a config error instead of pretending payment works.</p><div className="grid grid2" style={{marginTop:20}}><label><span className="label">Email</span><input className="input" value={email} onChange={e=>setEmail(e.target.value)}/></label><label><span className="label">Plan</span><select className="input" value={plan} onChange={e=>setPlan(e.target.value)}>{plans.map(([value,label])=><option value={value} key={value}>{label}</option>)}</select></label></div><button className="darkpill" style={{marginTop:18}} onClick={start}>Create checkout session</button>{result?<pre className="metric" style={{whiteSpace:"pre-wrap",marginTop:18}}>{result}</pre>:null}</div></main>
}
