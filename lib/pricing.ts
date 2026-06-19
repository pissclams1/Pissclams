export type GapInput = {
  startDate: string;
  endDate: string;
  nightlyTarget: number;
  expectedOccupancy: number;
  cleaningFee: number;
  market: "soft" | "balanced" | "hot";
  fillProbability?: number;
  marketLabel?: string;
  bedrooms?: number;
  city?: string;
  state?: string;
  marketMonthlyRent?: number;
};

export type GapAnalysis = {
  id: string;
  nights: number;
  startDate: string;
  endDate: string;
  fullNightRevenue: number;
  likelyShortTermRevenue: number;
  likelyBookedNights: number;
  recommendedNightly: number;
  recommendedTotal: number;
  monthlyEquivalent: number;
  marketMonthlyRent: number;
  furnishedPremium: number;
  marketAnchoredMonthly: number;
  turnoverSavings: number;
  certaintyScore: number;
  fillProbability: number;
  recommendation: "airbnb" | "furnished";
  explanation: string[];
};

const fallbackMonthlyRentByBedroom: Record<number, number> = { 0: 1500, 1: 1900, 2: 2600, 3: 3400, 4: 4300 };
const cityMonthlyRent: Record<string, number> = {
  "marco island": 3600,
  naples: 3800,
  miami: 3300,
  "miami beach": 3600,
  hamptons: 5200,
  montauk: 5600,
  southampton: 5400,
  "east hampton": 5600,
  newark: 2700,
  elizabeth: 2500,
  "jersey city": 3400,
  "new york": 4300,
  brooklyn: 3600,
  nashville: 2800,
  savannah: 2600,
  charleston: 3000,
  "new orleans": 2500
};

const furnishedPremiumByMarket = { soft: 1.18, balanced: 1.28, hot: 1.38 } as const;

export function money(value: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(value || 0);
}

export function prettyDate(value: string) {
  if (!value) return "—";
  return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(new Date(`${value}T12:00:00`));
}

export function nightsBetween(startDate: string, endDate: string) {
  if (!startDate || !endDate) return 0;
  const diff = new Date(`${endDate}T12:00:00`).getTime() - new Date(`${startDate}T12:00:00`).getTime();
  return Math.max(0, Math.round(diff / 86400000));
}

function inferMonthlyRent(input: GapInput) {
  if (input.marketMonthlyRent && input.marketMonthlyRent > 0) return Math.round(input.marketMonthlyRent);
  const cityKey = String(input.city || input.marketLabel || "").toLowerCase();
  const cityMatch = Object.entries(cityMonthlyRent).find(([key]) => cityKey.includes(key));
  if (cityMatch) return cityMatch[1];
  const bedrooms = Math.max(0, Math.min(4, Math.round(Number(input.bedrooms || 2))));
  return fallbackMonthlyRentByBedroom[bedrooms] || fallbackMonthlyRentByBedroom[2];
}

export function analyzeGap(input: GapInput): GapAnalysis {
  const nights = nightsBetween(input.startDate, input.endDate);
  const fillProbability = input.fillProbability !== undefined ? input.fillProbability : Math.min(0.95, Math.max(0.2, input.expectedOccupancy / 100));
  const likelyBookedNights = Math.round(nights * fillProbability);
  const fullNightRevenue = Math.round(nights * input.nightlyTarget);
  const likelyShortTermRevenue = Math.round(likelyBookedNights * input.nightlyTarget);

  const marketMonthlyRent = inferMonthlyRent(input);
  const furnishedPremium = furnishedPremiumByMarket[input.market];
  const marketAnchoredMonthly = Math.round(marketMonthlyRent * furnishedPremium);
  const marketAnchoredNightly = Math.round(marketAnchoredMonthly / 30);
  const airbnbFantasyCeiling = Math.round(input.nightlyTarget * 0.72);
  const recommendedNightly = Math.max(55, Math.min(airbnbFantasyCeiling, marketAnchoredNightly));
  const recommendedTotal = Math.round(recommendedNightly * nights);
  const monthlyEquivalent = Math.round(recommendedNightly * 30);
  const avoidedTurns = Math.max(0, Math.round(likelyBookedNights / 4) - 1);
  const turnoverSavings = Math.round(avoidedTurns * input.cleaningFee);
  const recommendation: "airbnb" | "furnished" = recommendedTotal > likelyShortTermRevenue ? "furnished" : "airbnb";
  const certaintyScore = Math.min(96, Math.max(55, Math.round(65 + (fillProbability < 0.4 ? 15 : 0) + nights / 4)));

  const explanation: string[] = [];
  const rentLine = `Furnished-stay pricing starts with estimated local monthly rent of ${money(marketMonthlyRent)}, then applies a ${Math.round((furnishedPremium - 1) * 100)}% premium for furniture, flexibility, utilities, and shorter commitment.`;
  if (recommendation === "furnished") {
    explanation.push(`${nights} open nights at ${Math.round(fillProbability * 100)}% fill probability yields ${money(likelyShortTermRevenue)} as likely short-stay revenue.`);
    explanation.push(rentLine);
    explanation.push(`That supports a furnished-stay offer around ${money(recommendedTotal)} for the full window, or ${money(monthlyEquivalent)} per 30 days.`);
    if (turnoverSavings > 0) explanation.push(`Avoiding roughly ${avoidedTurns} turnovers may save another ${money(turnoverSavings)} in cleaning fees.`);
    explanation.push("Keep Airbnb or VRBO live while you test this offer. Only block the dates when a renter is ready.");
  } else {
    explanation.push(`${nights} open nights at ${Math.round(fillProbability * 100)}% fill probability yields ${money(likelyShortTermRevenue)} as likely short-stay revenue.`);
    explanation.push(rentLine);
    explanation.push(`The furnished-stay anchor of ${money(monthlyEquivalent)} per 30 days does not beat the short-stay path for this window.`);
    explanation.push("Hold the nightly listing for now and re-check if the gap remains open closer to arrival.");
  }

  return { id: `gap-${Date.now().toString(36)}`, nights, startDate: input.startDate, endDate: input.endDate, fullNightRevenue, likelyShortTermRevenue, likelyBookedNights, recommendedNightly, recommendedTotal, monthlyEquivalent, marketMonthlyRent, furnishedPremium, marketAnchoredMonthly, turnoverSavings, certaintyScore, fillProbability, recommendation, explanation };
}
