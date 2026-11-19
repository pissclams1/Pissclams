import { NextResponse } from "next/server";
import { db } from "@/lib/supabase";

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const utm = typeof body.utm_source === "string" ? body.utm_source.slice(0, 100) : null;
  const { data, error } = await db().from("visitors").insert({ utm_source: utm }).select("id").single();
  if (error) return NextResponse.json({ error: "failed" }, { status: 500 });
  return NextResponse.json({ visitor_id: data.id });
}
