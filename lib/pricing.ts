export type GapInput = { startDate: string; endDate: string; nightlyTarget: number; expectedOccupancy: number; cleaningFee: number; market: "soft" | "balanced" | "hot" };
export type GapAnalysis = { id: string; nights: number; startDate: string; endDate: string; fullNightRevenue: number; likelyShortTermRevenue: number; likelyBookedNights: number; recommendedNightly: number; recommendedTotal: number; monthlyEquivalent: number; turnoverSavings: number; certaintyScore: number; explanation: string[] };
const discounts = { soft: 0.46, balanced: 0.54, hot: 0.62 } as const;
export function money(value: number) { return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(value || 0); }
export function prettyDate(value: string) { if (!value) return "—"; return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(new Date(`${value}T12:00:00`)); }
export function nightsBetween(startDate: string, endDate: string) { if (!startDate || !endDate) return 0; const diff = new Date(`${endDate}T12:00:00`).getTime() - new Date(`${startDate}T12:00:00`).getTime(); return Math.max(0, Math.round(diff / 86400000)); }
export function analyzeGap(input: GapInput): GapAnalysis {
  const nights = nightsBetween(input.startDate, input.endDate);
  const occupancy = Math.min(95, Math.max(20, input.expectedOccupancy)) / 100;
  const likelyBookedNights = Math.round(nights * occupancy);
  const fullNightRevenue = Math.round(nights * input.nightlyTarget);
  const likelyShortTermRevenue = Math.round(likelyBookedNights * input.nightlyTarget);
  const recommendedNightly = Math.max(55, Math.round(input.nightlyTarget * discounts[input.market]));
  const recommendedTotal = Math.round(recommendedNightly * nights);
  const monthlyEquivalent = Math.round(recommendedNightly * 30);
  const avoidedTurns = Math.max(0, Math.round(likelyBookedNights / 4) - 1);
  const turnoverSavings = Math.round(avoidedTurns * input.cleaningFee);
  const certaintyScore = Math.min(96, Math.max(58, Math.round(72 + nights / 3 + (input.market === "soft" ? 8 : 0))));
  return { id: `gap-${Date.now().toString(36)}`, nights, startDate: input.startDate, endDate: input.endDate, fullNightRevenue, likelyShortTermRevenue, likelyBookedNights, recommendedNightly, recommendedTotal, monthlyEquivalent, turnoverSavings, certaintyScore, explanation: [`${nights} open nights is long enough to sell as one furnished stay instead of fragmented nightly bookings.`, "The recommendation discounts the nightly rate to prioritize occupancy, fewer turnovers, and calendar certainty.", recommendedTotal >= likelyShortTermRevenue ? "The mid-term offer can beat likely short-term revenue before counting hassle reduction." : "The mid-term offer trades some upside for certainty and a cleaner calendar.", `Estimated avoided-turnover value: ${money(turnoverSavings)}.`] };
}
