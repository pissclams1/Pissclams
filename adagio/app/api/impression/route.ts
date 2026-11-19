import { NextResponse } from "next/server";
import { db, isUuid, rateLimited } from "@/lib/supabase";

export async function POST(req: Request) {
  const b = await req.json().catch(() => ({}));
  if (![b.visitor_id, b.session_id, b.creation_id].every(isUuid))
    return NextResponse.json({ error: "bad ids" }, { status: 400 });
  if (await rateLimited(b.visitor_id)) return NextResponse.json({ error: "rate limited" }, { status: 429 });
  // unique(visitor_id, creation_id): retries are idempotent; FKs validate that the ids exist
  const { error } = await db().from("impressions").upsert(
    { visitor_id: b.visitor_id, session_id: b.session_id, creation_id: b.creation_id },
    { onConflict: "visitor_id,creation_id", ignoreDuplicates: true });
  if (error) return NextResponse.json({ error: "invalid ids" }, { status: 400 });
  return NextResponse.json({ ok: true });
}
