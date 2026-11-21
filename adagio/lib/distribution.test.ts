import { describe, it, expect } from "vitest";
import { selectNext, mulberry32, exposureCap, Stat } from "./distribution";

const mk = (id: string, o: Partial<Stat> = {}): Stat => ({
  id, category: null, impressions: 200, meaningful: 0, loves: 0, impressionsToday: 0, ...o,
});

describe("distribution", () => {
  it("gives a new creation exposure within the first 150 slots", () => {
    const rng = mulberry32(1);
    const pool = [mk("new", { impressions: 0 }), ...Array.from({ length: 5 }, (_, i) => mk(`old${i}`, { meaningful: 25, loves: 20 }))];
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
      mk("hit", { meaningful: 45, loves: 40 }),
      ...Array.from({ length: 50 }, (_, i) => mk(`flop${i}`, { meaningful: 31, loves: 1 })),
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
    const pool = [mk("capped", { impressionsToday: 301, meaningful: 120, loves: 99 }), mk("ok", { impressionsToday: 10 }), mk("ok2"), mk("ok3")];
    for (let i = 0; i < 100; i++) expect(selectNext({ pool, n: 3, rng })).not.toContain("capped");
    expect(exposureCap([1000, 1200, 900])).toBe(3 * 1000);
  });

  it("limits same-category runs to 3", () => {
    const rng = mulberry32(5);
    const pool = [
      ...Array.from({ length: 10 }, (_, i) => mk(`a${i}`, { category: "a", meaningful: 40, loves: 30 })),
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
    const pool = Array.from({ length: 20 }, (_, i) => mk(`c${i}`, { meaningful: 20, loves: i }));
    expect(selectNext({ pool, n: 10, rng: mulberry32(9) })).toEqual(selectNext({ pool, n: 10, rng: mulberry32(9) }));
  });

  it("a new creation among 300 established ones gets exposure within the first 150 slots", () => {
    const rng = mulberry32(21);
    const pool = [mk("new", { impressions: 0 }), ...Array.from({ length: 300 }, (_, i) => mk(`old${i}`, { meaningful: 40, loves: 8 }))];
    let slot = 0, seenAt = -1;
    while (slot < 150 && seenAt < 0) { if (selectNext({ pool, n: 1, rng })[0] === "new") seenAt = slot; slot++; }
    expect(seenAt).toBeGreaterThanOrEqual(0);
  });
});
