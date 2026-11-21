import { NextResponse } from "next/server";
import { computeMetrics } from "@/lib/metrics";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const secret = process.env.METRICS_SECRET;
  const given = req.headers.get("x-metrics-secret") ?? new URL(req.url).searchParams.get("secret");
  if (!secret || given !== secret) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  return NextResponse.json(await computeMetrics());
}
