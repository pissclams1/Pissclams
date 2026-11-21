import { NextResponse } from "next/server";
import { db, isUuid } from "@/lib/supabase";
import { reuseSession } from "@/lib/session";

export async function POST(req: Request) {
  const { visitor_id } = await req.json().catch(() => ({}));
  if (!isUuid(visitor_id)) return NextResponse.json({ error: "bad visitor_id" }, { status: 400 });
  const c = db();
  const { data: v } = await c.from("visitors").select("id").eq("id", visitor_id).maybeSingle();
  if (!v) return NextResponse.json({ error: "unknown visitor" }, { status: 404 });

  const [s, e, i] = await Promise.all([
    c.from("sessions").select("id,started_at").eq("visitor_id", visitor_id).order("started_at", { ascending: false }).limit(1).maybeSingle(),
    c.from("events").select("created_at").eq("visitor_id", visitor_id).order("created_at", { ascending: false }).limit(1).maybeSingle(),
    c.from("impressions").select("created_at").eq("visitor_id", visitor_id).order("created_at", { ascending: false }).limit(1).maybeSingle(),
  ]);
  if (s.data) {
    const last = Math.max(...[s.data.started_at, e.data?.created_at, i.data?.created_at].filter(Boolean).map((t) => new Date(t as string).getTime()));
    if (reuseSession(last, Date.now())) return NextResponse.json({ session_id: s.data.id });
  }
  const { data, error } = await c.from("sessions").insert({ visitor_id }).select("id").single();
  if (error) return NextResponse.json({ error: "failed" }, { status: 500 });
  return NextResponse.json({ session_id: data.id });
}
