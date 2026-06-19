import { NextResponse } from "next/server";
import { buildCalendarPlan } from "../../../lib/calendar-plan";

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const sourceUrl = String(body.sourceUrl || body.url || "").trim();
  if (!sourceUrl) return NextResponse.json({ ok: false, message: "Missing listing URL." }, { status: 400 });

  const plan = buildCalendarPlan({
    sourceUrl,
    city: body.city,
    state: body.state,
    horizonDays: body.horizonDays ? Number(body.horizonDays) : 365
  });

  return NextResponse.json({ ok: true, plan });
}
