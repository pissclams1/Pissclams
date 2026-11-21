import { NextResponse } from "next/server";
import { db, isUuid, rateLimited, sessionBelongsToVisitor } from "@/lib/supabase";

export async function POST(req: Request) {
  const b = await req.json().catch(() => ({}));
  if (![b.visitor_id, b.session_id, b.creation_id].every(isUuid)) return NextResponse.json({ error: "bad ids" }, { status: 400 });
  if (!(await sessionBelongsToVisitor(b.session_id, b.visitor_id))) return NextResponse.json({ error: "unknown session" }, { status: 404 });
  if (await rateLimited(b.visitor_id)) return NextResponse.json({ error: "rate limited" }, { status: 429 });
  // unique(visitor_id, creation_id): retries are idempotent; the FK rejects unknown creations
  const { error } = await db().from("impressions").upsert(
    { visitor_id: b.visitor_id, session_id: b.session_id, creation_id: b.creation_id },
    { onConflict: "visitor_id,creation_id", ignoreDuplicates: true });
  if (error) return NextResponse.json({ error: "unknown creation" }, { status: 404 });
  return NextResponse.json({ ok: true });
}
