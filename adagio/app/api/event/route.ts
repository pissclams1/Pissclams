import { NextResponse } from "next/server";
import { db, isUuid, rateLimited, sessionBelongsToVisitor } from "@/lib/supabase";

const ACTIONS = new Set(["next", "love", "save", "share", "details"]);

export async function POST(req: Request) {
  const b = await req.json().catch(() => ({}));
  if (![b.visitor_id, b.session_id, b.creation_id].every(isUuid) || !ACTIONS.has(b.action))
    return NextResponse.json({ error: "bad input" }, { status: 400 });
  if (!(await sessionBelongsToVisitor(b.session_id, b.visitor_id))) return NextResponse.json({ error: "unknown session" }, { status: 404 });
  if (await rateLimited(b.visitor_id)) return NextResponse.json({ error: "rate limited" }, { status: 429 });
  const dwell = Math.min(Math.max(Math.round(Number(b.dwell_ms) || 0), 0), 3_600_000);
  const { error } = await db().from("events").insert({
    visitor_id: b.visitor_id, session_id: b.session_id, creation_id: b.creation_id, action: b.action, dwell_ms: dwell,
  });
  if (error?.code === "23505") return NextResponse.json({ ok: true, duplicate: true }); // second love on the same card: no-op
  if (error) return NextResponse.json({ error: "unknown creation" }, { status: 404 });
  return NextResponse.json({ ok: true });
}
