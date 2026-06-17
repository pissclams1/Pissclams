"use client";
import { FormEvent, useState } from "react";
import Link from "next/link";
import { getSupabaseBrowserClient, hasSupabaseConfig } from "../../lib/supabase";

export default function AuthPage(){
  const [email,setEmail]=useState("");
  const [status,setStatus]=useState<string|null>(null);
  const [error,setError]=useState<string|null>(null);
  async function submit(e:FormEvent<HTMLFormElement>){
    e.preventDefault();
    setError(null);
    if(!hasSupabaseConfig()) { setStatus("Demo mode: Supabase environment variables are not configured on this deploy yet. The auth screen is ready once env vars are added."); return; }
    const supabase=getSupabaseBrowserClient();
    if(!supabase) return;
    const origin=window.location.origin;
    const result = await supabase.auth.signInWithOtp({ email, options: { emailRedirectTo: `${origin}/dashboard` } });
    if(result.error) setError(result.error.message); else setStatus("Check your email for the GapStay sign in link.");
  }
  return <main className="wrap section topspace"><div className="grid grid2"><section><p className="kicker">Host access</p><h1 className="big">Create a host account before the guest changes their mind.</h1><p className="lead" style={{fontSize:18}}>GapStay uses passwordless email auth. Hosts can analyze first, then sign in to save listings, publish recovery pages, and track requests.</p><div className="card pad" style={{marginTop:24}}><h2>What auth unlocks</h2><ul className="list"><li>Saved properties and listings.</li><li>Reusable public gap pages.</li><li>Host dashboard and request history.</li><li>Payment gated publishing when payment keys are enabled.</li></ul></div></section><section className="card pad" style={{alignSelf:"start"}}>{status?<div><p className="kicker">Auth status</p><h2>{status}</h2>{error?<p className="muted">{error}</p>:null}<Link className="darkpill" href="/host">Continue to analyzer</Link></div>:<form onSubmit={submit} className="grid"><label><span className="label">Email</span><input className="input" type="email" value={email} onChange={e=>setEmail(e.target.value)} required/></label><button className="darkpill" type="submit">Send sign in link</button><p className="small">No password to remember. Sign in by email, then publish or manage gap pages.</p></form>}</section></div></main>
}
