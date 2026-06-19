import { NextResponse } from "next/server";

export type AdvisorInput = {
  listingTitle?: string;
  city?: string;
  state?: string;
  propertyType?: string;
  bedrooms?: number;
  bathrooms?: number;
  rating?: string;
  reviews?: string;
  sourceUrl?: string;
  gap: { startDate: string; endDate: string; nights: number; daysUntil: number };
  economics: {
    nightlyRate: number;
    likelyShortStayRevenue: number;
    furnishedOffer: number;
    monthlyEquivalent: number;
    fillProbability: number;
    comparableUnfurnishedRent?: number;
    marketAnchoredMonthly?: number;
  };
  marketSignal?: { marketLabel?: string; isPeakSeason?: boolean; nearHoliday?: boolean; holidayName?: string; reasoning?: string[]; recommendation?: string };
};

type AdvisorOutput = {
  recommendation: "hold" | "package" | "split" | "salvage";
  confidence: number;
  headline: string;
  reasoning: string[];
  riskOfWaiting: string;
  nextAction: string;
  postCopy: string;
  fallback: boolean;
};

function fallbackAdvisor(input: AdvisorInput): AdvisorOutput {
  const packageWins = input.economics.furnishedOffer > input.economics.likelyShortStayRevenue;
  const lowFill = input.economics.fillProbability < 0.52;
  const urgent = input.gap.daysUntil < 45;
  const recommendation: AdvisorOutput["recommendation"] = packageWins && lowFill ? "package" : urgent && lowFill ? "salvage" : "hold";
  const city = [input.city, input.state].filter(Boolean).join(", ") || "your area";
  const furnishedDelta = input.economics.furnishedOffer - input.economics.likelyShortStayRevenue;
  const compLine = input.economics.comparableUnfurnishedRent
    ? `Comparable unfurnished rent is about $${Math.round(input.economics.comparableUnfurnishedRent).toLocaleString()}/mo before the furnished and flexibility premium.`
    : "The furnished-stay offer is anchored to comparable local rent plus a furnished/flexible premium.";
  return {
    recommendation,
    confidence: Math.min(96, Math.round((lowFill ? 78 : 64) + (urgent ? 8 : 0))),
    headline: recommendation === "hold" ? "Hold the nightly listing for now." : recommendation === "salvage" ? "Start salvage outreach now." : "Package this range as a furnished stay now.",
    reasoning: [
      `${input.gap.nights} open nights with an estimated ${Math.round(input.economics.fillProbability * 100)}% short-stay confidence.`,
      `Likely short-stay revenue is $${Math.round(input.economics.likelyShortStayRevenue).toLocaleString()} versus a furnished-stay offer of $${Math.round(input.economics.furnishedOffer).toLocaleString()}.`,
      compLine,
      furnishedDelta > 0 ? `The furnished-stay path is ahead by about $${Math.round(furnishedDelta).toLocaleString()} before turnover reduction.` : "The nightly path still has better expected revenue in this window.",
      ...(input.marketSignal?.reasoning || []).slice(0, 1)
    ].slice(0, 5),
    riskOfWaiting: recommendation === "hold" ? "The main risk is that the window remains unbooked closer to arrival. Re-check if it is still open in two weeks." : "The longer this stays open, the smaller the pool of furnished-stay renters who can use the full window.",
    nextAction: recommendation === "hold" ? "Keep the nightly listing active and set a re-check date." : "Keep Airbnb or VRBO live, but start posting a furnished-stay offer today. Block dates only when a renter commits.",
    postCopy: `Furnished stay available in ${city}: ${input.gap.nights} nights, ${input.bedrooms || ""}BR/${input.bathrooms || ""}BA, $${Math.round(input.economics.furnishedOffer).toLocaleString()} all-in. Good fit for relocation, work assignment, between homes, or insurance displacement.`,
    fallback: true
  };
}

function safeJson(text: string): unknown {
  try { return JSON.parse(text.replace(/```json/g, "").replace(/```/g, "").trim()); }
  catch { return null; }
}

function validAdvisor(value: unknown): AdvisorOutput | null {
  if (!value || typeof value !== "object") return null;
  const v = value as Partial<AdvisorOutput>;
  if (!["hold", "package", "split", "salvage"].includes(String(v.recommendation))) return null;
  if (typeof v.confidence !== "number" || v.confidence < 0 || v.confidence > 100) return null;
  if (typeof v.headline !== "string" || !v.headline.trim()) return null;
  if (!Array.isArray(v.reasoning) || v.reasoning.length < 2) return null;
  if (typeof v.riskOfWaiting !== "string" || !v.riskOfWaiting.trim()) return null;
  if (typeof v.nextAction !== "string" || !v.nextAction.trim()) return null;
  if (typeof v.postCopy !== "string" || !v.postCopy.trim()) return null;
  return { recommendation: v.recommendation as AdvisorOutput["recommendation"], confidence: Math.round(v.confidence), headline: v.headline, reasoning: v.reasoning.map(String).slice(0, 5), riskOfWaiting: v.riskOfWaiting, nextAction: v.nextAction, postCopy: v.postCopy, fallback: false };
}

export async function POST(request: Request) {
  const input = await request.json().catch(() => null) as AdvisorInput | null;
  if (!input?.gap || !input?.economics) return NextResponse.json({ ok: false, message: "Missing advisor input." }, { status: 400 });

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return NextResponse.json({ ok: true, advisor: fallbackAdvisor(input), source: "fallback", error: "ANTHROPIC_API_KEY not configured" });

  try {
    const prompt = `You are GapStay, an AI Calendar CFO for Airbnb and VRBO hosts. Decide whether this host should hold for short stays, package the whole range as a furnished stay, split the range, or salvage it. Use comparable unfurnished rent plus furnished/flexible premium as the furnished-stay anchor. Airbnb nightly rate is upside comparison, not the pricing anchor. Be direct, commercially realistic, and do not promise guaranteed income. Return JSON only with keys: recommendation, confidence, headline, reasoning, riskOfWaiting, nextAction, postCopy. recommendation must be one of hold, package, split, salvage. confidence is 0-100. reasoning must be an array of 3-5 short strings.\n\nINPUT:\n${JSON.stringify(input, null, 2)}`;

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-api-key": apiKey, "anthropic-version": "2023-06-01" },
      body: JSON.stringify({
        model: process.env.ANTHROPIC_MODEL || "claude-haiku-4-5-20251001",
        max_tokens: 900,
        temperature: 0.2,
        system: "You are a concise STR revenue advisor. Return valid JSON only.",
        messages: [{ role: "user", content: prompt }]
      })
    });

    if (!response.ok) return NextResponse.json({ ok: true, advisor: fallbackAdvisor(input), source: "fallback", error: `Anthropic returned ${response.status}` });
    const json = await response.json();
    const text = json.content?.find((part: { type?: string; text?: string }) => part.type === "text")?.text || "";
    const advisor = validAdvisor(safeJson(text));
    return NextResponse.json({ ok: true, advisor: advisor || fallbackAdvisor(input), source: advisor ? "anthropic" : "fallback" });
  } catch (error) {
    return NextResponse.json({ ok: true, advisor: fallbackAdvisor(input), source: "fallback", error: String(error) });
  }
}
