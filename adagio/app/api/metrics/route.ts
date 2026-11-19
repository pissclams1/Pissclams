import { NextResponse } from "next/server";
import { db } from "@/lib/supabase";
import { median } from "@/lib/distribution";

const pct = (xs: number[], p: number) => {
  if (!xs.length) return 0;
  const s = [...xs].sort((a, b) => a - b);
  return s[Math.min(s.length - 1, Math.ceil(p * s.length) - 1)];
};

function gini(xs: number[]): number {
  const s = [...xs].sort((a, b) => a - b);
  const n = s.length, sum = s.reduce((a, b) => a + b, 0);
  if (!n || !sum) return 0;
  return s.reduce((acc, x, i) => acc + (2 * (i + 1) - n - 1) * x, 0) / (n * sum);
}

async function all<T>(q: (from: number, to: number) => PromiseLike<{ data: T[] | null }>): Promise<T[]> {
  const out: T[] = [];
  for (let from = 0; ; from += 1000) {
    const { data } = await q(from, from + 999);
    out.push(...(data ?? []));
    if (!data || data.length < 1000) return out;
  }
}

export async function GET(req: Request) {
  const secret = process.env.METRICS_SECRET;
  const given = req.headers.get("x-metrics-secret") ?? new URL(req.url).searchParams.get("secret");
  if (!secret || given !== secret) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const c = db();
  const [visitors, sessions, events, stats] = await Promise.all([
    all<any>((f, t) => c.from("visitors").select("id,first_seen,utm_source").range(f, t)),
    all<any>((f, t) => c.from("sessions").select("id").range(f, t)),
    all<any>((f, t) => c.from("events").select("visitor_id,session_id,action,dwell_ms,created_at").range(f, t)),
    all<any>((f, t) => c.from("creation_stats").select("*").range(f, t)),
  ]);

  // swipes = meaningful like/pass
  const swipes = events.filter((e) => (e.action === "like" || e.action === "pass") && e.dwell_ms >= 400);
  const perSession = new Map<string, number>();
  for (const e of swipes) perSession.set(e.session_id, (perSession.get(e.session_id) ?? 0) + 1);
  const counts = [...perSession.values()];

  // D1 / D7: share of visitors with an event >=1 / >=7 days after their first event
  const firstEv = new Map<string, number>(), lastEv = new Map<string, number>();
  for (const e of events) {
    const t = new Date(e.created_at).getTime();
    firstEv.set(e.visitor_id, Math.min(firstEv.get(e.visitor_id) ?? Infinity, t));
    lastEv.set(e.visitor_id, Math.max(lastEv.get(e.visitor_id) ?? 0, t));
  }
  const DAY = 86_400_000;
  const ret = (d: number) =>
    visitors.length ? [...firstEv].filter(([v, f]) => lastEv.get(v)! - f >= d * DAY).length / visitors.length : 0;

  const likes = swipes.filter((e) => e.action === "like").length;
  const perCreation = stats
    .map((s) => ({ id: s.creation_id, swipes: Number(s.likes) + Number(s.passes),
      like_rate: Number(s.likes) + Number(s.passes) ? Number(s.likes) / (Number(s.likes) + Number(s.passes)) : null }))
    .filter((s) => s.swipes >= 30);

  const imps = stats.map((s) => Number(s.impressions)).sort((a, b) => b - a);
  const totalImps = imps.reduce((a, b) => a + b, 0);
  const top10 = imps.slice(0, Math.max(1, Math.ceil(imps.length * 0.1))).reduce((a, b) => a + b, 0);

  const sources: Record<string, number> = {};
  for (const v of visitors) sources[v.utm_source ?? "(none)"] = (sources[v.utm_source ?? "(none)"] ?? 0) + 1;

  return NextResponse.json({
    visitors: visitors.length, sessions: sessions.length, total_swipes: swipes.length,
    swipes_per_session: { median: median(counts), p90: pct(counts, 0.9) },
    d1_return: ret(1), d7_return: ret(7),
    like_rate_overall: swipes.length ? likes / swipes.length : null,
    like_rate_per_creation: perCreation,
    exposure: { top10_share: totalImps ? top10 / totalImps : 0, gini: gini(imps) },
    share_creations_100_impressions: imps.length ? imps.filter((i) => i >= 100).length / imps.length : 0,
    traffic_sources: sources,
  });
}
