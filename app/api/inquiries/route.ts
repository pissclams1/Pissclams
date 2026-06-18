import { NextResponse } from "next/server";
import { gapStayHeaders, gapStayRest } from "../../../lib/gapstay-server";

export async function POST(request: Request) {
  const inquiry = await request.json().catch(() => null);
  if (!inquiry?.listingId || !inquiry?.name || !inquiry?.email) return NextResponse.json({ ok: false, message: "Missing inquiry details." }, { status: 400 });
  const response = await fetch(gapStayRest("gapstay_inquiries"), {
    method: "POST",
    headers: gapStayHeaders(undefined, "return=representation"),
    body: JSON.stringify({ id: inquiry.id, listing_id: inquiry.listingId, name: inquiry.name, email: inquiry.email, phone: inquiry.phone || null, reason: inquiry.reason || null, message: inquiry.message || null, created_at: inquiry.createdAt, request_state: "new" })
  });
  const data = await response.json().catch(() => null);
  if (!response.ok) return NextResponse.json({ ok: false, message: "This offer is not accepting inquiries yet.", error: data }, { status: response.status });
  return NextResponse.json({ ok: true, inquiry: data?.[0] || null });
}
