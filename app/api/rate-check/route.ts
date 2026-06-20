import { NextResponse } from "next/server";
import { detectMarket, scoreGap } from "../../../lib/market-intelligence";

function findFirst(text: string, patterns: RegExp[]) {
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match?.[1]) return match[1];
  }
  return "";
}

function extractBaseRate(html: string) {
  const haystack = html.slice(0, 250000);
  const value = findFirst(haystack, [/$\s?(\d{2,5})\s+(?:night|per night)/i, /"price"\s*:\s*"?(\d{2,5})/i]);
  return Number(value || 0);
}

function extractCityState(html: string) {
  const city = findFirst(html, [/"city"\s*:\s*"([^"]+)"/i]);
  const state = findFirst(html, [/"state"\s*:\s*"([A-Z]{2})"/i]);
  return { city, state };
}

function isoDate(offset: number) {
  const date = new Date();
  date.setDate(date.getDate() + offset);
  return date.toISOString().slice(0, 10);
}

function weekendMultiplier(day: number) {
  if (day === 5 || day === 6) return 1.16;
  if (day === 0) return 1.08;
  if (day === 1 || day === 2) return 0.9;
  return 1;
}

function leadMultiplier(daysOut: number) {
  if (daysOut <= 3) return 0.82;
  if (daysOut <= 10) return 0.9;
  if (daysOut <= 30) return 1;
  if (daysOut <= 60) return 1.04;
  return 1.08;
}

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const rawUrl = String(body.url || "").trim();
  const manualRate = Number(body.baseRate || 0);
  if (!rawUrl) return NextResponse.json({ ok: false, message: "Missing listing URL." }, { status: 400 });

  let baseRate = manualRate;
  let city = "";
  let state = "";
  let imported = false;
  try {
    const response = await fetch(rawUrl, { headers: { "user-agent": "Mozilla/5.0 (compatible; GapStayBot/1.0)", "accept": "text/html" }, next: { revalidate: 0 } });
    if (response.ok) {
      const html = await response.text();
      baseRate = baseRate || extractBaseRate(html);
      const location = extractCityState(html);
      city = location.city;
      state = location.state;
      imported = true;
    }
  } catch {}

  if (!baseRate) return NextResponse.json({ ok: false, needsRate: true, message: "Could not detect the current nightly rate. Enter it manually." });
  const marketKey = detectMarket(rawUrl, city, state);
  const days = Array.from({ length: 90 }, (_, index) => {
    const date = isoDate(index + 1);
    const dt = new Date(`${date}T12:00:00`);
    const signal = scoreGap(date, 1, marketKey, index + 1);
    const demand = 0.72 + signal.fillProbability * 0.76;
    const recommendedRate = Math.round(clamp(baseRate * demand * weekendMultiplier(dt.getDay()) * leadMultiplier(index + 1), baseRate * 0.55, baseRate * 1.95));
    const pct = (recommendedRate - baseRate) / baseRate;
    const status = index < 14 && pct < -0.18 ? "urgent" : pct > 0.14 ? "underpriced" : pct < -0.14 ? "overpriced" : "ok";
    return { date, currentRate: baseRate, recommendedRate, delta: recommendedRate - baseRate, status, expectedOccupancy: Math.round(signal.fillProbability * 100), confidence: Math.round(clamp(58 + Math.abs(pct) * 55 + (signal.nearHoliday ? 8 : 0), 55, 94)), reason: signal.reasoning[0] || "Demand signal is moderate." };
  });

  return NextResponse.json({ ok: true, imported, baseRate, city, state, marketKey, summary: { overpriced: days.filter(d => d.status === "overpriced" || d.status === "urgent").length, underpriced: days.filter(d => d.status === "underpriced").length, urgent: days.filter(d => d.status === "urgent").length, avgRecommendedRate: Math.round(days.reduce((s,d)=>s+d.recommendedRate,0)/days.length) }, days });
}
