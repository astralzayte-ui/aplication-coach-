#!/usr/bin/env python3
"""
Compress and inline TheMealDB recipe photos into src/data/photos.ts
Strategy: pick top N recipes per meal type, compress to 480px JPEG Q=72
Target: ~60 KB per image → 80 images = ~4.8 MB added to artifact
"""
import os, re, base64, json
from PIL import Image
from io import BytesIO

PLATS_DIR = "public/plats"
RECIPES_TS = "src/data/recipes_mealdb.ts"
PHOTOS_TS  = "src/data/photos.ts"
TARGET_W = 320
JPEG_Q   = 55
# 9999 = tout prendre
QUOTA = {"diner": 9999, "dejeuner": 9999, "gouter": 9999, "petit_dejeuner": 9999}

# ── Parse recipe IDs ─────────────────────────────────────────────────────────
raw = open(RECIPES_TS).read()
blocks = re.split(r'\n  \{', raw)[1:]
recipes = []
for block in blocks:
    id_m   = re.search(r'id: "([^"]+)"', block)
    type_m = re.search(r'mealType: "([^"]+)"', block)
    if id_m and type_m:
        recipes.append({"id": id_m.group(1), "type": type_m.group(1)})

print(f"Parsed {len(recipes)} recipes")

# ── Group by meal type, pick quota ────────────────────────────────────────────
by_type = {}
for r in recipes:
    by_type.setdefault(r["type"], []).append(r["id"])

selected = []
for t, ids in by_type.items():
    q = QUOTA.get(t, 0)
    # Pick first Q that have an image file
    added = 0
    for rid in ids:
        if added >= q:
            break
        path = os.path.join(PLATS_DIR, rid + ".jpg")
        if os.path.exists(path):
            selected.append((rid, path))
            added += 1

print(f"Selected {len(selected)} recipes to inline")

# ── Load existing photos.ts to keep the Moroccan hand-crafted ones ───────────
existing = open(PHOTOS_TS).read()
# Parse existing entries
existing_entries = {}
for m in re.finditer(r'"([^"]+)":\s*"(data:image[^"]+)"', existing):
    existing_entries[m.group(1)] = m.group(2)

print(f"Found {len(existing_entries)} existing inline photos")

# ── Compress and add new entries ──────────────────────────────────────────────
new_entries = dict(existing_entries)  # keep existing
total_kb = sum(len(v) * 3 // 4 // 1024 for v in existing_entries.values())
print(f"Existing inline total: ~{total_kb} KB")

compressed = 0
for rid, path in selected:
    if rid in new_entries:
        continue  # already inlined
    try:
        img = Image.open(path)
        if img.mode in ("RGBA", "P"):
            img = img.convert("RGB")
        # Resize to max TARGET_W on longest side
        w, h = img.size
        if w > TARGET_W or h > TARGET_W:
            ratio = TARGET_W / max(w, h)
            img = img.resize((int(w * ratio), int(h * ratio)), Image.LANCZOS)
        buf = BytesIO()
        img.save(buf, "JPEG", quality=JPEG_Q, optimize=True, progressive=True)
        data = base64.b64encode(buf.getvalue()).decode()
        uri = f"data:image/jpeg;base64,{data}"
        new_entries[rid] = uri
        compressed += 1
        if compressed % 20 == 0:
            kb_so_far = sum(len(v) * 3 // 4 // 1024 for v in new_entries.values())
            print(f"  {compressed} done … {kb_so_far} KB total inline")
    except Exception as e:
        print(f"  SKIP {rid}: {e}")

print(f"\nCompressed {compressed} new images")
total_kb = sum(len(v) * 3 // 4 // 1024 for v in new_entries.values())
print(f"New total inline: ~{total_kb} KB (~{total_kb//1024} MB)")

# ── Write photos.ts ───────────────────────────────────────────────────────────
lines = ["// AUTO-GENERATED — do not edit manually",
         "export const INLINE_PHOTOS: Record<string, string> = {"]
for k, v in new_entries.items():
    lines.append(f'  "{k}": "{v}",')
lines.append("}")

open(PHOTOS_TS, "w").write("\n".join(lines) + "\n")
print(f"Wrote {PHOTOS_TS} ({os.path.getsize(PHOTOS_TS)//1024} KB)")
