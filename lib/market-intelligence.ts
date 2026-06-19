export type MarketSignal = {
  marketKey: string;
  marketLabel: string;
  isPeakSeason: boolean;
  nearHoliday: boolean;
  holidayName: string;
  fillProbability: number;
  recommendation: "airbnb" | "furnished";
  reasoning: string[];
};

const MARKET_PATTERNS: Record<string, { peakMonths: number[]; label: string; keywords: string[] }> = {
  hamptons: { peakMonths: [6, 7, 8], label: "The Hamptons, NY", keywords: ["hamptons", "southampton", "east hampton", "montauk", "sag harbor"] },
  florida: { peakMonths: [11, 12, 1, 2, 3], label: "Florida", keywords: ["florida", "fl"] },
  miami: { peakMonths: [12, 1, 2, 3, 4], label: "Miami, FL", keywords: ["miami", "miami beach", "brickell", "wynwood"] },
  "marco island": { peakMonths: [11, 12, 1, 2, 3], label: "Marco Island, FL", keywords: ["marco island"] },
  naples: { peakMonths: [11, 12, 1, 2, 3], label: "Naples, FL", keywords: ["naples, fl", "naples florida"] },
  "long island": { peakMonths: [7, 8], label: "Long Island, NY", keywords: ["long island", "farmingdale", "massapequa", "babylon", "islip", "huntington"] },
  nyc: { peakMonths: [4, 5, 6, 9, 10], label: "New York City", keywords: ["new york city", "brooklyn", "manhattan", "queens", "bronx", "hoboken", "jersey city"] },
  ski: { peakMonths: [12, 1, 2, 3], label: "ski market", keywords: ["aspen", "vail", "park city", "tahoe", "steamboat", "telluride", "breckenridge", "mammoth"] },
  charleston: { peakMonths: [3, 4, 5, 9, 10], label: "Charleston, SC", keywords: ["charleston, sc", "charleston south carolina"] },
  savannah: { peakMonths: [3, 4, 5, 10], label: "Savannah, GA", keywords: ["savannah, ga", "savannah georgia"] },
  nashville: { peakMonths: [4, 5, 6, 9, 10], label: "Nashville, TN", keywords: ["nashville"] },
  "new orleans": { peakMonths: [2, 3, 4, 10, 11], label: "New Orleans, LA", keywords: ["new orleans", "nola"] }
};

const HOLIDAYS = [
  { name: "New Year's", month: 1, day: 1, windowBefore: 4, windowAfter: 1 },
  { name: "Memorial Day", month: 5, day: 26, windowBefore: 3, windowAfter: 1 },
  { name: "July 4th", month: 7, day: 4, windowBefore: 4, windowAfter: 2 },
  { name: "Labor Day", month: 9, day: 1, windowBefore: 3, windowAfter: 1 },
  { name: "Thanksgiving", month: 11, day: 27, windowBefore: 5, windowAfter: 2 },
  { name: "Christmas", month: 12, day: 25, windowBefore: 5, windowAfter: 3 }
];

export function detectMarket(url: string, city = "", state = ""): string {
  const text = `${url} ${city} ${state}`.toLowerCase();
  for (const [key, market] of Object.entries(MARKET_PATTERNS)) {
    if (market.keywords.some(kw => text.includes(kw))) return key;
  }
  return "default";
}

export function getMarketLabel(marketKey: string): string {
  return MARKET_PATTERNS[marketKey]?.label || "your market";
}

function isPeakSeason(month: number, marketKey: string): boolean {
  const pattern = MARKET_PATTERNS[marketKey];
  if (!pattern) return month >= 6 && month <= 8;
  return pattern.peakMonths.includes(month);
}

function nearestHoliday(startDate: string): { near: boolean; name: string; daysOut: number } {
  const date = new Date(`${startDate}T12:00:00`);
  const year = date.getFullYear();

  for (const h of HOLIDAYS) {
    for (const candidate of [new Date(year, h.month - 1, h.day), new Date(year + 1, h.month - 1, h.day)]) {
      const daysUntil = Math.round((candidate.getTime() - date.getTime()) / 86400000);
      if (daysUntil >= -h.windowAfter && daysUntil <= h.windowBefore) return { near: true, name: h.name, daysOut: daysUntil };
    }
  }
  return { near: false, name: "", daysOut: 999 };
}

export function scoreGap(startDate: string, nights: number, marketKey: string, daysUntilGap = 0): MarketSignal {
  const month = new Date(`${startDate}T12:00:00`).getMonth() + 1;
  const peak = isPeakSeason(month, marketKey);
  const holiday = nearestHoliday(startDate);
  const marketLabel = getMarketLabel(marketKey);

  let fillProb = 0.5;
  fillProb += peak ? 0.22 : -0.22;
  if (holiday.near) fillProb += 0.18;
  if (nights > 21) fillProb -= 0.12;
  if (nights > 35) fillProb -= 0.1;
  if (nights > 60) fillProb -= 0.08;
  if (daysUntilGap < 21 && !holiday.near && !peak) fillProb -= 0.1;
  if (daysUntilGap < 14 && !holiday.near) fillProb -= 0.08;
  fillProb = Math.max(0.08, Math.min(0.91, fillProb));

  const recommendation: "airbnb" | "furnished" = fillProb < 0.52 ? "furnished" : "airbnb";
  const reasoning: string[] = [];
  if (peak) reasoning.push(`${marketLabel} is in peak season — short-stay demand is real.`);
  else reasoning.push(`${marketLabel} is outside peak season — short-stay bookings are less reliable.`);
  if (holiday.near) reasoning.push(`${holiday.name} demand may support short-stay bookings.`);
  if (nights > 21) reasoning.push(`${nights}-night gaps are difficult to fill with scattered short stays.`);
  if (daysUntilGap < 21 && !peak) reasoning.push(`This gap starts in ${daysUntilGap} days, so waiting is getting expensive.`);

  return { marketKey, marketLabel, isPeakSeason: peak, nearHoliday: holiday.near, holidayName: holiday.name, fillProbability: fillProb, recommendation, reasoning };
}
