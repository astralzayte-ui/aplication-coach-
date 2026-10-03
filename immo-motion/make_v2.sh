#!/usr/bin/env bash
# make_v2.sh : assemblage de bout en bout de la story ImmoClap v2 (9,5 s, 1080x1920, 30 i/s).
#
#   cd /home/user/aplication-coach-/immo-motion && ./make_v2.sh [options]
#
# Étapes (toutes les valeurs viennent de timeline_v2.json, jamais modifié) :
#   0. voix Sulafat   : gen_voice_v2.py, SAUF si audio/voice_v2.wav existe déjà (quota Gemini ménagé)
#   1. audio          : build_audio_v2.py -> audio/mix_v2.wav (hors ligne, déterministe, ~10 s)
#   2. fonds vidéo    : build/demo_bg_v2.mp4 (demo_segments, 2,0-7,0 s) et build/cta_bg_v2.mp4 (cta_bg, 7,0-9,5 s)
#                       coupes exactes, 30 i/s, 1080x1920 (les pistes audio des clips Veo sont ignorées)
#   3. overlay        : node render_v2.js overlay -> build/frames_overlay_v2/*.png (PNG transparents ; cache par empreinte)
#   4. composition    : fond #0F0D0A 9,5 s + clips aux bons instants + overlay + audio/mix_v2.wav
#                       -> final/ImmoClap_story_v2.mp4 (libx264 crf 17, yuv420p, 30 i/s, aac 192k, faststart, 9,5 s)
#   5. planche        : build/v2_sheet.jpg (25 images : une toutes les 0,4 s + la dernière image)
#   6. contrôles      : ffprobe, faststart, cropdetect (échoue si une exigence n'est pas tenue)
#
# Options :
#   --keep-voice    ne jamais appeler Gemini : réutilise audio/voice_v2.wav (erreur s'il n'existe pas).
#                   C'est déjà le comportement par défaut quand le fichier existe.
#   --regen-voice   force une nouvelle synthèse de la voix (appelle l'API Gemini TTS)
#   --transcribe    fait aussi transcrire le mix par Gemini (1 appel texte) pour contrôler le texte dit
#   --skip-audio    n'exécute pas build_audio_v2.py (utilise audio/mix_v2.wav tel quel)
#   --force-audio   reconstruit l'audio même s'il est à jour
#   --force-frames  rerend les images overlay même si le cache est valide
#   --no-video-fx   pas de punch-zoom / poussée lente sur les clips (coupes sèches, sans mouvement ajouté)
#   -h, --help      cette aide
#
# Idempotent : relancer sans rien changer ne refait que les étapes peu coûteuses (clips, composition, planche, contrôles).
# Prérequis : ffmpeg (libx264, libfreetype), ffprobe, node + playwright global, python3 (numpy, scipy).
set -euo pipefail
SELF="$(readlink -f "${BASH_SOURCE[0]}")"
cd "$(dirname "$SELF")"
export LC_ALL=C

KEEP_VOICE=0; REGEN_VOICE=0; TRANSCRIBE=0; SKIP_AUDIO=0; FORCE_AUDIO=0; FORCE_FRAMES=0; VIDEO_FX=1
for a in "$@"; do
  case "$a" in
    --keep-voice)   KEEP_VOICE=1 ;;
    --regen-voice)  REGEN_VOICE=1 ;;
    --transcribe)   TRANSCRIBE=1 ;;
    --skip-audio)   SKIP_AUDIO=1 ;;
    --force-audio)  FORCE_AUDIO=1 ;;
    --force-frames) FORCE_FRAMES=1 ;;
    --no-video-fx)  VIDEO_FX=0 ;;
    -h|--help)      sed -n '2,29p' "$SELF" | sed 's/^# \{0,1\}//'; exit 0 ;;
    *) echo "option inconnue : $a (voir --help)" >&2; exit 2 ;;
  esac
done
[ "$KEEP_VOICE" = 1 ] && [ "$REGEN_VOICE" = 1 ] && { echo "--keep-voice et --regen-voice sont incompatibles" >&2; exit 2; }

