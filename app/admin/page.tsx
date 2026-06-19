"use client";
import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { getSupabaseBrowserClient } from "../../lib/supabase";

type Payment={id:string;amount:number;currency:string;status:string;email:string;created:number};
type Subscription={id:string;status:string;customer:string;created:number};
type Promotion={id:string;code:string;active:boolean;created:number};
type AdminData={email:string;payments:Payment[];subscriptions:Subscription[];promotions:Promotion[]};

export default function AdminPage(){
  const [data,setData]=useState<AdminData|null>(null);const [message,setMessage]=useState("");const [error,setError]=useState("");const [loading,setLoading]=useState(true);
  async function token(){const client=getSupabaseBrowserClient();const {data}=client?await client.auth.getSession():{data:{session:null}};return data.session?.access_token||""}
  async function load(){setLoading(true);setError("");const accessToken=await token();if(!accessToken){setLoading(false);return}const response=await fetch("/api/admin",{headers:{Authorization:`Bearer ${accessToken}`},cache:"no-store"});const body=await response.json();if(!response.ok)setError(body.message||"Could not load admin tools.");else setData(body);setLoading(false)}
  useEffect(()=>{void load()},[]);
  async function act(action:string,payload:Record<string,unknown>){setMessage("");setError("");const accessToken=await token();const response=await fetch("/api/admin",{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${accessToken}`},body:JSON.stringify({action,...payload})});const body=await response.json();if(!response.ok)setError(body.message||"Action failed.");else{setMessage(body.message);await load()}}
  async function createPromo(event:FormEvent<HTMLFormElement>){event.preventDefault();const form=new FormData(event.currentTarget);await act("create_promo",{code:form.get("code"),percentOff:form.get("percentOff")});event.currentTarget.reset()}
  if(loading)return <main className="wrap section topspace"><div className="card pad">Loading admin tools…</div></main>;
  if(!data)return <main className="wrap section topspace"><div className="card pad authCard"><p className="kicker">Admin</p><h1 className="big">Restricted operations</h1><p className="muted">Sign in with the allowlisted administrator email to continue.</p>{error?<div className="errorBox">{error}</div>:null}<Link className="darkpill" href="/auth?next=/admin">Admin sign in</Link></div></main>;
  return <main className="wrap section topspace"><p className="kicker">Admin</p><h1 className="big">GapStay operations</h1><p className="muted">Signed in as {data.email}. This account can publish offers without checkout.</p>{message?<div className="successBox">{message}</div>:null}{error?<div className="errorBox">{error}</div>:null}
    <section className="adminSection"><h2>Recent payments</h2><div className="grid">{data.payments.map(payment=><article className="card pad" key={payment.id}><div className="heroCardTop"><div><strong>{(payment.amount/100).toLocaleString(undefined,{style:"currency",currency:payment.currency.toUpperCase()})}</strong><p className="small">{payment.id} · {payment.status}</p></div>{payment.status==="succeeded"?<button className="pill" onClick={()=>{if(confirm(`Refund ${payment.id}?`))void act("refund",{paymentIntentId:payment.id})}}>Refund</button>:null}</div></article>)}</div></section>
    <section className="adminSection"><h2>Subscriptions</h2><div className="grid">{data.subscriptions.map(subscription=><article className="card pad" key={subscription.id}><div className="heroCardTop"><div><strong>{subscription.customer}</strong><p className="small">{subscription.id} · {subscription.status}</p></div>{!["canceled","incomplete_expired"].includes(subscription.status)?<button className="pill" onClick={()=>{if(confirm(`Cancel ${subscription.id}?`))void act("cancel_subscription",{subscriptionId:subscription.id})}}>Cancel</button>:null}</div></article>)}</div></section>
    <section className="adminSection"><h2>Create a promo code</h2><form className="card pad grid grid3" onSubmit={createPromo}><label><span className="label">Code</span><input className="input" name="code" placeholder="EARLYHOST" required/></label><label><span className="label">Percent off</span><input className="input" name="percentOff" type="number" min="1" max="100" required/></label><button className="darkpill">Create one-time promo</button></form><div className="actions">{data.promotions.map(promotion=><span className="pill" key={promotion.id}>{promotion.code}</span>)}</div></section>
  </main>;
}
