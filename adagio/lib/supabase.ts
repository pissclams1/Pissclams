import { createClient } from "@supabase/supabase-js";

// Service-role only. Never import from client code.
export const db = () =>
  createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
    auth: { persistSession: false },
  });

export const isUuid = (s: unknown): s is string =>
  typeof s === "string" && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(s);

// 120 writes a minute per visitor_id (events + impressions), counted in the database so it works across serverless instances.
export async function rateLimited(visitorId: string): Promise<boolean> {
  const since = new Date(Date.now() - 60_000).toISOString();
  const c = db();
  const [e, i] = await Promise.all([
    c.from("events").select("id", { count: "exact", head: true }).eq("visitor_id", visitorId).gte("created_at", since),
    c.from("impressions").select("id", { count: "exact", head: true }).eq("visitor_id", visitorId).gte("created_at", since),
  ]);
  return (e.count ?? 0) + (i.count ?? 0) >= 120;
}

// The session must exist and belong to the visitor (this also proves the visitor exists).
export async function sessionBelongsToVisitor(sessionId: string, visitorId: string): Promise<boolean> {
  const { data } = await db().from("sessions").select("id").eq("id", sessionId).eq("visitor_id", visitorId).maybeSingle();
  return !!data;
}