OUT_MP4=final/ImmoClap_story_v2.mp4
FRAMES=build/frames_overlay_v2
FILT=build/v2_filters
SHEET=build/v2_sheet.jpg
log(){ printf '\n\033[1m== %s\033[0m\n' "$*"; }
die(){ echo "ERREUR : $*" >&2; exit 1; }
trap 'echo "ERREUR (ligne $LINENO) : $BASH_COMMAND" >&2' ERR
FF=(ffmpeg -y -hide_banner -nostdin -v warning -stats)

for c in ffmpeg ffprobe node python3; do command -v "$c" >/dev/null || die "$c introuvable"; done
for f in timeline_v2.json overlay_v2.html render_v2.js clips/villa.mp4 clips/penthouse.mp4 fonts/fonts.css; do
  [ -s "$f" ] || die "fichier d'entrée manquant : $f"
done
mkdir -p build final "$FILT"
T0=$(date +%s)

# ───────────────────────── 0. voix (Gemini TTS) : on ménage le quota ─────────────────────────
log "0/6 voix Sulafat"
voice_ready(){ [ -s audio/voice_v2.wav ] && [ -s audio/s1_v2.wav ] && [ -s audio/s2_v2.wav ] && [ -s audio/s3_v2.wav ] && [ -s audio/voice_v2_takes.json ]; }
if [ "$REGEN_VOICE" = 1 ]; then
  echo "synthèse demandée (--regen-voice) : appel à l'API Gemini TTS"
  python3 gen_voice_v2.py
elif [ -s audio/voice_v2.wav ]; then
  if voice_ready; then
    echo "audio/voice_v2.wav existe : voix réutilisée, aucun appel Gemini"
  else
    echo "audio/voice_v2.wav existe mais pas les phrases découpées : redécoupage hors ligne (--reuse --no-verify)"
    python3 gen_voice_v2.py --reuse --no-verify
  fi
elif [ "$KEEP_VOICE" = 1 ]; then
  die "--keep-voice demandé mais audio/voice_v2.wav n'existe pas"
else
  echo "audio/voice_v2.wav absent : première synthèse (API Gemini TTS)"
  python3 gen_voice_v2.py
fi
voice_ready || die "voix incomplète après l'étape 0"

# ───────────────────────── 1. audio : musique + bruitages + voix -> mix_v2.wav ─────────────────────────
log "1/6 mixage audio"
audio_stale(){
  [ ! -s audio/mix_v2.wav ] && return 0
  local f; for f in build_audio_v2.py gen_voice_v2.py timeline_v2.json audio/s1_v2.wav audio/s2_v2.wav audio/s3_v2.wav audio/voice_v2_takes.json; do
    [ "$f" -nt audio/mix_v2.wav ] && return 0
  done
  return 1
}
if [ "$SKIP_AUDIO" = 1 ]; then
  [ -s audio/mix_v2.wav ] || die "--skip-audio mais audio/mix_v2.wav n'existe pas"
  echo "--skip-audio : audio/mix_v2.wav utilisé tel quel"
elif [ "$FORCE_AUDIO" = 1 ] || [ "$TRANSCRIBE" = 1 ] || audio_stale; then
  python3 build_audio_v2.py $([ "$TRANSCRIBE" = 1 ] && echo --transcribe)
else
  echo "audio/mix_v2.wav est à jour (--force-audio pour le reconstruire)"
fi
[ -s audio/mix_v2.wav ] || die "audio/mix_v2.wav manquant"

# ───────────────────────── plan : filtres ffmpeg générés depuis timeline_v2.json ─────────────────────────
python3 - "$VIDEO_FX" "$FILT" <<'PY'
import json, sys
FX = sys.argv[1] == "1"; D = sys.argv[2]
TL = json.load(open("timeline_v2.json"))
FPS, TOT = TL["fps"], TL["total"]
NF = round(TOT * FPS)
CLIPS = ["villa", "penthouse"]                      # ordre des entrées -i : 0 = villa, 1 = penthouse
D0, D1 = TL["scenes"]["demo"]; C0, C1 = TL["scenes"]["cta"]
SC = "scale=1080:1920:flags=lanczos+accurate_rnd+full_chroma_int,setsar=1"

import re, subprocess
def src_fps(clip):
    r = subprocess.check_output(["ffprobe", "-v", "error", "-select_streams", "v:0", "-show_entries", "stream=r_frame_rate",
                                 "-of", "csv=p=0", f"clips/{clip}.mp4"], text=True).strip().split("/")
    return float(r[0]) / float(r[1])
