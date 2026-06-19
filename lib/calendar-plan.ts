import { detectMarket, scoreGap } from "./market-intelligence";

export type CalendarDecision = "AIRBNB" | "WATCH" | "FURNISHED";

export type CalendarDayPlan = {
  date: string;
  decision: CalendarDecision;
  confidence: number;
  reason: string;
  monthKey: string;
};

export type CalendarRangePlan = {
  startDate: string;
  endDate: string;
  nights: number;
  decision: CalendarDecision;
  confidence: number;
  reason: string;
};

export type CalendarPlan = {
  days: CalendarDayPlan[];
  ranges: CalendarRangePlan[];
  summary: {
    airbnbDays: number;
    watchDays: number;
    furnishedDays: number;
    airbnbPercent: number;
    watchPercent: number;
    furnishedPercent: number;
    headline: string;
  };
};

function ymd(date: Date) { return date.toISOString().slice(0, 10); }
function monthKey(date: Date) { return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`; }
function addDays(date: Date, days: number) { return new Date(date.getTime() + days * 86400000); }
function daysUntil(date: Date) { return Math.max(0, Math.round((date.getTime() - Date.now()) / 86400000)); }

function localEventBoost(date: Date, url: string, city = "", state = "") {
  const text = `${url} ${city} ${state}`.toLowerCase();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  if ((text.includes("newark") || text.includes("east rutherford") || text.includes("elizabeth") || text.includes("jersey city")) && date.getFullYear() === 2026 && month === 7 && day >= 1 && day <= 20) return { boost: 0.36, reason: "major 2026 soccer demand near MetLife" };
  if ((text.includes("hamptons") || text.includes("montauk") || text.includes("southampton") || text.includes("east hampton")) && month >= 6 && month <= 8) return { boost: 0.2, reason: "summer vacation demand" };
  if ((text.includes("marco island") || text.includes("naples") || text.includes("florida")) && [1, 2, 3].includes(month)) return { boost: 0.2, reason: "winter seasonal demand" };
  if ((text.includes("nashville") || text.includes("new orleans") || text.includes("savannah") || text.includes("charleston")) && [3, 4, 5, 9, 10].includes(month)) return { boost: 0.12, reason: "strong shoulder-season visitor demand" };
  return { boost: 0, reason: "no exceptional local demand signal" };
}

function decide(score: number): CalendarDecision {
  if (score >= 0.62) return "AIRBNB";
  if (score >= 0.48) return "WATCH";
  return "FURNISHED";
}

function confidenceFor(decision: CalendarDecision, score: number) {
  if (decision === "AIRBNB") return Math.round(score * 100);
  if (decision === "FURNISHED") return Math.round((1 - score) * 100);
  return Math.round((1 - Math.abs(score - 0.55)) * 100);
}

function reasonFor(decision: CalendarDecision, eventReason: string, eventBoost: number, isPeakSeason: boolean) {
  if (eventBoost > 0 && decision === "AIRBNB") return eventReason;
  if (decision === "WATCH") return "leave on Airbnb for now, but re-check before committing the full window";
  if (decision === "AIRBNB") return isPeakSeason ? "seasonal short-stay demand supports Airbnb" : "short-stay demand is strong enough to hold";
  return "short-stay demand signals are too weak to justify waiting";
}

export function buildCalendarPlan(input: { sourceUrl: string; city?: string; state?: string; horizonDays?: number }) : CalendarPlan {
  const horizon = Math.min(365, Math.max(30, input.horizonDays || 365));
  const start = new Date(); start.setHours(12, 0, 0, 0);
  const marketKey = detectMarket(input.sourceUrl, input.city || "", input.state || "");
  const days: CalendarDayPlan[] = [];

  for (let i = 0; i < horizon; i++) {
    const date = addDays(start, i);
    const dateStr = ymd(date);
    const signal = scoreGap(dateStr, 30, marketKey, daysUntil(date));
    const event = localEventBoost(date, input.sourceUrl, input.city, input.state);
    const adjusted = Math.max(0.03, Math.min(0.97, signal.fillProbability + event.boost));
    const decision = decide(adjusted);
    days.push({ date: dateStr, decision, confidence: confidenceFor(decision, adjusted), reason: reasonFor(decision, event.reason, event.boost, signal.isPeakSeason), monthKey: monthKey(date) });
  }

  const ranges: CalendarRangePlan[] = [];
  for (const day of days) {
    const last = ranges[ranges.length - 1];
    if (!last || last.decision !== day.decision || last.reason !== day.reason) ranges.push({ startDate: day.date, endDate: day.date, nights: 1, decision: day.decision, confidence: day.confidence, reason: day.reason });
    else { last.endDate = day.date; last.nights += 1; last.confidence = Math.round((last.confidence * (last.nights - 1) + day.confidence) / last.nights); }
  }

  const airbnbDays = days.filter(d => d.decision === "AIRBNB").length;
  const watchDays = days.filter(d => d.decision === "WATCH").length;
  const furnishedDays = days.filter(d => d.decision === "FURNISHED").length;
  return { days, ranges, summary: { airbnbDays, watchDays, furnishedDays, airbnbPercent: Math.round((airbnbDays / days.length) * 100), watchPercent: Math.round((watchDays / days.length) * 100), furnishedPercent: Math.round((furnishedDays / days.length) * 100), headline: `GapStay recommends Airbnb for ${airbnbDays} days, Watch for ${watchDays} days, and Furnished Stay for ${furnishedDays} days over the next ${days.length} days.` } };
}
