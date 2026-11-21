import { describe, it, expect } from "vitest";
import { buildFeed, toStats } from "./feed";
import { mulberry32, Stat } from "./distribution";
import { reuseSession } from "./session";
import { allow } from "./ratelimit";

const mk = (id: string, o: Partial<Stat> = {}): Stat => ({
  id, category: null, impressions: 200, meaningful: 0, loves: 0, impressionsToday: 0, ...o,
});
const all = Array.from({ length: 30 }, (_, i) => mk(`c${i}`, { category: i % 2 ? "a" : "b" }));

describe("buildFeed", () => {
  it("never returns a creation the visitor has seen, across repeated batches", () => {
    const rng = mulberry32(2); const seen = new Set<string>(["c0", "c1", "c2"]);
    const got: string[] = [];
    for (let i = 0; i < 3; i++) {
      const ids = buildFeed({ all, seen, recentCategories: [], n: 10, rng });
      ids.forEach((id) => { expect(seen.has(id)).toBe(false); seen.add(id); got.push(id); });
    }
    expect(new Set(got).size).toBe(got.length);
    expect(got.length).toBe(27); // pool exhausted, no repeats
  });

  it("returns an empty list when everything has been seen", () => {
    expect(buildFeed({ all, seen: new Set(all.map((s) => s.id)), recentCategories: [], n: 10, rng: mulberry32(1) })).toEqual([]);
  });

  it("deep link puts the shared creation first even if seen or capped, then continues", () => {
    const capped = mk("hot", { impressionsToday: 9999, category: "a" });
    const ids = buildFeed({ all: [...all, capped], seen: new Set(["hot"]), recentCategories: [], n: 5, rng: mulberry32(3), first: "hot" });
    expect(ids[0]).toBe("hot");
    expect(ids.length).toBe(5);
    expect(ids.slice(1)).not.toContain("hot");
  });

  it("ignores an unknown deep link id", () => {
    const ids = buildFeed({ all, seen: new Set(), recentCategories: [], n: 4, rng: mulberry32(3), first: "nope" });
    expect(ids.length).toBe(4);
  });

  it("carries the category run across batches", () => {
    const pool = [...Array.from({ length: 6 }, (_, i) => mk(`a${i}`, { category: "a", meaningful: 30, loves: 25 })),
                  ...Array.from({ length: 6 }, (_, i) => mk(`b${i}`, { category: "b" }))];
    const ids = buildFeed({ all: pool, seen: new Set(), recentCategories: ["a", "a", "a"], n: 1, rng: mulberry32(4) });
    expect(ids[0].startsWith("b")).toBe(true);
  });

  it("maps database rows to stats", () => {
    expect(toStats([{ creation_id: "x", category: "a", impressions: "5", meaningful_impressions: "3", loves: "1", impressions_today: "2" }]))
      .toEqual([{ id: "x", category: "a", impressions: 5, meaningful: 3, loves: 1, impressionsToday: 2 }]);
  });
});

describe("session and rate limit", () => {
  it("reuses a session under 30 minutes, starts a new one after", () => {
    const now = 10_000_000;
    expect(reuseSession(now - 29 * 60_000, now)).toBe(true);
    expect(reuseSession(now - 31 * 60_000, now)).toBe(false);
    expect(reuseSession(null, now)).toBe(false);
  });

  it("limits per key per window", () => {
    const k = "t" + Math.random();
    for (let i = 0; i < 3; i++) expect(allow(k, 3, 1000, 100 + i)).toBe(true);
    expect(allow(k, 3, 1000, 500)).toBe(false);
    expect(allow(k, 3, 1000, 1200)).toBe(true); // window passed
    expect(allow(k + "other", 3, 1000, 500)).toBe(true);
  });
});
