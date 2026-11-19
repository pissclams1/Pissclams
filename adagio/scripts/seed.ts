// Usage: npm run seed -- ./seed.csv ./images
// seed.csv columns: title,creator_name,tools,commercial_ok,category,filename
import { readFileSync } from "node:fs";
import { createClient } from "@supabase/supabase-js";

const [csvPath, imgDir] = process.argv.slice(2);
if (!csvPath || !imgDir) throw new Error("usage: seed <seed.csv> <images-dir>");
const url = process.env.NEXT_PUBLIC_SUPABASE_URL!, key = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const sb = createClient(url, key, { auth: { persistSession: false } });
const BUCKET = "art";

function parseCsv(text: string): Record<string, string>[] {
  const rows: string[][] = []; let row: string[] = [], cur = "", q = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (q) { if (ch === '"') { if (text[i + 1] === '"') { cur += '"'; i++; } else q = false; } else cur += ch; }
    else if (ch === '"') q = true;
    else if (ch === ",") { row.push(cur); cur = ""; }
    else if (ch === "\n" || ch === "\r") { if (ch === "\r" && text[i + 1] === "\n") i++; row.push(cur); cur = ""; if (row.some(Boolean)) rows.push(row); row = []; }
    else cur += ch;
  }
  if (cur || row.length) { row.push(cur); rows.push(row); }
  const [head, ...rest] = rows;
  return rest.map((r) => Object.fromEntries(head.map((h, i) => [h.trim(), (r[i] ?? "").trim()])));
}

(async () => {
  await sb.storage.createBucket(BUCKET, { public: true }).catch(() => {});
  const rows = parseCsv(readFileSync(csvPath, "utf8"));
  for (const r of rows) {
    const path = r.filename;
    const up = await sb.storage.from(BUCKET).upload(path, readFileSync(`${imgDir}/${path}`), { contentType: "image/webp", upsert: true });
    if (up.error) throw up.error;
    const image_url = sb.storage.from(BUCKET).getPublicUrl(path).data.publicUrl;
    const { error } = await sb.from("creations").insert({
      title: r.title, creator_name: r.creator_name, tools: r.tools || null,
      commercial_ok: r.commercial_ok === "true", category: r.category || null, image_url,
    });
    if (error) throw error;
    console.log("seeded", r.title);
  }
})();
