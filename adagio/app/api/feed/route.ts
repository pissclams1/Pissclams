import { NextResponse } from "next/server";
import { db, isUuid } from "@/lib/supabase";
import { selectNext, Stat } from "@/lib/distribution";

export async function GET(req: Request) {
  const u = new URL(req.url);
  const visitorId = u.searchParams.get("visitor_id");
  const n = Math.min(Math.max(parseInt(u.searchParams.get("n") ?? "10", 10) || 10, 1), 20);
  if (!isUuid(visitorId)) return NextResponse.json({ error: "bad visitor_id" }, { status: 400 });
  const c = db();

  // "Seen" = impressed or acted on. Cards fetched but never shown can be served again.
  const [imp, ev, stats] = await Promise.all([
    c.from("impressions").select("creation_id").eq("visitor_id", visitorId),
    c.from("events").select("creation_id").eq("visitor_id", visitorId),
    c.from("creation_stats").select("*"),
  ]);
  if (stats.error) return NextResponse.json({ error: "failed" }, { status: 500 });
  const seen = new Set([...(imp.data ?? []), ...(ev.data ?? [])].map((r) => r.creation_id));

  const all: Stat[] = (stats.data ?? []).map((r: any) => ({
    id: r.creation_id, category: r.category, impressions: Number(r.impressions),
    likes: Number(r.likes), passes: Number(r.weighted_passes), impressionsToday: Number(r.impressions_today),
  }));
  const pool = all.filter((s) => !seen.has(s.id));
  const ids = selectNext({
    pool, n, rng: Math.random, capReference: all.map((s) => s.impressionsToday),
  });
  if (!ids.length) return NextResponse.json({ cards: [] });

  const { data } = await c.from("creations")
    .select("id,title,creator_name,tools,commercial_ok,image_url,category").in("id", ids);
  const byId = new Map((data ?? []).map((r) => [r.id, r]));
  return NextResponse.json({ cards: ids.map((id) => byId.get(id)).filter(Boolean) });
}
