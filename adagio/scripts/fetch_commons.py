# Collects public-domain / CC0 AI-generated images from Wikimedia Commons.
# Usage: python3 scripts/fetch_commons.py   -> writes public/seed/*.webp, seed.csv, PERMISSIONS.md
import json, time, re, io, csv, html, urllib.request, urllib.parse
from PIL import Image
UA = "AdagioSeedBot/0.1 (art gallery prototype; contact via repo owner)"
TARGET = 320
SRC = {  # category -> Adagio category
    "AI-generated images by artstyle": "abstract", "AI-generated images by genre": "surreal",
    "AI-generated images by subject": "landscape", "Colorful AI-generated images": "abstract",
    "AI-generated textures": "texture", "AI-generated images by software": "portrait",
    "AI-generated images": "surreal", "AI-generated images including prompts": "architecture",
}
OK = re.compile(r"^(cc0|public domain|pd[- ])", re.I)

def get(url, binary=False):
    for d in (3, 10, 30, 90):
        try:
            data = urllib.request.urlopen(urllib.request.Request(url, headers={"User-Agent": UA}), timeout=60).read()
            time.sleep(3)
            return data if binary else json.loads(data)
        except Exception as e:
            print("retry", d, str(e)[:50], flush=True); time.sleep(d)
    return None

def strip(s): return re.sub(r"\s+", " ", html.unescape(re.sub(r"<[^>]+>", "", s or ""))).strip()

cands, seen = [], set()
for cat, mapped in SRC.items():
    cont = {}
    for _ in range(6):
        q = dict(action="query", generator="categorymembers", gcmtitle=f"Category:{cat}", gcmtype="file", gcmlimit=50,
                 prop="imageinfo", iiprop="url|size|mime|extmetadata", iiurlwidth=1080, format="json", **cont)
        r = get("https://commons.wikimedia.org/w/api.php?" + urllib.parse.urlencode(q))
        if not r: break
        for p in r.get("query", {}).get("pages", {}).values():
            ii = (p.get("imageinfo") or [{}])[0]; md = ii.get("extmetadata", {})
            lic = md.get("LicenseShortName", {}).get("value", "")
            if p["title"] in seen or not OK.match(lic): continue
            if ii.get("mime") not in ("image/jpeg", "image/png", "image/webp"): continue
            if ii.get("width", 0) < 900 or ii.get("height", 0) < 900 or not ii.get("thumburl"): continue
            seen.add(p["title"])
            cands.append(dict(title=p["title"][5:].rsplit(".", 1)[0], page=ii["descriptionurl"], thumb=ii["thumburl"], lic=lic,
                              artist=strip(md.get("Artist", {}).get("value", ""))[:60] or "Unknown", cat=mapped))
        print(cat, len(cands), flush=True)
        if "continue" not in r or len(cands) >= TARGET * 1.3: break
        cont = {k: v for k, v in r["continue"].items()}
    if len(cands) >= TARGET * 1.3: break

rows, log, n = [], [], 0
for c in cands:
    if n >= TARGET: break
    b = get(c["thumb"], binary=True)
    if not b: continue
    try:
        im = Image.open(io.BytesIO(b)).convert("RGB")
        im.thumbnail((1080, 1600)); fn = f"{n:03d}.webp"; im.save(f"public/seed/{fn}", quality=72, method=4)
    except Exception as e:
        print("skip", c["title"], e); continue
    title = re.sub(r"[_]+", " ", c["title"])[:70]
    rows.append([title, c["artist"], "AI (see source)", "false", c["cat"], fn])
    log.append(f"| `{fn}` | {c['page']} | {c['lic']} | {c['artist']} |")
    n += 1
with open("seed.csv", "w", newline="") as fh:
    w = csv.writer(fh); w.writerow(["title", "creator_name", "tools", "commercial_ok", "category", "filename"]); w.writerows(rows)
open("PERMISSIONS.md", "w").write("# Image permissions log\n\nAll images are AI-generated files on Wikimedia Commons whose license field reads CC0 or Public domain at fetch time. Resized to 1080px wide WebP. Re-verify the license on each source page before launch; some PD claims on Commons are US-only.\n\n| File | Source page | License | Author per Commons |\n| --- | --- | --- | --- |\n" + "\n".join(log) + "\n")
print("done", n)
