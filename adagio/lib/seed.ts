// Pure helpers for the seed loader: CSV parsing and row validation. No I/O, so they are unit-tested.
export const SEED_COLUMNS = ["title", "creator_name", "tools", "commercial_ok", "category", "filename"] as const;
export const OPTIONAL_COLUMNS = ["portfolio_url", "contact_email"] as const;

export type SeedRow = {
  title: string; creator_name: string; tools: string | null; commercial_ok: boolean;
  category: string | null; filename: string; portfolio_url: string | null; contact_email: string | null;
};

export function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [], cur = "", q = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (q) {
      if (ch === '"') { if (text[i + 1] === '"') { cur += '"'; i++; } else q = false; } else cur += ch;
    } else if (ch === '"') q = true;
    else if (ch === ",") { row.push(cur); cur = ""; }
    else if (ch === "\n" || ch === "\r") {
      if (ch === "\r" && text[i + 1] === "\n") i++;
      row.push(cur); cur = "";
      if (row.some((c) => c.trim() !== "")) rows.push(row);
      row = [];
    } else cur += ch;
  }
  if (cur !== "" || row.length) { row.push(cur); if (row.some((c) => c.trim() !== "")) rows.push(row); }
  return rows;
}

export type ValidateResult = { rows: SeedRow[]; errors: string[] };

export function validateSeed(text: string, fileExists: (filename: string) => boolean): ValidateResult {
  const errors: string[] = [];
  const [head, ...body] = parseCsv(text);
  if (!head) return { rows: [], errors: ["seed.csv is empty"] };
  const cols = head.map((h) => h.trim());
  for (const c of SEED_COLUMNS) if (!cols.includes(c)) errors.push(`missing column: ${c}`);
  if (errors.length) return { rows: [], errors };
  const rows: SeedRow[] = [];
  const seen = new Set<string>();
  body.forEach((r, i) => {
    const line = i + 2;
    const g = (k: string) => (r[cols.indexOf(k)] ?? "").trim();
    const title = g("title"), creator = g("creator_name"), filename = g("filename");
    const ok = g("commercial_ok").toLowerCase();
    if (!title) errors.push(`line ${line}: title is required`);
    if (!creator) errors.push(`line ${line}: creator_name is required`);
    if (!filename) errors.push(`line ${line}: filename is required`);
    else if (!/\.webp$/i.test(filename)) errors.push(`line ${line}: ${filename} must be a .webp file`);
    else if (!fileExists(filename)) errors.push(`line ${line}: file not found: ${filename}`);
    else if (seen.has(filename)) errors.push(`line ${line}: duplicate filename ${filename}`);
    seen.add(filename);
    if (!["true", "false", ""].includes(ok)) errors.push(`line ${line}: commercial_ok must be true or false`);
    const url = cols.includes("portfolio_url") ? g("portfolio_url") : "";
    if (url && !/^https?:\/\/\S+$/i.test(url)) errors.push(`line ${line}: portfolio_url must start with http:// or https://`);
    const email = cols.includes("contact_email") ? g("contact_email") : "";
    if (email && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) errors.push(`line ${line}: contact_email is not an email address`);
    rows.push({
      title, creator_name: creator, tools: g("tools") || null, commercial_ok: ok === "true",
      category: g("category") || null, filename, portfolio_url: url || null, contact_email: email || null,
    });
  });
  if (!rows.length && !errors.length) errors.push("seed.csv has no rows");
  return { rows, errors };
}
