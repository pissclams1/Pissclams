import { NextResponse } from "next/server";
import { evaluateMonitor } from "../../../../lib/monitoring";

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const sourceUrl = String(body.sourceUrl || "").trim();
  if (!sourceUrl) return NextResponse.json({ ok: false, message: "Missing listing URL." }, { status: 400 });

  const result = await evaluateMonitor({
    sourceUrl,
    title: body.title,
    city: body.city,
    state: body.state,
    propertyType: body.propertyType,
    bedrooms: body.bedrooms ? Number(body.bedrooms) : undefined,
    bathrooms: body.bathrooms ? Number(body.bathrooms) : undefined,
    nightlyRate: body.nightlyRate ? Number(body.nightlyRate) : undefined,
    cleaningFee: body.cleaningFee ? Number(body.cleaningFee) : undefined
  });

  return NextResponse.json(result, { status: result.ok ? 200 : 422 });
}
