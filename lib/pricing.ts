export type GapInput = {
  startDate: string;
  endDate: string;
  nightlyTarget: number;
  expectedOccupancy: number;
  cleaningFee: number;
  market: "soft" | "balanced" | "hot";
  fillProbability?: number;
  marketLabel?: string;
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
  turnoverSavings: number;
  certaintyScore: number;
  fillProbability: number;
  recommendation: "airbnb" | "furnished";
  explanation: string[];
};

const marketMultipliers = { soft: 0.52, balanced: 0.6, hot: 0.68 } as const;

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

export function analyzeGap(input: GapInput): GapAnalysis {
  const nights = nightsBetween(input.startDate, input.endDate);
  const fillProbability = input.fillProbability !== undefined ? input.fillProbability : Math.min(0.95, Math.max(0.2, input.expectedOccupancy / 100));
  const likelyBookedNights = Math.round(nights * fillProbability);
  const fullNightRevenue = Math.round(nights * input.nightlyTarget);
  const likelyShortTermRevenue = Math.round(likelyBookedNights * input.nightlyTarget);

  const recommendedNightly = Math.max(55, Math.round(input.nightlyTarget * marketMultipliers[input.market]));
  const recommendedTotal = Math.round(recommendedNightly * nights);
  const monthlyEquivalent = Math.round(recommendedNightly * 30);
  const avoidedTurns = Math.max(0, Math.round(likelyBookedNights / 4) - 1);
  const turnoverSavings = Math.round(avoidedTurns * input.cleaningFee);
  const recommendation: "airbnb" | "furnished" = recommendedTotal > likelyShortTermRevenue ? "furnished" : "airbnb";
  const certaintyScore = Math.min(96, Math.max(55, Math.round(65 + (fillProbability < 0.4 ? 15 : 0) + nights / 4)));

  const explanation: string[] = [];
  if (recommendation === "furnished") {
    explanation.push(`${nights} open nights at ${Math.round(fillProbability * 100)}% fill probability yields ${money(likelyShortTermRevenue)} as likely short-stay revenue.`);
    explanation.push(`A furnished-stay offer at ${money(recommendedTotal)} beats that by ${money(recommendedTotal - likelyShortTermRevenue)} before reduced turnover is counted.`);
    if (turnoverSavings > 0) explanation.push(`Avoiding roughly ${avoidedTurns} turnovers may save another ${money(turnoverSavings)} in cleaning fees.`);
    explanation.push("Keep Airbnb or VRBO live while you test this offer. Only block the dates when a renter is ready.");
  } else {
    explanation.push(`${nights} open nights at ${Math.round(fillProbability * 100)}% fill probability yields ${money(likelyShortTermRevenue)} as likely short-stay revenue.`);
    explanation.push(`A furnished-stay offer at ${money(recommendedTotal)} does not beat the short-stay path for this window.`);
    explanation.push("Hold the nightly listing for now and re-check if the gap remains open closer to arrival.");
  }

  return { id: `gap-${Date.now().toString(36)}`, nights, startDate: input.startDate, endDate: input.endDate, fullNightRevenue, likelyShortTermRevenue, likelyBookedNights, recommendedNightly, recommendedTotal, monthlyEquivalent, turnoverSavings, certaintyScore, fillProbability, recommendation, explanation };
}
