import { NextResponse } from "next/server";

function textBetween(html: string, pattern: RegExp) {
  const match = html.match(pattern);
  return match?.[1]?.replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#x27;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">").trim() || "";
}

function meta(html: string, property: string) {
  const escaped = property.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return textBetween(html, new RegExp(`<meta[^>]+(?:property|name)=["']${escaped}["'][^>]+content=["']([^"']+)["'][^>]*>`, "i")) ||
    textBetween(html, new RegExp(`<meta[^>]+content=["']([^"']+)["'][^>]+(?:property|name)=["']${escaped}["'][^>]*>`, "i"));
}

function parseDates(url: URL) {
  return {
    startDate: url.searchParams.get("check_in") || url.searchParams.get("arrival") || "",
    endDate: url.searchParams.get("check_out") || url.searchParams.get("departure") || ""
  };
}

function inferSource(hostname: string) {
  if (hostname.includes("airbnb")) return "Airbnb";
  if (hostname.includes("vrbo")) return "VRBO";
  return "Listing";
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const rawUrl = String(body.url || "").trim();
  if (!rawUrl) return NextResponse.json({ ok: false, message: "Missing listing URL." }, { status: 400 });

  let url: URL;
  try {
    url = new URL(rawUrl);
  } catch {
    return NextResponse.json({ ok: false, message: "Invalid listing URL." }, { status: 400 });
  }

  const source = inferSource(url.hostname);
  const dates = parseDates(url);

  try {
    const response = await fetch(rawUrl, {
      headers: {
        "user-agent": "Mozilla/5.0 (compatible; GapStayBot/1.0; +https://gapstay.vercel.app)",
        "accept": "text/html,application/xhtml+xml"
      },
      next: { revalidate: 0 }
    });
    const html = await response.text();
    const title = meta(html, "og:title") || textBetween(html, /<title[^>]*>(.*?)<\/title>/i) || `${source} furnished stay offer`;
    const description = meta(html, "og:description") || meta(html, "description") || `Imported from ${source}: ${rawUrl}`;
    const image = meta(html, "og:image");

    return NextResponse.json({
      ok: true,
      source,
      sourceUrl: rawUrl,
      imported: true,
      title,
      description,
      image,
      ...dates,
      note: response.ok ? "Imported public listing metadata. Confirm the details before analysis." : "Imported dates from URL. Listing metadata was limited."
    });
  } catch (error: any) {
    return NextResponse.json({
      ok: true,
      source,
      sourceUrl: rawUrl,
      imported: false,
      title: `${source} furnished stay offer`,
      description: `Source listing: ${rawUrl}`,
      ...dates,
      note: "The listing page could not be fetched, but dates from the URL were captured when present. Confirm the details before analysis."
    });
  }
}
