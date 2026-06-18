"use client";
import { FormEvent, useState } from "react";
import { getSupabaseBrowserClient } from "../lib/supabase";

export default function WaitlistForm({ source = "site" }: { source?: string }) {
  const [email, setEmail] = useState("");
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  async function submit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    const row = { id: `wl-${Date.now().toString(36)}`, email, source };
    const supabase = getSupabaseBrowserClient();
    if (supabase) {
      const { error } = await supabase.from("gapstay_waitlist").insert(row);
      if (error) console.error(error.message);
    } else if (typeof window !== "undefined") {
      const existing = JSON.parse(localStorage.getItem("gapstay:waitlist") || "[]");
      localStorage.setItem("gapstay:waitlist", JSON.stringify([row, ...existing]));
    }
    setSaved(true);
    setSaving(false);
    setEmail("");
  }

  if (saved) return <div className="metric"><b>You are on the list.</b><p className="small">We will send product updates when gap recovery tools improve.</p></div>;

  return <form onSubmit={submit} className="card pad grid" style={{marginTop:20}}>
    <div>
      <h3 style={{marginTop:0}}>Get gap-recovery updates</h3>
      <p className="muted">Get notified when GapStay adds better calendar watch, renewal, and direct-inquiry tools.</p>
    </div>
    <div className="grid grid2">
      <input className="input" type="email" placeholder="you@example.com" value={email} onChange={e=>setEmail(e.target.value)} required />
      <button className="darkpill" type="submit" disabled={saving}>{saving ? "Saving..." : "Notify me"}</button>
    </div>
  </form>;
}
