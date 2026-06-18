import { NextResponse } from "next/server";
import { gapStayHeaders, gapStayRest } from "../../../lib/gapstay-server";

export async function POST(request: Request) {
  const { ownerToken } = await request.json().catch(() => ({ ownerToken: "" }));
  if (!ownerToken) return NextResponse.json({ ok: false, message: "Missing host access token." }, { status: 400 });
  const headers = gapStayHeaders(ownerToken);
  const [listingsResponse, inquiriesResponse] = await Promise.all([
    fetch(gapStayRest("gapstay_listings?select=*&order=created_at.desc"), { headers, cache: "no-store" }),
    fetch(gapStayRest("gapstay_inquiries?select=*&order=created_at.desc"), { headers, cache: "no-store" })
  ]);
  const [listings, inquiries] = await Promise.all([listingsResponse.json().catch(() => []), inquiriesResponse.json().catch(() => [])]);
  if (!listingsResponse.ok || !inquiriesResponse.ok) return NextResponse.json({ ok: false, message: "Could not load dashboard." }, { status: 500 });
  return NextResponse.json({ ok: true, listings, inquiries });
}
