import { describe, it, expect } from "vitest";
import { selectNext, mulberry32, exposureCap, passWeight, Stat } from "./distribution";

const mk = (id: string, o: Partial<Stat> = {}): Stat => ({
  id, category: null, impressions: 200, likes: 0, passes: 0, impressionsToday: 0, ...o,
});

describe("distribution", () => {
  it("gives a new creation exposure within the first 150 slots", () => {
    const rng = mulberry32(1);
    const pool = [mk("new", { impressions: 0 }), ...Array.from({ length: 5 }, (_, i) => mk(`old${i}`, { likes: 20, passes: 5 }))];
    let slots = 0, seen = false;
    // each visitor sees a fresh pool (the creation is unseen by that visitor)
    while (slots < 150 && !seen) {
      const [id] = selectNext({ pool, n: 1, rng });
      seen = id === "new";
      slots++;
    }
    expect(seen).toBe(true);
  });

  it("a hit among flops gets extra exposure only on the hit", () => {
    const rng = mulberry32(7);
    const pool = [
      mk("hit", { likes: 40, passes: 5 }),
      ...Array.from({ length: 50 }, (_, i) => mk(`flop${i}`, { likes: 1, passes: 30 })),
    ];
    const counts: Record<string, number> = {};
    for (let i = 0; i < 500; i++) {
      const [id] = selectNext({ pool, n: 1, rng });
      counts[id] = (counts[id] ?? 0) + 1;
    }
    const maxFlop = Math.max(...Object.entries(counts).filter(([k]) => k !== "hit").map(([, v]) => v));
    expect(counts.hit).toBeGreaterThan(maxFlop * 3);
  });

  it("never exceeds the exposure cap", () => {
    const rng = mulberry32(3);
    const pool = [mk("capped", { impressionsToday: 301, likes: 99 }), mk("ok", { impressionsToday: 10 }), mk("ok2"), mk("ok3")];
    for (let i = 0; i < 100; i++) expect(selectNext({ pool, n: 3, rng })).not.toContain("capped");
    expect(exposureCap([1000, 1200, 900])).toBe(3 * 1000);
  });

  it("limits same-category runs to 3", () => {
    const rng = mulberry32(5);
    const pool = [
      ...Array.from({ length: 10 }, (_, i) => mk(`a${i}`, { category: "a", likes: 30 })),
      ...Array.from({ length: 10 }, (_, i) => mk(`b${i}`, { category: "b" })),
    ];
    const ids = selectNext({ pool, n: 12, rng });
    const cat = (id: string) => id[0];
    for (let i = 3; i < ids.length; i++) {
      const four = ids.slice(i - 3, i + 1).map(cat);
      expect(new Set(four).size).toBeGreaterThan(1);
    }
  });

  it("is deterministic for a fixed seed", () => {
    const pool = Array.from({ length: 20 }, (_, i) => mk(`c${i}`, { likes: i }));
    expect(selectNext({ pool, n: 10, rng: mulberry32(9) })).toEqual(selectNext({ pool, n: 10, rng: mulberry32(9) }));
  });

  it("weights passes by dwell time", () => {
    expect(passWeight(300)).toBe(0);
    expect(passWeight(400)).toBeCloseTo(0.25);
    expect(passWeight(3000)).toBe(1);
    expect(passWeight(60000)).toBe(1);
    expect(passWeight(1700)).toBeGreaterThan(passWeight(800));
  });

  it("a creation skipped after long looks is picked less than one skipped quickly", () => {
    const rng = mulberry32(11);
    // same raw pass count; weighted totals differ (30 x 1.0 vs 30 x 0.25)
    const pool = [mk("long", { likes: 5, passes: 30 }), mk("quick", { likes: 5, passes: 7.5 })];
    const counts = { long: 0, quick: 0 } as Record<string, number>;
    for (let i = 0; i < 400; i++) counts[selectNext({ pool, n: 1, rng })[0]]++;
    expect(counts.quick).toBeGreaterThan(counts.long * 2);
  });
});
