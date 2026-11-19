// Pure selection logic. Inputs are creation stats only: no creator identity, no popularity signals.
export type Stat = {
  id: string;
  category: string | null;
  impressions: number; // lifetime
  likes: number; // meaningful
  passes: number; // meaningful
  impressionsToday: number;
};

export type Rng = () => number;

export const EXPLORE_SHARE = 0.3;
export const EXPLORE_BELOW = 150;
export const CAP_FLOOR = 300;
export const CAP_MULT = 3;
export const MAX_CATEGORY_RUN = 3;

export function mulberry32(seed: number): Rng {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function median(xs: number[]): number {
  if (!xs.length) return 0;
  const s = [...xs].sort((a, b) => a - b);
  const m = s.length >> 1;
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
}

export function exposureCap(allToday: number[]): number {
  return Math.max(CAP_FLOOR, CAP_MULT * median(allToday));
}

function gaussian(rng: Rng): number {
  const u = Math.max(rng(), 1e-12);
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * rng());
}

function gammaSample(shape: number, rng: Rng): number {
  // Marsaglia-Tsang; shape >= 1 here (alpha, beta = 1 + count)
  const d = shape - 1 / 3;
  const c = 1 / Math.sqrt(9 * d);
  for (;;) {
    let x: number, v: number;
    do {
      x = gaussian(rng);
      v = 1 + c * x;
    } while (v <= 0);
    v = v * v * v;
    const u = rng();
    if (u < 1 - 0.0331 * x ** 4 || Math.log(u) < 0.5 * x * x + d * (1 - v + Math.log(v))) return d * v;
  }
}

export function betaSample(a: number, b: number, rng: Rng): number {
  const x = gammaSample(a, rng);
  const y = gammaSample(b, rng);
  return x / (x + y);
}

export type SelectInput = {
  pool: Stat[]; // active creations this visitor hasn't seen
  n: number;
  rng: Rng;
  recentCategories?: (string | null)[]; // oldest -> newest, categories already shown to this visitor
  capReference?: number[]; // impressionsToday across ALL active creations (for the median); defaults to pool
};

export function selectNext({ pool, n, rng, recentCategories = [], capReference }: SelectInput): string[] {
  const cap = exposureCap(capReference ?? pool.map((s) => s.impressionsToday));
  let candidates = pool.filter((s) => s.impressionsToday <= cap).map((s) => ({ ...s }));
  const recent = [...recentCategories];
  const out: string[] = [];

  const runBlocked = (cat: string | null): boolean => {
    if (cat == null || recent.length < MAX_CATEGORY_RUN) return false;
    return recent.slice(-MAX_CATEGORY_RUN).every((c) => c === cat);
  };

  while (out.length < n && candidates.length) {
    // category rule; relax if it would empty the pool
    let eligible = candidates.filter((s) => !runBlocked(s.category));
    if (!eligible.length) eligible = candidates;

    let pick: Stat | undefined;
    if (rng() < EXPLORE_SHARE) {
      const fresh = eligible.filter((s) => s.impressions < EXPLORE_BELOW);
      if (fresh.length) pick = fresh[Math.floor(rng() * fresh.length)];
    }
    if (!pick) {
      let best = -1;
      for (const s of eligible) {
        const v = betaSample(1 + s.likes, 1 + s.passes, rng);
        if (v > best) {
          best = v;
          pick = s;
        }
      }
    }
    if (!pick) break;
    out.push(pick.id);
    recent.push(pick.category);
    candidates = candidates.filter((s) => s.id !== pick!.id);
  }
  return out;
}
