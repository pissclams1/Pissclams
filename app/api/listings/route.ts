import { NextResponse } from "next/server";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export async function GET() {
  if (!url || !key) return NextResponse.json({ ok: true, mode: "local", listings: [] });
  const res = await fetch(`${url}/rest/v1/gapstay_listings?select=*&order=created_at.desc`, { headers: headers() });
  const rows = await res.json();
  if (!res.ok) return NextResponse.json({ ok: false, error: rows }, { status: 500 });
  return NextResponse.json({ ok: true, listings: rows.map(fromRow) });
}

export async function POST(request: Request) {
  const listing = await request.json();
  if (!url || !key) return NextResponse.json({ ok: true, mode: "local" });
  const row = toRow(listing);
  const res = await fetch(`${url}/rest/v1/gapstay_listings`, { method: "POST", headers: { ...headers(), Prefer: "resolution=merge-duplicates" }, body: JSON.stringify(row) });
  const data = await safeJson(res);
  if (!res.ok) return NextResponse.json({ ok: false, error: data }, { status: 500 });
  return NextResponse.json({ ok: true });
}

function headers(){ return { apikey: key!, Authorization: `Bearer ${key}`, "Content-Type": "application/json" }; }
function safeJson(res: Response){ return res.text().then(t => t ? JSON.parse(t) : null).catch(() => null); }
function toRow(x:any){ return { id:x.id, title:x.title, city:x.city, state:x.state, property_type:x.propertyType, bedrooms:x.bedrooms, bathrooms:x.bathrooms, host_name:x.hostName, description:x.description, amenities:x.amenities||[], rules:x.rules||[], analysis:x.analysis||{}, owner_email:x.ownerEmail||null }; }
function fromRow(r:any){ return { id:r.id, title:r.title, city:r.city, state:r.state, propertyType:r.property_type, bedrooms:Number(r.bedrooms), bathrooms:Number(r.bathrooms), hostName:r.host_name, description:r.description, amenities:r.amenities||[], rules:r.rules||[], analysis:r.analysis, ownerEmail:r.owner_email, createdAt:r.created_at }; }