CUTS_SRC = {}
def real_cuts(clip):   # instants (s) de la 1re image de chaque nouveau plan dans le clip source (select scene, comme dans le skill)
    if clip not in CUTS_SRC:
        p = subprocess.run(["ffmpeg", "-hide_banner", "-nostdin", "-v", "info", "-i", f"clips/{clip}.mp4", "-an",
                            "-vf", "select='gt(scene,0.18)',metadata=print:file=-", "-f", "null", "-"], capture_output=True, text=True)
        CUTS_SRC[clip] = [float(x) for x in re.findall(r"pts_time:([\d.]+)", p.stdout + p.stderr)]
    return CUTS_SRC[clip]

def chain(clip, a, b, lab):
    if clip not in CLIPS: raise SystemExit(f"clip inconnu dans la timeline : {clip}")
    n = round((b - a) * FPS)
    # coupe exacte : si une coupure réelle de la source tombe dans la dernière (ou la première) image source du segment,
    # on arrête avant elle (ou on démarre sur elle) : aucune image du plan voisin ne fuit ; l'image manquante est clonée.
    fs = 1.0 / src_fps(clip); a2, b2 = a, b; note = ""
    for c in real_cuts(clip):
        if b - fs - 1e-6 < c < b - 1e-6: b2 = c; note += f" fin {b}->{c:.4f}"
        elif a + fs + 1e-6 < c <= a + 2 * fs + 1e-6 and a2 == a: a2 = c; note += f" début {a}->{c:.4f}"
        elif a + 2 * fs + 1e-6 < c < b - fs - 1e-6: note += f" [coupure interne source à {c:.3f}]"
    if note: print(f"  segment {clip} {a}-{b} : coupure réelle de la source :{note}")
    # trim (source 24 i/s) -> grille 30 i/s -> exactement n images (clone de la dernière si besoin)
    return (f"[{CLIPS.index(clip)}:v]trim=start={a2}:end={b2},setpts=PTS-STARTPTS,fps={FPS},{SC},"
            f"tpad=stop_mode=clone:stop=3,trim=end_frame={n},setpts=PTS-STARTPTS[{lab}]"), n

# 1) fonds propres, coupes exactes
segs = TL["demo_segments"]; parts = []; nfr = 0
for i, (clip, a, b) in enumerate(segs):
    c, n = chain(clip, a, b, f"s{i}"); parts.append(c); nfr += n
assert abs(sum(b - a for _, a, b in segs) - (D1 - D0)) < 1e-6, "demo_segments != durée de la scène démo"
open(f"{D}/demo.txt", "w").write(";".join(parts) + ";" + "".join(f"[s{i}]" for i in range(len(segs))) +
                                  f"concat=n={len(segs)}:v=1:a=0,format=yuv420p[v]")
cc, ca, cb = TL["cta_bg"]
assert cb - ca >= (C1 - C0) - 1e-6, "cta_bg plus court que la scène CTA"
c, ncta = chain(cc, ca, ca + (C1 - C0), "c")
open(f"{D}/cta.txt", "w").write(c.replace("[c]", "") + ",format=yuv420p[v]")
json.dump({"demo_frames": nfr, "cta_frames": ncta, "total_frames": NF}, open(f"{D}/counts.json", "w"))

# 2) composition : yuv420p (BT.709 supposé, clips non étiquetés) -> RGB planaire -> overlay -> yuv420p BT.709
TO_RGB = "scale=in_range=tv:in_color_matrix=bt709:flags=bicubic+accurate_rnd+full_chroma_int,format=gbrp"
PUN, PUN_K, PUN_LEN, PUSH, DRIFT = 0.07, 7.5, 0.7, 0.035, 14.0      # mêmes constantes que la doublure « full » de overlay_v2.html
PUSH_CTA = 0.07     # CTA : poussée 1.00 -> 1.07 sur 2,5 s (le plan crépuscule est quasi fixe : sans cela l'image reste statique > 1 s)

def fx(seg_starts, push=PUSH):  # seg_starts : [(t_debut_local, durée)] ; renvoie (zoom, dérive) en fonction de t (s dans le clip)
    z = d = None; items = []
    for t0, du in seg_starts:
        a = f"(t-{t0})"
        items.append((t0 + du, f"(1+{PUN}*exp(-{PUN_K}*{a})*lt({a},{PUN_LEN}))*(1+{push}*{a}/{du})", f"{DRIFT}*{a}/{du}"))
    def pw(k):
        s = items[-1][k]
        for it in reversed(items[:-1]): s = f"if(lt(t,{it[0]}),{it[k]},{s})"
        return s
    return pw(1), pw(2)

