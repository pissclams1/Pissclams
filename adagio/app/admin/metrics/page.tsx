import { computeMetrics } from "@/lib/metrics";

export const dynamic = "force-dynamic";
export const metadata = { title: "Adagio metrics", robots: { index: false } };

const p = (x: number | null) => (x == null ? "n/a" : `${(x * 100).toFixed(1)}%`);

export default async function Page({ searchParams }: { searchParams: Promise<{ secret?: string }> }) {
  const { secret } = await searchParams;
  if (!process.env.METRICS_SECRET || secret !== process.env.METRICS_SECRET) return <main className="admin"><p>Not authorized.</p></main>;
  const m = await computeMetrics();
  const ok = (v: boolean) => (v ? "pass" : "fail");
  const rows: [string, string, string?][] = [
    ["Visitors", String(m.visitors)],
    ["Sessions", String(m.sessions)],
    ["Total swipes", String(m.total_swipes)],
    ["Swipes/session median (target ≥ 30)", String(m.swipes_per_session.median), ok(m.swipes_per_session.median >= 30)],
    ["Swipes/session p90", String(m.swipes_per_session.p90)],
    ["D1 return", p(m.d1_return)],
    ["D7 return (target ≥ 15%)", p(m.d7_return), ok(m.d7_return >= 0.15)],
    ["Like rate overall (target 5–25%)", p(m.like_rate_overall), m.like_rate_overall == null ? undefined : ok(m.like_rate_overall >= 0.05 && m.like_rate_overall <= 0.25)],
    ["Top 10% creations' share of impressions", p(m.exposure.top10_share)],
    ["Gini of impressions", m.exposure.gini.toFixed(3)],
    ["Creations with ≥ 100 impressions", p(m.share_creations_100_impressions)],
  ];
  return (
    <main className="admin">
      <h1>Metrics</h1>
      <table><tbody>
        {rows.map(([k, v, s]) => <tr key={k}><td>{k}</td><td>{v}</td><td className={s}>{s ?? ""}</td></tr>)}
      </tbody></table>
      <h2>Traffic source</h2>
      <table><tbody>{Object.entries(m.traffic_sources).map(([k, v]) => <tr key={k}><td>{k}</td><td>{v}</td></tr>)}</tbody></table>
      <h2>Like rate per creation (≥ 30 swipes)</h2>
      <table><tbody>
        {m.like_rate_per_creation.length === 0 && <tr><td>No creation has 30 meaningful swipes yet.</td></tr>}
        {m.like_rate_per_creation.map((c) => <tr key={c.id}><td>{c.id}</td><td>{c.swipes}</td><td>{p(c.like_rate)}</td></tr>)}
      </tbody></table>
    </main>
  );
}
