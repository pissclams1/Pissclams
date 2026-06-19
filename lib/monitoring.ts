import { fetchCalendar } from "./ical";
import { analyzeGap } from "./pricing";
import { detectMarket, scoreGap } from "./market-intelligence";

export type MonitorInput = {
  sourceUrl: string;
  title?: string;
  city?: string;
  state?: string;
  propertyType?: string;
  bedrooms?: number;
  bathrooms?: number;
  nightlyRate?: number;
  cleaningFee?: number;
  marketMonthlyRent?: number;
};

export type MonitorFinding = {
  gap: { startDate: string; endDate: string; nights: number; daysUntil: number };
  analysis: ReturnType<typeof analyzeGap>;
  marketSignal: ReturnType<typeof scoreGap>;
  shouldAlert: boolean;
  alertReason: string;
  alertHash: string;
};

function daysUntil(date: string) {
  return Math.max(0, Math.round((new Date(`${date}T12:00:00`).getTime() - Date.now()) / 86400000));
}

function hashFinding(input: MonitorInput, gapStart: string, recommendation: string, fillProbability: number) {
  return `${input.sourceUrl}|${gapStart}|${recommendation}|${Math.round(fillProbability * 100)}`;
}

export async function evaluateMonitor(input: MonitorInput): Promise<{ ok: boolean; findings: MonitorFinding[]; error?: string }> {
  const calendar = await fetchCalendar(input.sourceUrl);
  if (!calendar.ok) return { ok: false, findings: [], error: calendar.error || "Calendar unavailable." };

  const marketKey = detectMarket(input.sourceUrl, input.city || "", input.state || "");
  const gaps = calendar.gaps.slice(0, 6);
  const findings = gaps.map(gap => {
    const startDays = daysUntil(gap.start);
    const marketSignal = scoreGap(gap.start, gap.nights, marketKey, startDays);
    const analysis = analyzeGap({
      startDate: gap.start,
      endDate: gap.end,
      nightlyTarget: Number(input.nightlyRate || 150),
      expectedOccupancy: Math.round(marketSignal.fillProbability * 100),
      cleaningFee: Number(input.cleaningFee || 150),
      market: marketSignal.recommendation === "furnished" ? "soft" : "balanced",
      fillProbability: marketSignal.fillProbability,
      marketLabel: marketSignal.marketLabel,
      bedrooms: Number(input.bedrooms || 2),
      city: input.city,
      state: input.state,
      marketMonthlyRent: input.marketMonthlyRent
    });
    const shouldAlert = analysis.recommendation === "furnished" && gap.nights >= 14 && startDays <= 90;
    const alertReason = shouldAlert
      ? `${gap.nights} open nights start in ${startDays} days. Comparable unfurnished rent is ${analysis.marketMonthlyRent}/mo; the furnished-stay offer beats likely short-stay revenue.`
      : "No urgent intervention needed yet.";
    return {
      gap: { startDate: gap.start, endDate: gap.end, nights: gap.nights, daysUntil: startDays },
      analysis,
      marketSignal,
      shouldAlert,
      alertReason,
      alertHash: hashFinding(input, gap.start, analysis.recommendation, analysis.fillProbability)
    };
  });

  return { ok: true, findings };
}
