import { NextResponse } from "next/server";
import { gapStayHeaders, gapStayRest, ownerTokenHash } from "../../../lib/gapstay-server";
import type { Listing } from "../../../lib/store";

type ListingRow = { id:string; title:string; city:string; state:string; property_type:string; bedrooms:number; bathrooms:number; host_name:string; description:string; amenities:string[]; rules:string[]; analysis:Listing["analysis"]; source_url?:string|null; image_url?:string|null; rating?:string|null; reviews?:string|null; guest_count?:string|null; nightly_rate?:string|null; publish_status?:string|null };

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const id = requestUrl.searchParams.get("id");
  const ownerToken = request.headers.get("x-gapstay-owner-token") || undefined;
  const query = id ? `gapstay_listings?select=*&id=eq.${encodeURIComponent(id)}&limit=1` : "gapstay_listings?select=*&order=created_at.desc";
  const res = await fetch(gapStayRest(query), { headers: gapStayHeaders(ownerToken), cache: "no-store" });
  const rows = await res.json();
  if (!res.ok) return NextResponse.json({ ok: false, error: rows }, { status: 500 });
  return NextResponse.json({ ok: true, ...(id ? { listing: rows[0] ? fromRow(rows[0]) : null } : { listings: rows.map(fromRow) }) });
}

export async function POST(request: Request) {
  const { listing, ownerEmail, ownerToken } = await request.json().catch(() => ({}));
  if (!listing || !ownerToken) return NextResponse.json({ ok: false, message: "Missing listing or host access token." }, { status: 400 });
  const row = toRow(listing, ownerEmail, ownerTokenHash(ownerToken));
  const res = await fetch(gapStayRest("gapstay_listings?on_conflict=id"), { method: "POST", headers: gapStayHeaders(ownerToken, "resolution=merge-duplicates,return=representation"), body: JSON.stringify(row) });
  const data = await safeJson(res);
  if (!res.ok) return NextResponse.json({ ok: false, error: data }, { status: 500 });
  return NextResponse.json({ ok: true, listing: fromRow(data?.[0] || row) });
}

function safeJson(res: Response){ return res.text().then(t => t ? JSON.parse(t) : null).catch(() => null); }
function toRow(listing:Listing,ownerEmail?:string,tokenHash?:string){ return { id:listing.id, title:listing.title, city:listing.city, state:listing.state, property_type:listing.propertyType, bedrooms:listing.bedrooms, bathrooms:listing.bathrooms, host_name:listing.hostName, description:listing.description, amenities:listing.amenities||[], rules:listing.rules||[], analysis:listing.analysis, owner_email:ownerEmail||null, owner_token_hash:tokenHash, publish_status:"preview", source_url:listing.sourceUrl||null, image_url:listing.imageUrl||null, rating:listing.rating||null, reviews:listing.reviews||null, guest_count:listing.guestCount||null, nightly_rate:listing.nightlyRate||null }; }
function fromRow(row:ListingRow){ return { id:row.id, title:row.title, city:row.city, state:row.state, propertyType:row.property_type, bedrooms:Number(row.bedrooms), bathrooms:Number(row.bathrooms), hostName:row.host_name, description:row.description, amenities:row.amenities||[], rules:row.rules||[], analysis:row.analysis, sourceUrl:row.source_url||undefined, imageUrl:row.image_url||undefined, rating:row.rating||undefined, reviews:row.reviews||undefined, guestCount:row.guest_count||undefined, nightlyRate:row.nightly_rate||undefined, publishStatus:row.publish_status||"preview" }; }
