import { NextResponse } from "next/server";
import { fetchCalendar, extractListingId } from "../../../lib/ical";
import { detectMarket, getMarketLabel } from "../../../lib/market-intelligence";

function textBetween(html: string, pattern: RegExp) {
  const match = html.match(pattern);
  return match?.[1]?.replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#x27;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">").trim() || "";
}

function meta(html: string, property: string) {
  const escaped = property.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return textBetween(html, new RegExp(`<meta[^>]+(?:property|name)=["']${escaped}["'][^>]+content=["']([^"']+)["'][^>]*>`, "i")) ||
    textBetween(html, new RegExp(`<meta[^>]+content=["']([^"']+)["'][^>]+(?:property|name)=["']${escaped}["'][^>]*>`, "i"));
}

function findFirst(text: string, patterns: RegExp[]) {
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match?.[1]) return match[1];
  }
  return "";
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

function extractSignals(html: string, title: string, description: string) {
  const haystack = `${title} ${description} ${html.slice(0, 250000)}`;
  const rating = findFirst(haystack, [/([0-5]\.?\d{0,2})\s*(?:out of 5|stars?|rating)/i, /"ratingValue"\s*:\s*"?([0-5]\.?\d{0,2})/i]);
  const reviews = findFirst(haystack, [/(\d{1,4})\s+reviews?/i, /"reviewCount"\s*:\s*"?(\d{1,4})/i]);
  const guests = findFirst(haystack, [/(\d{1,2})\s+guests?/i]);
  const bedrooms = findFirst(haystack, [/(\d{1,2})\s+bedrooms?/i, /(\d{1,2})\s+beds?/i]);
  const bathrooms = findFirst(haystack, [/(\d{1,2}(?:\.5)?)\s+bathrooms?/i, /(\d{1,2}(?:\.5)?)\s+baths?/i]);
  const nightly = findFirst(haystack, [/$\s?(\d{2,5})\s+(?:night|per night)/i, /"price"\s*:\s*"?(\d{2,5})/i]);
  const city = findFirst(haystack, [/"city"\s*:\s*"([^"]+)"/i, /,\s*([A-Z][a-z]+(?:\s[A-Z][a-z]+)?),\s*[A-Z]{2}/]);
  const state = findFirst(haystack, [/"state"\s*:\s*"([A-Z]{2})"/i, /,\s*([A-Z]{2})\s+\d{5}/]);
  const unavailableMentions = (haystack.match(/unavailable|reserved|booked|blocked/gi) || []).length;
  return { rating, reviews, guests, bedrooms, bathrooms, nightly, city, state, unavailableMentions };
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
  const urlDates = parseDates(url);
  const listingId = extractListingId(rawUrl);
  const calendarResult = listingId ? await fetchCalendar(rawUrl) : null;

  let title = `${source} furnished stay offer`;
  let description = `Source listing: ${rawUrl}`;
  let image = "";
  let signals: ReturnType<typeof extractSignals> = { rating: "", reviews: "", guests: "", bedrooms: "", bathrooms: "", nightly: "", city: "", state: "", unavailableMentions: 0 };
  let imported = false;

  try {
    const response = await fetch(rawUrl, {
      headers: {
        "user-agent": "Mozilla/5.0 (compatible; GapStayBot/1.0; +https://gapstay.vercel.app)",
        "accept": "text/html,application/xhtml+xml"
      },
      next: { revalidate: 0 }
    });
    if (response.ok) {
      const html = await response.text();
      title = meta(html, "og:title") || textBetween(html, /<title[^>]*>(.*?)<\/title>/i) || title;
      description = meta(html, "og:description") || meta(html, "description") || description;
      image = meta(html, "og:image");
      signals = extractSignals(html, title, description);
      imported = true;
    }
  } catch {}

  const marketKey = detectMarket(rawUrl, signals.city || "", signals.state || "");
  const marketLabel = getMarketLabel(marketKey);
  const nextGap = calendarResult?.nextGap || null;
  const startDate = nextGap?.start || urlDates.startDate;
  const endDate = nextGap?.end || urlDates.endDate;

  return NextResponse.json({
    ok: true,
    source,
    sourceUrl: rawUrl,
    listingId,
    imported,
    title,
    description,
    image,
    signals,
    calendarOk: calendarResult?.ok || false,
    gaps: calendarResult?.gaps || [],
    nextGap,
    bookedRanges: calendarResult?.bookedRanges || [],
    startDate,
    endDate,
    marketKey,
    marketLabel,
    note: calendarResult?.ok
      ? `Read ${(calendarResult?.gaps || []).length} open gap(s) from the calendar feed. Showing the next actionable window.`
      : startDate
        ? "Dates came from the listing URL. Confirm the gap before analysis."
        : "Calendar feed was unavailable. Confirm or enter the open dates below."
  });
}
