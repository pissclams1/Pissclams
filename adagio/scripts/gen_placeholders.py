# Generates procedural placeholder art (original, produced by this script) + seed.csv.
# Replace with real AI art before the real test: placeholders cannot answer the swipe question.
import numpy as np, random, csv, colorsys
from PIL import Image
W, H = 1080, 1350
cats = ["abstract", "landscape", "portrait", "surreal", "texture", "architecture"]
adj = ["Quiet", "Amber", "Slow", "Hollow", "Distant", "Velvet", "Pale", "Drifting", "Tidal", "Ember", "Still", "Glass"]
noun = ["Hours", "Garden", "Signal", "Harbor", "Orbit", "Field", "Bloom", "Static", "Dune", "Lantern", "Rain", "Echo"]
creators = ["Mira Lund", "Odo Vance", "Sable Kerr", "Juno Pike", "Ilan Roe", "Tess Marlow", "Kai Ostrov", "Neve Hart"]
tools = ["Midjourney", "Stable Diffusion", "Flux", "DALL-E", "ComfyUI"]
yy, xx = np.mgrid[0:H, 0:W].astype(np.float32)
xn, yn = xx / W, yy / H
def col(h, s, v): return np.array(colorsys.hsv_to_rgb(h % 1, s, v), dtype=np.float32)
rows = []
for i in range(300):
    r = random.Random(i); c = cats[i % len(cats)]
    h0 = r.random(); pal = [col(h0 + k * r.choice([.08, .15, .33]), r.uniform(.4, .85), r.uniform(.25, .95)) for k in range(4)]
    f = np.zeros((H, W), np.float32)
    for _ in range(4):
        a, b, p = r.uniform(1, 6), r.uniform(1, 6), r.uniform(0, 6.28)
        f += np.sin(a * 6.28 * xn + b * 6.28 * yn * r.choice([1, -1]) + p + np.sin(r.uniform(1, 4) * 6.28 * yn) * r.uniform(0, 2))
    if c == "landscape": f += (yn * 6)
    if c == "portrait": f += 3 * np.exp(-(((xn - .5) / .25) ** 2 + ((yn - .45) / .32) ** 2))
    if c == "architecture": f = np.floor(f * 1.5) / 1.5 + (np.floor(xn * 8) % 2)
    f = (f - f.min()) / (np.ptp(f) + 1e-6)
    idx = f * 3; lo = np.clip(idx.astype(int), 0, 2); t = (idx - lo)[..., None]
    P = np.stack(pal); img = P[lo] * (1 - t) + P[lo + 1] * t
    grain = np.random.RandomState(i).normal(0, .02, (H, W, 1)).astype(np.float32)
    vig = 1 - .35 * ((xn - .5) ** 2 + (yn - .5) ** 2)[..., None]
    out = np.clip((img + grain) * vig, 0, 1)
    Image.fromarray((out * 255).astype(np.uint8)).save(f"public/seed/{i:03d}.webp", quality=68, method=4)
    rows.append([f"{r.choice(adj)} {r.choice(noun)} {i + 1}", creators[i % len(creators)], r.choice(tools),
                 str(r.random() < .35).lower(), c, f"{i:03d}.webp"])
with open("seed.csv", "w", newline="") as fh:
    w = csv.writer(fh); w.writerow(["title", "creator_name", "tools", "commercial_ok", "category", "filename"]); w.writerows(rows)
