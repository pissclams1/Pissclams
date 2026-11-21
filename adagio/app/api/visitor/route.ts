import { NextResponse } from "next/server";
import { db } from "@/lib/supabase";
import { allow } from "@/lib/ratelimit";

export async function POST(req: Request) {
  const ip = (req.headers.get("x-forwarded-for") ?? "unknown").split(",")[0].trim();
  if (!allow(`visitor:${ip}`, 20, 60_000)) return NextResponse.json({ error: "rate limited" }, { status: 429 });
  const body = await req.json().catch(() => ({}));
  const utm = typeof body.utm_source === "string" ? body.utm_source.slice(0, 100) : null;
  const { data, error } = await db().from("visitors").insert({ utm_source: utm }).select("id").single();
  if (error) return NextResponse.json({ error: "failed" }, { status: 500 });
  return NextResponse.json({ visitor_id: data.id });
}
