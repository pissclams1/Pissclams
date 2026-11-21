// Usage: npm run seed -- [dir] [--dry-run] [--deactivate-others]
//   dir  folder holding seed.csv and the .webp files (default: ./seed)
// Needs NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY (not required for --dry-run).
// Idempotent: re-running updates rows in place (keyed on image URL) and re-uploads files.
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { createClient } from "@supabase/supabase-js";
import { validateSeed } from "../lib/seed";

const args = process.argv.slice(2);
const dry = args.includes("--dry-run");
const deactivate = args.includes("--deactivate-others");
const dir = args.find((a) => !a.startsWith("--")) ?? "seed";
const BUCKET = "art";

async function main() {
  const csvPath = join(dir, "seed.csv");
  if (!existsSync(csvPath)) throw new Error(`${csvPath} not found`);
  const { rows, errors } = validateSeed(readFileSync(csvPath, "utf8"), (f) => existsSync(join(dir, f)));

  // one creator = one portfolio/email; conflicting values across rows are an error
  const creators = new Map<string, { portfolio_url: string | null; contact_email: string | null }>();
  for (const r of rows) {
    const prev = creators.get(r.creator_name);
    if (!prev) { creators.set(r.creator_name, { portfolio_url: r.portfolio_url, contact_email: r.contact_email }); continue; }
    for (const k of ["portfolio_url", "contact_email"] as const) {
      if (r[k] && prev[k] && r[k] !== prev[k]) errors.push(`creator "${r.creator_name}" has conflicting ${k} values`);
      prev[k] = prev[k] ?? r[k];
    }
  }
  if (errors.length) { console.error(errors.join("\n")); process.exit(1); }
  console.log(`${rows.length} creations, ${creators.size} creators validated.`);
  if (dry) { console.log("dry run: nothing uploaded or written."); return; }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL, key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY");
  const sb = createClient(url, key, { auth: { persistSession: false } });

  const b = await sb.storage.createBucket(BUCKET, { public: true });
  if (b.error && !/already exists/i.test(b.error.message)) throw b.error;

  const { data: cs, error: ce } = await sb.from("creators")
    .upsert([...creators].map(([name, v]) => ({ name, ...v })), { onConflict: "name" }).select("id,name");
  if (ce) throw ce;
  const creatorId = new Map(cs!.map((c) => [c.name, c.id]));

  const urls: string[] = [];
  for (const r of rows) {
    const up = await sb.storage.from(BUCKET).upload(r.filename, readFileSync(join(dir, r.filename)), { contentType: "image/webp", upsert: true });
    if (up.error) throw up.error;
    const image_url = sb.storage.from(BUCKET).getPublicUrl(r.filename).data.publicUrl;
    urls.push(image_url);
    const { error } = await sb.from("creations").upsert({
      title: r.title, creator_name: r.creator_name, creator_id: creatorId.get(r.creator_name),
      tools: r.tools, commercial_ok: r.commercial_ok, category: r.category, image_url, active: true,
    }, { onConflict: "image_url" });
    if (error) throw error;
    console.log("loaded", r.title);
  }
  if (deactivate) {
    const { error } = await sb.from("creations").update({ active: false }).not("image_url", "in", `(${urls.map((u) => `"${u}"`).join(",")})`);
    if (error) throw error;
    console.log("deactivated all other creations");
  }
}
main().catch((e) => { console.error(e.message ?? e); process.exit(1); });
