import { NextResponse } from "next/server";
import { db, isUuid } from "@/lib/supabase";
import { buildFeed, toStats } from "@/lib/feed";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const u = new URL(req.url);
  const visitorId = u.searchParams.get("visitor_id");
  const sessionId = u.searchParams.get("session_id");
  const first = u.searchParams.get("first"); // optional: /c/{id} deep link
  const n = Math.min(Math.max(parseInt(u.searchParams.get("n") ?? "10", 10) || 10, 1), 20);
  if (!isUuid(visitorId) || (sessionId && !isUuid(sessionId)) || (first && !isUuid(first)))
    return NextResponse.json({ error: "bad ids" }, { status: 400 });
  const c = db();

  const { data: v } = await c.from("visitors").select("id").eq("id", visitorId).maybeSingle();
  if (!v) return NextResponse.json({ error: "unknown visitor" }, { status: 404 });

  // "Seen" = impressed or acted on, so a reload never repeats a viewed card.
  const [imp, ev, stats, recent] = await Promise.all([
    c.from("impressions").select("creation_id").eq("visitor_id", visitorId),
    c.from("events").select("creation_id").eq("visitor_id", visitorId),
    c.from("creation_stats").select("*"),
    c.from("impressions").select("created_at, creations(category)").eq("visitor_id", visitorId)
      .order("created_at", { ascending: false }).limit(3),
  ]);
  if (stats.error) return NextResponse.json({ error: "failed" }, { status: 500 });
  const seen = new Set([...(imp.data ?? []), ...(ev.data ?? [])].map((r) => r.creation_id));
  const recentCategories = (recent.data ?? []).map((r: any) => r.creations?.category ?? null).reverse();

  const ids = buildFeed({ all: toStats(stats.data ?? []), seen, recentCategories, n, rng: Math.random, first: first ?? undefined });
  if (!ids.length) return NextResponse.json({ cards: [] });

  // contact_email is never selected here.
  const { data } = await c.from("creations")
    .select("id,title,creator_name,tools,commercial_ok,image_url,category,creators(portfolio_url)").in("id", ids);
  const byId = new Map((data ?? []).map((r: any) => [r.id, {
    id: r.id, title: r.title, creator_name: r.creator_name, tools: r.tools, commercial_ok: r.commercial_ok,
    image_url: r.image_url, category: r.category, portfolio_url: r.creators?.portfolio_url ?? null,
  }]));
  return NextResponse.json({ cards: ids.map((id) => byId.get(id)).filter(Boolean) });
}
