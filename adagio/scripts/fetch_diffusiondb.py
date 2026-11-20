# Placeholder art: CC0 1.0 DiffusionDB images via the Hugging Face datasets-server.
# Run from a staging dir that contains public/seed/. Writes webp files, seed.csv, PERMISSIONS.md.
import io, csv, json, time, random, urllib.request, urllib.parse
from PIL import Image
DS = "whosouravsharma/text-to-image-diffusiondb-2M"  # copy of poloclub/diffusiondb (CC0 1.0)
TARGET = 300
CATS = ["abstract", "landscape", "portrait", "surreal", "texture", "architecture"]
def get(url, binary=False):
    for d in (2, 8, 30, 90):
        try:
            data = urllib.request.urlopen(urllib.request.Request(url, headers={"User-Agent": "AdagioSeed/0.1"}), timeout=60).read()
            return data if binary else json.loads(data)
        except Exception as e:
            print("retry", d, str(e)[:60], flush=True); time.sleep(d)
rows, log, n, rng = [], [], 0, random.Random(7)
offsets = rng.sample(range(0, 40000, 100), 40)
for off in offsets:
    if n >= TARGET: break
    q = urllib.parse.urlencode(dict(dataset=DS, config="default", split="train", offset=off, length=100))
    r = get("https://datasets-server.huggingface.co/rows?" + q)
    if not r: continue
    for item in r["rows"]:
        if n >= TARGET: break
        x = item["row"]; w, h = x["width"], x["height"]
        if (x.get("image_nsfw") or 0) > 0.15 or (x.get("prompt_nsfw") or 0) > 0.15: continue
        if not (0.6 <= w / h <= 1.6) or min(w, h) < 448: continue
        b = get(x["image"]["src"], binary=True)
        if not b: continue
        try:
            im = Image.open(io.BytesIO(b)).convert("RGB"); im.thumbnail((1080, 1600))
            fn = f"{n:03d}.webp"; im.save(f"public/seed/{fn}", quality=78, method=4)
        except Exception as e:
            print("skip", e); continue
        rows.append([f"Placeholder {n + 1:03d}", "Placeholder", "Stable Diffusion", "false", CATS[n % 6], fn])
        log.append(f"| `{fn}` | {DS} row {item['row_idx']} (DiffusionDB part {x.get('part_id')}) | CC0 1.0 |")
        n += 1
    print("offset", off, "have", n, flush=True)
with open("seed.csv", "w", newline="") as fh:
    w = csv.writer(fh); w.writerow(["title", "creator_name", "tools", "commercial_ok", "category", "filename"]); w.writerows(rows)
open("PERMISSIONS.md", "w").write("# Image permissions log\n\nPlaceholder art only. Images are Stable Diffusion outputs from the DiffusionDB dataset (poloclub/diffusiondb), released under CC0 1.0. Filtered for low NSFW scores; prompts and any artist names in them are not shown. Remove these rows as real creator uploads arrive.\n\n| File | Source | License |\n| --- | --- | --- |\n" + "\n".join(log) + "\n")
print("done", n)
