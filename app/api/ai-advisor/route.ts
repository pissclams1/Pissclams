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
  economics: { nightlyRate: number; likelyShortStayRevenue: number; furnishedOffer: number; monthlyEquivalent: number; fillProbability: number };
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
  return {
    recommendation,
    confidence: Math.round((lowFill ? 78 : 64) + (urgent ? 8 : 0)),
    headline: recommendation === "hold" ? "Hold the nightly listing for now." : recommendation === "salvage" ? "Start salvage outreach now." : "Package this gap as a furnished stay now.",
    reasoning: [
      `${input.gap.nights} open nights with an estimated ${Math.round(input.economics.fillProbability * 100)}% short-stay fill probability.`,
      `Likely short-stay revenue is $${Math.round(input.economics.likelyShortStayRevenue).toLocaleString()} versus a furnished-stay offer of $${Math.round(input.economics.furnishedOffer).toLocaleString()}.`,
      furnishedDelta > 0 ? `The furnished-stay path is ahead by about $${Math.round(furnishedDelta).toLocaleString()} before turnover reduction.` : "The nightly path still has better expected revenue in this window.",
      ...(input.marketSignal?.reasoning || []).slice(0, 2)
    ],
    riskOfWaiting: recommendation === "hold" ? "The main risk is that the gap remains open closer to arrival. Re-check if it is still open in two weeks." : "The longer this stays open, the smaller the pool of monthly renters who can use the full window.",
    nextAction: recommendation === "hold" ? "Keep the nightly listing active and set a re-check date." : "Keep Airbnb or VRBO live, but start posting a furnished-stay offer today. Block dates only when a renter commits.",
    postCopy: `Furnished stay available in ${city}: ${input.gap.nights} nights, ${input.bedrooms || ""}BR/${input.bathrooms || ""}BA, $${Math.round(input.economics.furnishedOffer).toLocaleString()} all-in. Good fit for relocation, work assignment, between homes, or insurance displacement.`,
    fallback: true
  };
}

function safeJson(text: string): AdvisorOutput | null {
  try {
    const cleaned = text.replace(/```json/g, "").replace(/```/g, "").trim();
    return JSON.parse(cleaned);
  } catch {
    return null;
  }
}

export async function POST(request: Request) {
  const input = await request.json().catch(() => null) as AdvisorInput | null;
  if (!input?.gap || !input?.economics) return NextResponse.json({ ok: false, message: "Missing advisor input." }, { status: 400 });

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return NextResponse.json({ ok: true, advisor: fallbackAdvisor(input), source: "fallback" });

  try {
    const prompt = `You are GapStay, an AI revenue advisor for Airbnb and VRBO hosts. Decide whether this host should hold for short stays, package the whole gap as a furnished stay, split the gap, or salvage it. Be direct, commercially realistic, and do not promise guaranteed revenue. Return JSON only with keys: recommendation, confidence, headline, reasoning, riskOfWaiting, nextAction, postCopy, fallback. recommendation must be one of hold, package, split, salvage. confidence is 0-100. reasoning must be an array of 3-5 short strings.\n\nINPUT:\n${JSON.stringify(input, null, 2)}`;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || "gpt-4o-mini",
        temperature: 0.2,
        messages: [
          { role: "system", content: "You are a concise STR revenue advisor. Return valid JSON only." },
          { role: "user", content: prompt }
        ]
      })
    });

    if (!response.ok) return NextResponse.json({ ok: true, advisor: fallbackAdvisor(input), source: "fallback", error: `OpenAI returned ${response.status}` });
    const json = await response.json();
    const text = json.choices?.[0]?.message?.content || "";
    const advisor = safeJson(text) || fallbackAdvisor(input);
    return NextResponse.json({ ok: true, advisor, source: safeJson(text) ? "openai" : "fallback" });
  } catch (error) {
    return NextResponse.json({ ok: true, advisor: fallbackAdvisor(input), source: "fallback", error: String(error) });
  }
}
