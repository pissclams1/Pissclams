// Feed assembly: pure, so it can be tested without a database.
import { selectNext, Rng, Stat } from "./distribution";

export type StatRow = {
  creation_id: string; category: string | null; impressions: number | string;
  meaningful_impressions: number | string; loves: number | string; impressions_today: number | string;
};

export const toStats = (rows: StatRow[]): Stat[] =>
  rows.map((r) => ({
    id: r.creation_id, category: r.category, impressions: Number(r.impressions),
    meaningful: Number(r.meaningful_impressions), loves: Number(r.loves), impressionsToday: Number(r.impressions_today),
  }));

export type FeedInput = {
  all: Stat[];                       // every active creation
  seen: Set<string>;                 // creations this visitor has an impression or event for
  recentCategories: (string | null)[]; // oldest -> newest, the visitor's last shown cards
  n: number;
  rng: Rng;
  first?: string;                    // /c/{id} deep link: shown first, ignores seen and the exposure cap
};

export function buildFeed({ all, seen, recentCategories, n, rng, first }: FeedInput): string[] {
  const out: string[] = [];
  const recent = [...recentCategories];
  const head = first ? all.find((s) => s.id === first) : undefined;
  if (head) { out.push(head.id); recent.push(head.category); }
  const pool = all.filter((s) => !seen.has(s.id) && s.id !== head?.id);
  out.push(...selectNext({
    pool, n: n - out.length, rng, recentCategories: recent, capReference: all.map((s) => s.impressionsToday),
  }));
  return out;
}