def video(inp, seg_starts, shift, lab, push=PUSH):
    if not FX:
        return f"[{inp}:v]{TO_RGB},setpts=PTS+{shift}/TB[{lab}]"
    z, d = fx(seg_starts, push)
    return (f"[{inp}:v]{TO_RGB},scale=w='2*trunc(1080*({z})/2)':h='2*trunc(1920*({z})/2)':eval=frame:flags=bicubic,"
            f"crop=w=1080:h=1920:x='(iw-1080)/2+({d})':y='(ih-1920)/2',setsar=1,setpts=PTS+{shift}/TB[{lab}]")

demo_starts = []; p = 0.0
for _, a, b in segs: demo_starts.append((p, b - a)); p += b - a
g = [f"color=c=0x0F0D0A:s=1080x1920:r={FPS}:d={TOT},format=gbrp[base]"]
# entrées : 0 = demo_bg_v2.mp4, 1 = cta_bg_v2.mp4, 2 = PNG overlay, 3 = mix audio
g.append(video(0, demo_starts, D0, "demo"))
g.append(video(1, [(0.0, C1 - C0)], C0, "cta", PUSH_CTA))
g.append("[2:v]format=gbrap[ov]")      # surtout pas de setpts=PTS-STARTPTS ici : avec ffmpeg 6.1 il décale l'overlay (x1,5) après l'image 60
g.append("[base][demo]overlay=format=gbrp:eof_action=pass[b1]")
g.append("[b1][cta]overlay=format=gbrp:eof_action=pass[b2]")
g.append("[b2][ov]overlay=format=gbrp:eof_action=pass,"
         "scale=in_range=pc:out_range=tv:out_color_matrix=bt709:flags=lanczos+accurate_rnd+full_chroma_int,format=yuv420p[v]")
open(f"{D}/compose.txt", "w").write(";".join(g))

# 3) planche de contrôle : une image toutes les 0,4 s (n multiple de 12) + la dernière image = 25 images
step = round(0.4 * FPS)
label = r"%{eif\:floor(t)\:d}.%{eif\:floor(t*10+0.02)-10*floor(t)\:d} s"
open(f"{D}/sheet.txt", "w").write(
    f"select='not(mod(n,{step}))+eq(n,{NF-1})',scale=288:512:flags=lanczos+accurate_rnd+full_chroma_int:in_range=tv:in_color_matrix=bt709,format=rgb24,"
    f"drawtext=fontfile=fonts/JTUHjIg1_i6t8kCHKm4532VJOt5-QNFgpCu170w-.ttf:text='{label}':x=8:y=8:fontsize=22:"
    f"fontcolor=white:box=1:boxcolor=black@0.6:boxborderw=5,tile=5x5:padding=6:margin=6:color=0x1a1612")
print(f"plan : démo {nfr} i, cta {ncta} i, total {NF} i, effets vidéo {'oui' if FX else 'non'}")
PY

# ───────────────────────── 2. fonds vidéo (coupes exactes) ─────────────────────────
log "2/6 fonds vidéo : demo_bg_v2.mp4 + cta_bg_v2.mp4"
X264_TMP=(-c:v libx264 -preset medium -crf 10 -pix_fmt yuv420p -r 30 -an -colorspace bt709 -color_primaries bt709 -color_trc bt709 -color_range tv -movflags +faststart)
"${FF[@]}" -i clips/villa.mp4 -i clips/penthouse.mp4 -filter_complex "$(<"$FILT/demo.txt")" -map '[v]' "${X264_TMP[@]}" build/demo_bg_v2.mp4
"${FF[@]}" -i clips/villa.mp4 -i clips/penthouse.mp4 -filter_complex "$(<"$FILT/cta.txt")"  -map '[v]' "${X264_TMP[@]}" build/cta_bg_v2.mp4
python3 - <<'PY'
import json, subprocess
c = json.load(open("build/v2_filters/counts.json"))
for f, k in (("build/demo_bg_v2.mp4", "demo_frames"), ("build/cta_bg_v2.mp4", "cta_frames")):
    o = subprocess.check_output(["ffprobe", "-v", "error", "-count_frames", "-select_streams", "v:0",
        "-show_entries", "stream=width,height,r_frame_rate,nb_read_frames,pix_fmt", "-of", "json", f])
    s = json.loads(o)["streams"][0]
    ok = (s["width"], s["height"], s["r_frame_rate"], int(s["nb_read_frames"])) == (1080, 1920, "30/1", c[k])
    print(f"{f}: {s['width']}x{s['height']} {s['r_frame_rate']} {s['nb_read_frames']} images (attendu {c[k]}) {s['pix_fmt']} -> {'OK' if ok else 'ERREUR'}")
    if not ok: raise SystemExit(1)
