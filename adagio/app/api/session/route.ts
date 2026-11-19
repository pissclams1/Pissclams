import { NextResponse } from "next/server";
import { db, isUuid } from "@/lib/supabase";

const GAP_MS = 30 * 60_000;

// Reuses the latest session if the visitor's last activity is < 30 min old.
export async function POST(req: Request) {
  const { visitor_id } = await req.json().catch(() => ({}));
  if (!isUuid(visitor_id)) return NextResponse.json({ error: "bad visitor_id" }, { status: 400 });
  const c = db();
  const { data: v } = await c.from("visitors").select("id").eq("id", visitor_id).maybeSingle();
  if (!v) return NextResponse.json({ error: "unknown visitor" }, { status: 404 });

  const { data: last } = await c.from("events").select("session_id, created_at").eq("visitor_id", visitor_id)
    .order("created_at", { ascending: false }).limit(1).maybeSingle();
  if (last && Date.now() - new Date(last.created_at).getTime() < GAP_MS)
    return NextResponse.json({ session_id: last.session_id });

  const { data, error } = await c.from("sessions").insert({ visitor_id }).select("id").single();
  if (error) return NextResponse.json({ error: "failed" }, { status: 500 });
  return NextResponse.json({ session_id: data.id });
}
