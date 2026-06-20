import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const headers = request.headers;
  const city = headers.get("x-vercel-ip-city") || "";
  const region = headers.get("x-vercel-ip-country-region") || "";
  const country = headers.get("x-vercel-ip-country") || "";
  return NextResponse.json({ ok: true, city: decodeURIComponent(city), region, country });
}
