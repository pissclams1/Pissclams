"use client";
import { FormEvent, Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getSupabaseBrowserClient } from "../../lib/supabase";
import { getOwnerToken, setOwnerToken } from "../../lib/store";

export default function AuthPage(){return <Suspense fallback={<main className="wrap section topspace"><div className="card pad">Loading account…</div></main>}><AuthForm/></Suspense>}

function AuthForm(){
  const router=useRouter();const params=useSearchParams();const client=getSupabaseBrowserClient();
  const [email,setEmail]=useState(params.get("email")||"");const [password,setPassword]=useState("");const [mode,setMode]=useState<"signin"|"signup">("signin");const [message,setMessage]=useState("");const [loading,setLoading]=useState(false);
  const next=params.get("next")||"/dashboard";
  useEffect(()=>{client?.auth.getSession().then(({data})=>{if(data.session) router.replace(next)})},[client,next,router]);
  async function submit(event:FormEvent){event.preventDefault();if(!client)return;setLoading(true);setMessage("");
    const result=mode==="signup"?await client.auth.signUp({email,password,options:{data:{owner_token:getOwnerToken()}}}):await client.auth.signInWithPassword({email,password});
    if(result.error){setMessage(result.error.message);setLoading(false);return}
    const token=result.data.user?.user_metadata?.owner_token;if(typeof token==="string")setOwnerToken(token);
    if(result.data.session)router.replace(next);else setMessage("Check your email to confirm your account, then sign in.");setLoading(false);
  }
  return <main className="wrap section topspace"><div className="card pad authCard"><p className="kicker">Host account</p><h1 className="big">{mode==="signin"?"Sign in to your dashboard":"Create your host account"}</h1><p className="muted">Free analysis stays open to everyone. An account keeps your dashboard and published offers connected.</p><form className="grid" onSubmit={submit}><label><span className="label">Email</span><input className="input" type="email" value={email} onChange={event=>setEmail(event.target.value)} required/></label><label><span className="label">Password</span><input className="input" type="password" minLength={8} value={password} onChange={event=>setPassword(event.target.value)} required/></label>{message?<div className={message.startsWith("Check")?"successBox":"errorBox"}>{message}</div>:null}<button className="darkpill" disabled={loading}>{loading?"Please wait…":mode==="signin"?"Sign in":"Create account"}</button></form><button className="manualLink buttonLink" onClick={()=>setMode(mode==="signin"?"signup":"signin")}>{mode==="signin"?"New to GapStay? Create an account":"Already have an account? Sign in"}</button></div></main>;
}