PY

# ───────────────────────── 3. overlay PNG transparents (Chromium) ─────────────────────────
log "3/6 images overlay (render_v2.js overlay)"
export PW_PATH="${PW_PATH:-$(npm root -g)/playwright}"
NF=$(python3 -c "import json;t=json.load(open('timeline_v2.json'));print(round(t['total']*t['fps']))")
if [ ! -s build/bg_hook.jpg ]; then   # fond du hook : produit à part (non versionné) ; repli approché si absent
  echo "ATTENTION : build/bg_hook.jpg absent, régénéré approximativement depuis photos/05_salon_paris.jpg"
  "${FF[@]}" -i photos/05_salon_paris.jpg -vf "scale=-2:2100:flags=lanczos,eq=saturation=0.18:brightness=-0.16:contrast=1.05" -q:v 2 build/bg_hook.jpg
fi
STAMP=$( { sha256sum overlay_v2.html render_v2.js timeline_v2.json fonts/fonts.css build/bg_hook.jpg photos/*.jpg; } | sha256sum | cut -d' ' -f1)
have=$({ find "$FRAMES" -maxdepth 1 -name '*.png' 2>/dev/null || true; } | wc -l)
if [ "$FORCE_FRAMES" = 0 ] && [ "$have" = "$NF" ] && [ "$(cat "$FRAMES/.stamp" 2>/dev/null)" = "$STAMP" ]; then
  echo "$have images déjà rendues et à jour (--force-frames pour refaire)"
else
  rm -rf "$FRAMES"; mkdir -p "$FRAMES"
  node render_v2.js overlay "$FRAMES"
  have=$(find "$FRAMES" -maxdepth 1 -name '*.png' | wc -l)
  [ "$have" = "$NF" ] || die "$have images rendues, $NF attendues"
  echo "$STAMP" > "$FRAMES/.stamp"
fi
# Chromium écrit les PNG entièrement opaques (le hook) en RGB sans alpha et les autres en RGBA : ffmpeg réinitialise alors
# tout le graphe de filtres à la 1re image RGBA (images 60-61 perdues, overlay décalé). On force donc RGBA partout.
python3 - "$FRAMES" <<'PYN'
import glob, subprocess, sys
from concurrent.futures import ThreadPoolExecutor
fs = sorted(glob.glob(sys.argv[1] + "/*.png"))
bad = [f for f in fs if open(f, "rb").read(26)[25] != 6]        # octet 25 de l'en-tête PNG = type de couleur (6 = RGBA)
def fix(f):
  subprocess.run(["ffmpeg", "-y", "-hide_banner", "-nostdin", "-v", "error", "-i", f, "-pix_fmt", "rgba", f + ".tmp.png"], check=True)
  subprocess.run(["mv", f + ".tmp.png", f], check=True)
with ThreadPoolExecutor(4) as ex: list(ex.map(fix, bad))
print(f"PNG sans canal alpha convertis en RGBA : {len(bad)} / {len(fs)}")
PYN

# ───────────────────────── 4. composition finale ─────────────────────────
log "4/6 composition -> $OUT_MP4"
TOTAL=$(python3 -c "import json;print(json.load(open('timeline_v2.json'))['total'])")
"${FF[@]}" -i build/demo_bg_v2.mp4 -i build/cta_bg_v2.mp4 -thread_queue_size 64 -framerate 30 -start_number 0 -i "$FRAMES/%05d.png" -i audio/mix_v2.wav \
  -filter_complex "$(<"$FILT/compose.txt")" -map '[v]' -map 3:a \
  -c:v libx264 -preset medium -crf 17 -pix_fmt yuv420p -profile:v high -r 30 -g 60 \
  -colorspace bt709 -color_primaries bt709 -color_trc bt709 -color_range tv \
  -c:a aac -b:a 192k -ar 44100 -ac 2 -frames:v "$NF" -t "$TOTAL" -movflags +faststart "$OUT_MP4"

# ───────────────────────── 5. planche de contrôle ─────────────────────────
log "5/6 planche -> $SHEET"
ffmpeg -y -hide_banner -nostdin -v error -i "$OUT_MP4" -an -filter_complex_script "$FILT/sheet.txt" -fps_mode passthrough -frames:v 1 -update 1 -q:v 3 "$SHEET"

# ───────────────────────── 6. contrôles automatiques ─────────────────────────
log "6/6 contrôles du MP4"
python3 - "$OUT_MP4" "$NF" "$TOTAL" <<'PY'
import json, struct, subprocess, sys, re
f, nf, tot = sys.argv[1], int(sys.argv[2]), float(sys.argv[3])
j = json.loads(subprocess.check_output(["ffprobe", "-v", "error", "-count_frames", "-show_format", "-show_streams", "-of", "json", f]))
v = next(s for s in j["streams"] if s["codec_type"] == "video"); a = next(s for s in j["streams"] if s["codec_type"] == "audio")
dur = float(j["format"]["duration"]); bad = []
def chk(name, ok, val):
    print(f"  [{'OK ' if ok else 'KO '}] {name}: {val}")
    if not ok: bad.append(name)
chk("vidéo h264 1080x1920", (v["codec_name"], v["width"], v["height"]) == ("h264", 1080, 1920), f"{v['codec_name']} {v['width']}x{v['height']}")
chk("30 i/s constant", v["r_frame_rate"] == "30/1" and v["avg_frame_rate"] == "30/1", f"r={v['r_frame_rate']} avg={v['avg_frame_rate']}")
chk("yuv420p", v["pix_fmt"] == "yuv420p", v["pix_fmt"])
chk(f"{nf} images", int(v["nb_read_frames"]) == nf, v["nb_read_frames"])
chk("durée vidéo 9,5 s", abs(float(v["duration"]) - tot) < 0.005, v["duration"])
chk("durée conteneur 9,5 s (±0,03)", abs(dur - tot) < 0.03, f"{dur:.4f}")
chk("audio aac 44,1 kHz stéréo", (a["codec_name"], a["sample_rate"], a["channels"]) == ("aac", "44100", 2), f"{a['codec_name']} {a['sample_rate']} Hz {a['channels']} canaux")
chk("durée audio ≈ 9,5 s (±0,06)", abs(float(a["duration"]) - tot) < 0.06, a["duration"])
chk("débit audio ≈ 192 kb/s", 150000 < int(a.get("bit_rate", 0)) < 230000, a.get("bit_rate"))
# faststart : l'atome moov doit précéder mdat
data = open(f, "rb").read(1 << 20); pos = 0; order = []
while pos + 8 <= len(data):
    size, typ = struct.unpack(">I4s", data[pos:pos + 8]); order.append(typ.decode("latin1"))
    if size < 8: break
    pos += size
chk("faststart (moov avant mdat)", "moov" in order and ("mdat" not in order or order.index("moov") < order.index("mdat")), "-".join(order))
# cropdetect : aucune bande (union des images de 0 à 9,0 s, avant le fondu final)
p = subprocess.run(["ffmpeg", "-hide_banner", "-nostdin", "-t", "9.0", "-i", f, "-an", "-vf", "cropdetect=limit=24:round=2:reset=0", "-f", "null", "-"],
                   capture_output=True, text=True)
crops = re.findall(r"crop=(\d+:\d+:\d+:\d+)", p.stderr)
chk("cropdetect : aucune bande", bool(crops) and crops[-1] == "1080:1920:0:0", crops[-1] if crops else "aucune sortie")
if bad: print("ÉCHEC :", ", ".join(bad)); sys.exit(1)
print("tous les contrôles automatiques sont OK")
PY

ls -la "$OUT_MP4" "$SHEET" build/demo_bg_v2.mp4 build/cta_bg_v2.mp4 audio/mix_v2.wav | awk '{printf "%10d  %s\n",$5,$NF}'
echo; echo "terminé en $(( $(date +%s) - T0 )) s"
