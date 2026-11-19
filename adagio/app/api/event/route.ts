import { NextResponse } from "next/server";
import { db, isUuid, rateLimited } from "@/lib/supabase";

const ACTIONS = new Set(["like", "pass", "save", "share", "details"]);

export async function POST(req: Request) {
  const b = await req.json().catch(() => ({}));
  if (![b.visitor_id, b.session_id, b.creation_id].every(isUuid) || !ACTIONS.has(b.action))
    return NextResponse.json({ error: "bad input" }, { status: 400 });
  if (await rateLimited(b.visitor_id)) return NextResponse.json({ error: "rate limited" }, { status: 429 });
  const dwell = Math.min(Math.max(Math.round(Number(b.dwell_ms) || 0), 0), 3_600_000);
  const { error } = await db().from("events").insert({
    visitor_id: b.visitor_id, session_id: b.session_id, creation_id: b.creation_id,
    action: b.action, dwell_ms: dwell,
  });
  if (error) return NextResponse.json({ error: "invalid ids" }, { status: 400 });
  return NextResponse.json({ ok: true });
}
