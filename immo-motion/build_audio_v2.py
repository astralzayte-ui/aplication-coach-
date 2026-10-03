#!/usr/bin/env python3
"""Audio v2 (ImmoClap, story 9,5 s) : musique, bruitages Kenney CC0, voix Sulafat, mixage et mesures.

Lancer depuis /home/user/aplication-coach-/immo-motion (après gen_voice_v2.py) :
    python3 build_audio_v2.py                # construit tout (aucun appel réseau sauf téléchargement des packs CC0 manquants)
    python3 build_audio_v2.py --transcribe   # + transcription de mix_v2.wav par Gemini (auto-contrôle du texte)
    python3 build_audio_v2.py --analyse      # affiche seulement le classement des bruitages candidats

Lit : timeline_v2.json (jamais modifié), audio/s{1,2,3}_v2.wav + audio/voice_v2_takes.json, sfx_real/*.
Écrit : audio/music_v2.wav, audio/sfx_v2.wav, audio/voice_track_v2.wav, audio/mix_v2.wav,
        build/voice_v2_timing.json, build/sfx_map_v2.json, build/audio_v2_checks.json, build/mix_v2_transcript.json (avec --transcribe)
Les stems music/sfx sont enregistrés AVANT sidechain (crête normalisée) ; voice_track est la voix traitée seule (24 kHz mono).
"""
import argparse, glob, json, math, os, re, struct, subprocess, sys, tempfile, wave, zipfile
import numpy as np
from scipy import signal as sg
from scipy.ndimage import minimum_filter1d, uniform_filter1d

HERE = os.path.dirname(os.path.abspath(__file__))
os.chdir(HERE)
import gen_voice_v2 as GV                     # utilitaires voix (lecture wav, enveloppes, transcription Gemini)

SR = 44100
TL = json.load(open("timeline_v2.json"))
TOTAL = TL["total"]
N = int(round(TOTAL * SR))                    # nombre exact d'échantillons du mix
TAIL = int(3.0 * SR)                          # marge de travail (les sons qui dépassent sont coupés)
M = TL["music"]
BEAT = 60.0 / M["bpm"]
DROP, CTA, END_FADE = M["drop"], M["cta"], M["end_fade"]
KEYS = ["s1", "s2", "s3"]
VSR = GV.SR                                   # 24000
LUFS_TARGET, TP_TARGET = -14.0, -1.5
GAP_TARGET_DB = 9.0                           # écart voix-musique moyen visé pendant la parole (la spec exige >= 6)
MOMENTARY_MIN_DB = 6.5                        # même au pire bloc de 400 ms
BED_MIN_DB = 6.0                              # voix - (musique + sfx), au pire bloc de 400 ms
os.makedirs("audio", exist_ok=True); os.makedirs("build", exist_ok=True)

PACKS = {
    "interface": {"dir": "sfx_real/interface", "name": "Kenney Interface Sounds 1.0",
                  "zip": None},
    "impact": {"dir": "sfx_real/impact", "name": "Kenney Impact Sounds 1.0",
               "zip": "https://kenney.nl/media/pages/assets/impact-sounds/87b4ddecda-1677589768/kenney_impact-sounds.zip"},
    "scifi": {"dir": "sfx_real/scifi", "name": "Kenney Sci-Fi Sounds 1.0",
              "zip": "https://kenney.nl/media/pages/assets/sci-fi-sounds/6b296f9ecf-1677589334/kenney_sci-fi-sounds.zip"},
}
NOTE_NAMES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"]
AMIN_PENTA = {9, 0, 2, 4, 7}                  # A C D E G


# =================================================================== utilitaires de base
def t_(n): return np.arange(n) / SR
def hz(m): return 440 * 2 ** ((m - 69) / 12)
def lp(x, f, o=2): return sg.lfilter(*sg.butter(o, f / (SR / 2), "low"), x)
def hp(x, f, o=2): return sg.lfilter(*sg.butter(o, f / (SR / 2), "high"), x)
def bp(x, lo, hi, o=2): return sg.lfilter(*sg.butter(o, [lo / (SR / 2), hi / (SR / 2)], "band"), x)
def env_exp(n, tau): return np.exp(-t_(n) / tau)
def db2g(d): return 10 ** (d / 20)
def g2db(g): return 20 * np.log10(max(g, 1e-12))


def put(buf, t, x, g=1.0, pan=0.0):
    """Ajoute x (mono ou stéréo) à buf (n,2) à l'instant t (s). pan : -1 (G) .. +1 (D), loi à puissance constante."""
    i = int(round(t * SR))
    if i >= len(buf) or i + len(x) <= 0:
        return
    x = np.asarray(x, dtype=np.float64)
    if x.ndim == 1:
        a = (pan + 1) * math.pi / 4
        x = np.stack([x * math.cos(a) * math.sqrt(2), x * math.sin(a) * math.sqrt(2)], 1)
    j = min(len(buf), i + len(x))
    k = max(0, -i)
    buf[max(i, 0):j] += g * x[k:j - max(i, 0) + k]


def wide(x, delay_ms=11.0, mix=0.9):
    """Mono -> stéréo élargie (Haas) compatible mono."""
    d = int(delay_ms * SR / 1000)
    r = np.concatenate([np.zeros(d), x[:-d]]) * mix
    return np.stack([x, r], 1)


def load_ogg(path):
    r = subprocess.run(["ffmpeg", "-v", "error", "-i", path, "-f", "f32le", "-ac", "1", "-ar", str(SR), "-"], capture_output=True)
    return np.frombuffer(r.stdout, dtype=np.float32).astype(np.float64)


def active_trim(x, rel_db=-45.0):
    """Rogne le silence de début/fin d'un son (seuil relatif à la crête, enveloppe lissée 1 ms)."""
    e = uniform_filter1d(np.abs(x), int(0.001 * SR) + 1)
    idx = np.where(e > e.max() * db2g(rel_db))[0]
    return x[idx[0]:idx[-1] + 1] if len(idx) else x


def pk_norm(x, peak=1.0): return x / max(np.max(np.abs(x)), 1e-9) * peak


def resample_ratio(x, ratio):
    """Change la hauteur/durée par rééchantillonnage (ratio > 1 : plus aigu et plus court)."""
    n = max(8, int(round(len(x) / ratio)))
    return sg.resample(x, n)


def fade(x, fi=0.002, fo=0.004):
    x = x.copy(); a, b = int(fi * SR), int(fo * SR)
    if a: x[:a] *= np.linspace(0, 1, a)
    if b: x[-b:] *= np.linspace(1, 0, b)
    return x


def write_wav_stereo(path, x, sr=SR):
    w = wave.open(path, "wb"); w.setnchannels(x.shape[1] if x.ndim == 2 else 1); w.setsampwidth(2); w.setframerate(sr)
    w.writeframes(np.clip(np.round(x * 32768), -32768, 32767).astype(np.int16).tobytes()); w.close()


def read_wav_any(path):
    w = wave.open(path); sr, n, ch = w.getframerate(), w.getnframes(), w.getnchannels()
    a = np.frombuffer(w.readframes(n), dtype=np.int16).astype(np.float64) / 32768; w.close()
    return (a.reshape(-1, ch) if ch > 1 else a), sr


# =================================================================== mesure de loudness (ITU-R BS.1770 / EBU R128)
def _k_filters(sr):
    G, Q, fc = 3.999843853973347, 0.7071752369554196, 1681.9744509555319
    K = math.tan(math.pi * fc / sr); Vh = 10 ** (G / 20); Vb = Vh ** 0.4996667741545416; a0 = 1 + K / Q + K * K
    b1 = [(Vh + Vb * K / Q + K * K) / a0, 2 * (K * K - Vh) / a0, (Vh - Vb * K / Q + K * K) / a0]
    a1 = [1, 2 * (K * K - 1) / a0, (1 - K / Q + K * K) / a0]
    fc, Q = 38.13547087602444, 0.5003270373238773
    K = math.tan(math.pi * fc / sr); a0 = 1 + K / Q + K * K
    b2 = [1, -2, 1]; a2 = [1, 2 * (K * K - 1) / a0, (1 - K / Q + K * K) / a0]
    return (b1, a1), (b2, a2)


def k_weight(x, sr=SR):
    (b1, a1), (b2, a2) = _k_filters(sr)
    return sg.lfilter(b2, a2, sg.lfilter(b1, a1, x, axis=0), axis=0)


def lufs_integrated(x, sr=SR):
    """Loudness intégrée gated (BS.1770-4) d'un signal (n,) ou (n,2)."""
    x = x if x.ndim == 2 else x[:, None]
    y = k_weight(x, sr)
    blk, step = int(0.4 * sr), int(0.1 * sr)
    if len(y) < blk:
        return -70.0
    ms = np.array([np.mean(y[i:i + blk] ** 2, axis=0).sum() for i in range(0, len(y) - blk + 1, step)])
    l = -0.691 + 10 * np.log10(ms + 1e-12)
    g1 = ms[l > -70]
    if len(g1) == 0:
        return -70.0
    thr = -0.691 + 10 * np.log10(g1.mean()) - 10
    g2 = ms[l > thr]
    return -0.691 + 10 * np.log10(g2.mean() + 1e-12)


def lufs_window(x, t0, t1, sr=SR):
    """Loudness K-pondérée non gatée sur [t0,t1] (sert à comparer deux stems sur la même fenêtre)."""
    x = x if x.ndim == 2 else x[:, None]
    y = k_weight(x, sr)[int(t0 * sr):int(t1 * sr)]
    return -0.691 + 10 * np.log10(np.mean(y ** 2, axis=0).sum() + 1e-12)


def true_peak_db(x):
    y = sg.resample_poly(x, 4, 1, axis=0)
    return g2db(np.max(np.abs(y)))


def limiter(x, ceil, look_ms=5.0):
    """Limiteur à anticipation (hors ligne). Renvoie la courbe de gain (n,) <= 1 garantissant |x*g| <= ceil."""
    L = max(3, int(look_ms * SR / 1000) | 1)
    pk = np.max(np.abs(x), axis=1) if x.ndim == 2 else np.abs(x)
    g = np.minimum(1.0, ceil / np.maximum(pk, 1e-9))
    g = minimum_filter1d(g, L)
    return uniform_filter1d(g, L)


# =================================================================== analyse des bruitages réels
def ensure_packs():
    for key, p in PACKS.items():
        audio = os.path.join(p["dir"], "Audio")
        if not os.path.isdir(audio):
            if not p["zip"]:
                raise SystemExit(f"pack manquant : {p['dir']}")
            os.makedirs("sfx_real", exist_ok=True)
            z = os.path.join("sfx_real", key + ".zip")
            if not os.path.exists(z):
                subprocess.run(["curl", "-sS", "-L", "-m", "180", "-o", z, p["zip"]], check=True)
            zipfile.ZipFile(z).extractall(p["dir"])
        lic = open(os.path.join(p["dir"], "License.txt"), errors="ignore").read()
        p["license_ok"] = bool(re.search(r"Creative Commons Zero|CC0", lic))
        if not p["license_ok"]:
            raise SystemExit(f"licence CC0 non confirmée pour {p['name']}")


def sfx_path(pack, name): return os.path.join(PACKS[pack]["dir"], "Audio", name)


_feat_cache = {}


def features(path):
    if path in _feat_cache:
        return _feat_cache[path]
    x = load_ogg(path)
    pk = float(np.max(np.abs(x)))
    x = x / pk
    e = uniform_filter1d(np.abs(x), int(0.002 * SR) + 1)
    act = np.where(e > 0.01)[0]
    seg = x[act[0]:act[-1] + 1]
    n = len(seg)
    NF = max(1 << int(np.ceil(np.log2(max(n, 4096)))), 16384)
    X = np.abs(np.fft.rfft(seg * np.hanning(n), n=NF)); f = np.fft.rfftfreq(NF, 1 / SR)
    m = (f > 150) & (f < 9000)
    Xm, fm = X[m], f[m]
    peaks, Xc = [], Xm.copy()
    step = int(60 / f[1])
    for _ in range(3):
        i = int(np.argmax(Xc)); peaks.append(float(fm[i])); Xc[max(0, i - step):i + step] = 0
    flat = float(np.exp(np.mean(np.log(Xm + 1e-12))) / np.mean(Xm))
    P = X ** 2
    mid = int(np.argmax(e))
    d = dict(dur_ms=round(n / SR * 1000, 1), file_ms=round(len(x) / SR * 1000, 1), peak_raw=round(pk, 3),
             rms_db=round(float(10 * np.log10(np.mean(seg ** 2) + 1e-12)), 1),
             centroid_hz=round(float((X * f).sum() / X.sum())), flatness=round(flat, 3),
             hi6k=round(float(P[f > 6000].sum() / P.sum()), 3), lo500=round(float(P[f < 500].sum() / P.sum()), 3),
             attack_ms=round(float((np.argmax(e >= 0.9 * e.max()) - act[0]) / SR * 1000), 1), peaks_hz=[round(p) for p in peaks])
    pc = [int(round(69 + 12 * math.log2(p / 440))) % 12 for p in peaks]
    d["peaks_in_amin_penta"] = all(c in AMIN_PENTA for c in pc)
    m0 = 69 + 12 * math.log2(peaks[0] / 440)
    d["f0_note"] = NOTE_NAMES[round(m0) % 12] + str(round(m0) // 12 - 1)
    d["f0_cents"] = round((m0 - round(m0)) * 100)
    _feat_cache[path] = d
    return d


def penalty(d, spec):
    p = 0.0
    def rng(v, lo, hi, w=1.0):
        if v < lo: return w * (lo - v) / lo
        if v > hi: return w * (v - hi) / hi
        return 0.0
    if "dur" in spec: p += rng(d["dur_ms"], *spec["dur"])
    if "cen" in spec: p += rng(d["centroid_hz"], *spec["cen"])
    if "flat_max" in spec: p += max(0, d["flatness"] - spec["flat_max"]) / spec["flat_max"]
    if "hi_max" in spec: p += 2 * max(0, d["hi6k"] - spec["hi_max"])
    if "lo_max" in spec: p += 2 * max(0, d["lo500"] - spec["lo_max"])
    if "att_max" in spec: p += max(0, d["attack_ms"] - spec["att_max"]) / spec["att_max"] * 0.5
    if "f0" in spec: p += rng(d["peaks_hz"][0], *spec["f0"])
    if spec.get("key") and not d["peaks_in_amin_penta"]: p += 1.0
    if spec.get("tonal_pref"): p += 0.3 * min(1.0, d["flatness"] / 0.3)
    return round(p, 3)


def family_bonus(kind, path):
    """Départage les ex aequo : léger bonus aux fichiers de la famille nominale du type (click_/select_, tick_/toggle_, drop_, confirmation_)."""
    fam = {"click": r"^(click|select)_", "tick": r"^(tick|toggle)_", "pop": r"^(drop|pluck)_", "ding": r"^confirmation_"}[kind]
    return -0.02 if re.match(fam, os.path.basename(path)) else 0.0


SFX_SPECS = {
    # clic de l'interface : bref, net, sans coup sourd ni sifflement
    "click": dict(pool=[("interface", "click_*"), ("interface", "select_00[1278].ogg"), ("interface", "toggle_*")],
                  dur=(15, 60), cen=(1800, 4500), lo_max=0.15, hi_max=0.10, flat_max=0.35, att_max=3),
    # tick du compteur / anneau : très court, brillant mais pas strident, distinct du clic
    "tick": dict(pool=[("interface", "tick_*"), ("interface", "toggle_*"), ("interface", "glass_00[256].ogg"), ("interface", "back_00[34].ogg")],
                 dur=(10, 70), cen=(2500, 7000), lo_max=0.10, hi_max=0.45, att_max=3),
    # pop : petite bulle ronde, quasi sinusoïdale, dans la tessiture chaude de la voix
    "pop": dict(pool=[("interface", "drop_*"), ("interface", "pluck_*"), ("interface", "bong_*"), ("interface", "maximize_00[79].ogg")],
                dur=(40, 200), cen=(500, 1600), flat_max=0.05, f0=(500, 1100), hi_max=0.02),
    # ding : cloche/carillon tonal qui sonne 300-600 ms, brillant, notes de la gamme de La mineur
    "ding": dict(pool=[("interface", "confirmation_*"), ("interface", "question_*"), ("interface", "glass_004.ogg"), ("interface", "bong_*")],
                 dur=(300, 650), cen=(1500, 4500), flat_max=0.08, key=True, hi_max=0.2),
}


def rank(kind, exclude=()):
    spec = SFX_SPECS[kind]; rows = []
    for pack, pat in spec["pool"]:
        for p in sorted(glob.glob(sfx_path(pack, pat))):
            if p in exclude or any(r[1] == p for r in rows):
                continue
            d = features(p); rows.append((round(penalty(d, spec) + family_bonus(kind, p), 3), p, d))
    rows.sort(key=lambda r: r[0])
    return rows


def choose_sfx():
    chosen, report, used = {}, {}, set()
    for kind in ("click", "tick", "pop", "ding"):
        rows = rank(kind, exclude=used)
        report[kind] = [dict(file=os.path.relpath(p), penalty=pen, **{k: d[k] for k in ("dur_ms", "centroid_hz", "flatness", "hi6k", "lo500", "peaks_hz", "f0_note", "f0_cents")})
                        for pen, p, d in rows[:5]]
        chosen[kind] = [rows[0][1], rows[1][1]]       # principal + variante (alternance anti-mitraillette)
        used.update(chosen[kind])
    return chosen, report


# =================================================================== synthèse (instruments, repris de la v1)
RNG = np.random.default_rng(7)
def kick():
    n = int(0.45 * SR); t = t_(n); f = 45 + 120 * np.exp(-t / 0.04); ph = 2 * np.pi * np.cumsum(f) / SR
    return np.sin(ph) * env_exp(n, 0.16) * (1 - np.exp(-t / 0.002)) + 0.25 * np.random.default_rng(1).standard_normal(n) * env_exp(n, 0.004)
def clap():
    n = int(0.25 * SR); x = bp(RNG.standard_normal(n), 1200, 5500)
    e = np.exp(-t_(n) / 0.07) * (1 + 0.8 * (np.sin(2 * np.pi * 90 * t_(n)) > 0) * np.exp(-t_(n) / 0.015)); return x * e * 0.9
def hat(dec=0.035):
    n = int(0.15 * SR); return hp(RNG.standard_normal(n), 7500) * env_exp(n, dec) * 0.5
def pluck(m, dur=0.28):
    n = int(dur * SR); t = t_(n); f = hz(m)
    x = sum((1 / k) * np.sin(2 * np.pi * f * k * t + 0.3 * k) for k in (1, 2, 3, 4, 5))
    return lp(x, 2400) * env_exp(n, 0.09) * (1 - np.exp(-t / 0.002)) * 0.35
def bass(m, dur=0.27):
    n = int(dur * SR); t = t_(n); f = hz(m); x = np.sin(2 * np.pi * f * t) + 0.5 * np.sin(2 * np.pi * 2 * f * t) * np.exp(-t / 0.1)
    return np.tanh(1.6 * x) * env_exp(n, 0.5) * np.minimum(1, (dur - t) / 0.02) * 0.5
def pad(notes, dur):
    n = int(dur * SR); t = t_(n); x = np.zeros(n)
    for m in notes:
        for d in (-0.07, 0, 0.07):
            f = hz(m) * 2 ** (d / 12); x += 2 * ((f * t) % 1) - 1
    x = lp(x, 1100); a = np.minimum(1, t / 0.6) * np.minimum(1, (dur - t) / 0.4); return x * a * 0.05
def stab(notes, dur=0.45):
    """Accord de synthé « supersaw » bref pour le climax du CTA."""
    n = int(dur * SR); t = t_(n); x = np.zeros(n)
    for m in notes:
        for d in (-0.12, -0.04, 0.04, 0.12):
            f = hz(m) * 2 ** (d / 12); x += 2 * ((f * t) % 1) - 1
    x = lp(x, 3200) * np.exp(-t / 0.16) * (1 - np.exp(-t / 0.004)); return x * 0.045
def riser(dur):
    n = int(dur * SR); t = t_(n); x = RNG.standard_normal(n); out = np.zeros(n); k = 40
    for i in range(k):
        a, b = int(n * i / k), int(n * (i + 1) / k); fc = 300 + 9000 * ((i + 0.5) / k) ** 2.2; out[a:b] = bp(x, fc * 0.6, min(fc * 1.5, 19000), 2)[a:b]
    return out * (t / dur) ** 2.2 * 0.9
def crash(dur=1.1):
    n = int(dur * SR); x = hp(RNG.standard_normal(n), 3500) * np.exp(-t_(n) / 0.28) * (1 - np.exp(-t_(n) / 0.002)); return x * 0.6


CHORDS = {"Am": ([57, 60, 64], 33), "F": ([53, 57, 60], 29), "C": ([60, 64, 67], 36), "G": ([55, 59, 62], 31)}
# progression Am-F-C-G recalée sur la structure v2 : hook sur Am, drop sur F, G juste avant le climax, retombée sur Am (tonique) au CTA
SCHED = [(0.0, "Am"), (DROP, "F"), (DROP + 2.0, "C"), (DROP + 4.0, "G"), (CTA, "Am")]


def chord_at(t):
    cur = SCHED[0]
    for s in SCHED:
        if t >= s[0] - 1e-9: cur = s
    return cur[1]


def chord_start(t):
    return max(s[0] for s in SCHED if t >= s[0] - 1e-9)


def build_music():
    music = np.zeros((N + TAIL, 2)); kicks = []
    nb = int(math.ceil(TOTAL / BEAT))
    for b in range(nb):
        t = b * BEAT; name = chord_at(t); notes, root = CHORDS[name]
        pos = int(round((t - chord_start(t)) / BEAT)); seg_end = min([s[0] for s in SCHED if s[0] > t + 1e-9] + [TOTAL])
        last_beat = (t + BEAT) >= seg_end - 1e-9
        in_hook = t < DROP - 1e-9; in_cta = t >= CTA - 1e-9
        if in_hook:
            if b >= 1 and b % 2 == 0: put(music, t, kick(), 0.30)
            put(music, t + 0.25, hat(0.02), 0.15)
        else:
            put(music, t, kick(), 0.9); kicks.append(t)
            put(music, t + 0.25, hat(), 0.5)
            if b % 2 == 1: put(music, t, clap(), 0.55)
            put(music, t + 0.125, hat(0.02), 0.25); put(music, t + 0.375, hat(0.02), 0.25)
            for h in (0, 0.5):
                put(music, t + h * BEAT, bass(root + (12 if (last_beat and h == 0.5) else 0)), 0.7)
            g = 0.55 if not in_cta else 0.62
            for q in range(4):
                m = notes[[0, 1, 2, 1][q]] + 12
                put(music, t + q * BEAT / 4, wide(pluck(m)), g * (1 if q % 2 == 0 else 0.7))
                if in_cta:                       # octave supérieure + écho : climax plus brillant
                    put(music, t + q * BEAT / 4 + 0.375, wide(pluck(m + 12, 0.2), 17), 0.17 * (1 if q % 2 == 0 else 0.7))
            if in_cta and pos % 2 == 0:
                put(music, t, wide(stab(notes + [notes[0] + 12], 0.5), 9), 0.8)
    # nappes (une par segment d'accord, jouée en entier)
    for i, (t0, name) in enumerate(SCHED):
        t1 = SCHED[i + 1][0] if i + 1 < len(SCHED) else TOTAL + 0.6
        notes, root = CHORDS[name]
        g = 0.8 if t0 < DROP else (1.0 if t0 < CTA else 1.5)
        put(music, t0, wide(pad(notes + [notes[0] - 12], t1 - t0 + 0.4), 13), g)
    # remplissage de caisse claire avant le CTA (comme en v1), puis crash au climax
    for i, tt in enumerate(np.arange(CTA - 1.0, CTA, 0.125)): put(music, tt, clap(), 0.2 + 0.5 * i / 8)
    put(music, CTA, wide(crash(1.2), 7), 0.55)
    # sidechain (pompage) sur les kicks
    duck = np.ones(N + TAIL)
    for kt in kicks:
        i = int(kt * SR); n = int(0.22 * SR); j = min(N + TAIL, i + n); duck[i:j] = np.minimum(duck[i:j], 1 - 0.55 * np.exp(-t_(n)[:j - i] / 0.09))
    music *= duck[:, None]
    put(music, 0.0, wide(riser(DROP)), 0.8)      # montée du hook vers le drop
    music = music[:N]
    ramp = np.clip((t_(N) - CTA) / 0.02, 0, 1); music *= (1 + 0.33 * ramp)[:, None]        # climax du CTA : +2,5 dB
    # fondu final (cosinus sur end_fade) et attaque douce
    nf = int(END_FADE * SR); music[-nf:] *= (0.5 * (1 + np.cos(np.linspace(0, np.pi, nf))))[:, None]
    music *= np.minimum(1, t_(N) / 0.05)[:, None]
    return music, kicks


# =================================================================== bruitages
def svf_bandpass(x, f, q):
    """Filtre d'état (TPT SVF) passe-bande à fréquence variable f[i] (Hz) — pour balayer le bruit des whooshes."""
    g = np.tan(np.pi * np.minimum(f, SR * 0.45) / SR); k = 1.0 / q
    a1 = 1 / (1 + g * (g + k)); a2 = g * a1; a3 = g * a2
    out = np.empty(len(x)); ic1 = ic2 = 0.0
    for i in range(len(x)):
        v3 = x[i] - ic2; v1 = a1[i] * ic1 + a2[i] * v3; v2 = ic2 + a2[i] * ic1 + a3[i] * v3
        ic1 = 2 * v1 - ic1; ic2 = 2 * v2 - ic2; out[i] = v1
    return out


_whoosh_cache = {}


def whoosh(lead, big, pan_dir, air_pair):
    """Whoosh stéréo : montée (lead s) jusqu'au pic exactement sur la coupure/impact, puis retombée.
    Corps = bruit blanc balayé 350->4300 Hz (passe-bande résonant, G/D décorrélés) ; air = vrais sons Kenney (open_XXX montée + close_XXX retombée)."""
    key = (round(lead, 3), big, pan_dir, air_pair)
    if key in _whoosh_cache:
        return _whoosh_cache[key]
    tail = 0.55 if big else 0.38
    n = int((lead + tail) * SR); t = t_(n)
    f = np.where(t < lead, 300 * (3300 / 300) ** ((t / lead) ** 1.25), 3300 * (900 / 3300) ** (np.clip((t - lead) / tail, 0, 1) ** 0.8))
    env = np.where(t < lead, (t / lead) ** 2.2, np.exp(-(t - lead) / (tail * 0.36)))
    env *= np.minimum(1, t / 0.004)
    chans = []
    for seed in (11, 12):
        nz = np.random.default_rng(seed + int(lead * 1000)).standard_normal(n)
        body = svf_bandpass(nz, f, 1.3); body /= np.sqrt(np.mean(body ** 2)) + 1e-9
        low = lp(nz, 260, 2); low /= np.sqrt(np.mean(low ** 2)) + 1e-9
        chans.append((body + 0.5 * low * (1.3 if big else 1.0)) * env)
    st = np.stack(chans, 1)
    # couche réelle (air) : fin de open_XXX (montée) + début de close_XXX (retombée) = même timbre en miroir
    rise = load_ogg(sfx_path("interface", f"open_{air_pair}.ogg")); fall = load_ogg(sfx_path("interface", f"close_{air_pair}.ogg"))
    rise = active_trim(rise)[-int(lead * SR):]; fall = active_trim(fall)[:int(tail * SR)]
    air = np.concatenate([rise, fall]); air = air / (np.max(np.abs(air)) + 1e-9)
    air = np.concatenate([air, np.zeros(max(0, n - len(air)))])[:n]
    air *= np.where(t < lead, (t / lead) ** 1.2, np.exp(-(t - lead) / (tail * 0.5)))
    st += 0.16 * np.stack([air, np.roll(air, int(0.0007 * SR))], 1) / (np.max(np.abs(air)) + 1e-9) * np.max(np.abs(st))
    # balayage panoramique (G->D ou D->G) sur la montée
    p = pan_dir * (np.clip(t / (lead + tail), 0, 1) * 1.1 - 0.55)
    a = (p + 1) * math.pi / 4; st = st * np.stack([np.cos(a), np.sin(a)], 1) * math.sqrt(2)
    st[-int(0.02 * SR):] *= np.linspace(1, 0, int(0.02 * SR))[:, None]      # fondu final 20 ms
    st = pk_norm(st)
    _whoosh_cache[key] = st
    return st


def impact(root_midi, big):
    """Impact cinématographique : vrais sons Kenney (transitoire métallique + grondement basse fréquence)
    + sub sinus accordé sur la tonique de l'accord + éclat d'aigus. Le pic est à t=0 du retour."""
    L = 1.9 if big else 1.25
    n = int(L * SR); t = t_(n); out = np.zeros(n)
    tr = pk_norm(active_trim(load_ogg(sfx_path("impact", "impactBell_heavy_00%d.ogg" % (0 if big else 3)))))
    tr = tr[:int(0.9 * SR)] * np.exp(-t_(min(len(tr), int(0.9 * SR))) / (0.26 if big else 0.30))
    out[:len(tr)] += 1.6 * tr
    pl = pk_norm(active_trim(load_ogg(sfx_path("impact", "impactPlate_heavy_001.ogg"))))
    out[:len(pl)] += 1.2 * pl
    rb = pk_norm(active_trim(load_ogg(sfx_path("scifi", "lowFrequency_explosion_00%d.ogg" % (0 if big else 1)))))
    rb = lp(rb, 220, 2)[:n]; rb = rb * np.exp(-t_(len(rb)) / (0.42 if big else 0.35))
    out[:len(rb)] += 0.35 * pk_norm(rb)
    f0 = hz(root_midi - 12 + 12)      # tonique (octave 2) : sub qui descend vers la note
    f = f0 + 55 * np.exp(-t / 0.09); sub = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t / (0.42 if big else 0.4)) * (1 - np.exp(-t / 0.003))
    out += 0.45 * sub
    sh = hp(np.random.default_rng(5).standard_normal(n), 3000) * np.exp(-t / (0.32 if big else 0.2)) * (1 - np.exp(-t / 0.002))
    out += 0.22 * sh / (np.max(np.abs(sh)) + 1e-9)
    out *= np.minimum(1, (L - t) / 0.15)
    st = np.stack([out, out], 1)
    st[:, 1] = 0.9 * out + 0.1 * np.roll(out, int(0.0009 * SR))   # très léger élargissement
    return pk_norm(st)


def tune_pop(base_hz, t, target_hz, max_semi=5.0):
    """Hauteur de pop (rapport de rééchantillonnage) pour tomber sur la note d'accord la plus proche de target_hz,
    sans décaler de plus de max_semi demi-tons."""
    notes = CHORDS[chord_at(t)][0]
    cands = []
    for m in notes:
        for o in (-24, -12, 0, 12, 24):
            cands.append(m + o)
    best = None
    for m in cands:
        semi = 12 * math.log2(hz(m) / base_hz)
        if abs(semi) <= max_semi:
            cost = abs(math.log2(hz(m) / target_hz))
            if best is None or cost < best[0]: best = (cost, m, semi)
    if best is None:
        return 1.0, None, 0.0
    return 2 ** (best[2] / 12), NOTE_NAMES[best[1] % 12] + str(best[1] // 12 - 1), best[2]


def build_sfx(chosen):
    ev = TL["sfx"]
    sfx = np.zeros((N + TAIL, 2)); log = []
    ck = chosen
    targets = sorted(set(TL["cuts"] + [DROP, CTA]))
    snd = {kind: [pk_norm(active_trim(load_ogg(p))) for p in ck[kind]] for kind in ck}
    cnt = {"click": 0, "tick": 0, "pop": 0, "whoosh": 0, "impact": 0, "ding": 0}
    pop_targets = {2.15: 784.0, 3.0: 880.0, 4.3: 988.0, 7.1: 880.0, 7.3: 1175.0}     # montée de hauteurs au fil de l'histoire
    thumbs = TL["ev"]["thumbs"]
    GAIN_DB = {"click": -8.5, "tick": -9.5, "pop": -8.0, "ding": -10.0, "whoosh": -9.5, "impact": -2.0}
    for e in ev:
        t, typ = e["t"], e["type"]; k = cnt[typ]; cnt[typ] += 1
        row = {"t": t, "type": typ}
        if typ in ("click", "tick"):
            variant = k % 2
            x = snd[typ][variant].copy()
            pan = 0.0
            if typ == "click" and any(abs(t - th) < 1e-6 for th in thumbs):
                pan = -0.25 + 0.5 * thumbs.index(next(th for th in thumbs if abs(t - th) < 1e-6)) / (len(thumbs) - 1)   # l'éventail s'ouvre de G à D
            g = db2g(GAIN_DB[typ]) * (0.9 + 0.1 * ((k * 7) % 3) / 2)               # micro-variation d'intensité
            put(sfx, t, fade(x, 0.0003, 0.002), g, pan)
            row.update(file=os.path.basename(ck[typ][variant]), gain_db=round(g2db(g), 1), pan=round(pan, 2), pitch_semitones=0.0)
        elif typ == "pop":
            feat = features(ck["pop"][0])
            ratio, note, semi = tune_pop(feat["peaks_hz"][0], t, pop_targets.get(round(t, 2), 880.0))
            x = resample_ratio(snd["pop"][0], ratio)
            put(sfx, t, fade(x, 0.0003, 0.004), db2g(GAIN_DB["pop"]), 0.0)
            row.update(file=os.path.basename(ck["pop"][0]), gain_db=GAIN_DB["pop"], pan=0.0, pitch_semitones=round(semi, 2), tuned_to=note)
        elif typ == "ding":
            x = snd["ding"][0]
            put(sfx, t, fade(x, 0.0003, 0.02), db2g(GAIN_DB["ding"]), 0.0)
            # petit écho brillant (réponse de salle) pour que le ding « sonne » sans traîner sous la voix
            put(sfx, t + 0.11, fade(x, 0.0003, 0.02), db2g(GAIN_DB["ding"] - 10), 0.35)
            row.update(file=os.path.basename(ck["ding"][0]), gain_db=GAIN_DB["ding"], pan=0.0, pitch_semitones=0.0, echo="+110 ms, -10 dB, pan +0.35")
        elif typ == "whoosh":
            nxt = next((c for c in targets if c > t + 1e-6), t + 0.15)
            lead = float(min(0.25, max(0.12, nxt - t)))
            big = abs(nxt - DROP) < 1e-6 or abs(nxt - CTA) < 1e-6
            x = whoosh(lead, big, 1 if k % 2 == 0 else -1, ("003", "002", "004")[k % 3])
            put(sfx, t, x, db2g(GAIN_DB["whoosh"] + (2.0 if big else 0.0)))
            row.update(lead_s=round(lead, 3), peak_at=round(t + lead, 3), variant="grand" if big else "standard", pan_sweep="G->D" if k % 2 == 0 else "D->G",
                       air_layer=f"open_{('003','002','004')[k % 3]}+close_{('003','002','004')[k % 3]}", gain_db=GAIN_DB["whoosh"] + (2.0 if big else 0.0))
        elif typ == "impact":
            root = CHORDS[chord_at(t + 0.01)][1]
            x = impact(root, big=(abs(t - CTA) < 1e-6))
            put(sfx, t, x, db2g(GAIN_DB["impact"]))
            row.update(variant="grand (CTA)" if abs(t - CTA) < 1e-6 else "drop", sub_note=NOTE_NAMES[root % 12] + str(root // 12 - 1), gain_db=GAIN_DB["impact"])
        log.append(row)
    sfx = sfx[:N]
    return sfx, log


# =================================================================== voix
def process_phrase(x):
    """Traitement de voix : passe-haut, léger creux boxy, présence, air, compression douce, égalisation de niveau."""
    sr = VSR
    def peq(x, f, q, gdb):
        A = 10 ** (gdb / 40); w0 = 2 * math.pi * f / sr; al = math.sin(w0) / (2 * q); c = math.cos(w0)
        b = [1 + al * A, -2 * c, 1 - al * A]; a = [1 + al / A, -2 * c, 1 - al / A]
        return sg.lfilter(np.array(b) / a[0], np.array(a) / a[0], x)
    def hshelf(x, f, gdb):
        A = 10 ** (gdb / 40); w0 = 2 * math.pi * f / sr; c, s = math.cos(w0), math.sin(w0); S = 1.0
        al = s / 2 * math.sqrt((A + 1 / A) * (1 / S - 1) + 2); sq = 2 * math.sqrt(A) * al
        b = [A * ((A + 1) + (A - 1) * c + sq), -2 * A * ((A - 1) + (A + 1) * c), A * ((A + 1) + (A - 1) * c - sq)]
        a = [(A + 1) - (A - 1) * c + sq, 2 * ((A - 1) - (A + 1) * c), (A + 1) - (A - 1) * c - sq]
        return sg.lfilter(np.array(b) / a[0], np.array(a) / a[0], x)
    x = sg.lfilter(*sg.butter(2, 85 / (sr / 2), "high"), x)
    x = peq(x, 280, 1.0, -1.5)
    x = peq(x, 3200, 0.9, 2.0)
    x = hshelf(x, 7000, 1.5)
    # compression douce (ratio 2,5:1, seuil -24 dBFS), enveloppe à 1 kHz
    hop = sr // 1000
    c = np.concatenate([[0.0], np.cumsum(x ** 2)]); nfr = len(x) // hop
    rms = np.sqrt((c[(np.arange(nfr) + 1) * hop] - c[np.arange(nfr) * hop]) / hop + 1e-12)
    lev = 20 * np.log10(rms + 1e-9)
    gr = np.maximum(0, lev + 24) * (1 - 1 / 2.5)                                  # réduction de gain (dB)
    sm = np.zeros_like(gr); s = 0.0
    for i, v in enumerate(gr):
        s = v + (s - v) * (math.exp(-1 / 6) if v > s else math.exp(-1 / 90)); sm[i] = s
    g = 10 ** (-sm / 20); g = np.interp(np.arange(len(x)) / hop, np.arange(nfr) + 0.5, g)
    x = x * g
    on, off = GV.speech_bounds(x, sr)
    seg = x[int(on * sr):int(off * sr)]
    x = x * db2g(-17.0 - lufs_window(seg, 0, len(seg) / sr, sr))             # même loudness K-pondérée pour les 3 phrases
    return x, on


def build_voice():
    meta = json.load(open("audio/voice_v2_takes.json"))
    nv = int(round(TOTAL * VSR)); track = np.zeros(nv); place = {}
    for k in KEYS:
        x, sr = GV.read_wav(f"audio/{k}_v2.wav"); assert sr == VSR
        x, pre = process_phrase(x.astype(np.float64))
        i = int(round((TL["voice"][k] - pre) * VSR))          # le début de parole (mesuré sur la voix traitée) tombe sur l'instant de la timeline
        track[i:i + len(x)] += x[:nv - i]
        place[k] = {"file": f"audio/{k}_v2.wav", "placed_at": round(i / VSR, 4), "pre_roll": round(pre, 4)}
    # limiteur doux de la voix (crête <= 0,85) : n'agit que sur les pointes
    g = limiter(track, 0.85, 3.0); track = track * g
    return track, place, meta


# =================================================================== sidechain
def activity(voice44, thr_db=-48.0, attack=0.020, release=0.300, rate=1000):
    """Enveloppe d'activité de la voix (0..1) : sert de signal de sidechain (anticipe de `attack`)."""
    hop = SR // rate; nfr = len(voice44) // hop
    c = np.concatenate([[0.0], np.cumsum(voice44 ** 2)])
    ms = (c[(np.arange(nfr) + 1) * hop] - c[np.arange(nfr) * hop]) / hop
    on = (10 * np.log10(ms + 1e-12) > thr_db).astype(float)
    # la musique doit déjà baisser quand la voix attaque : décalage de `lead` avant
    lead = int(0.015 * rate); on = np.concatenate([on[lead:], np.zeros(lead)])
    a_c, r_c = math.exp(-1 / (attack * rate)), math.exp(-1 / (release * rate)); sm = np.zeros(nfr); s = 0.0
    for i, v in enumerate(on):
        s = v + (s - v) * (a_c if v > s else r_c); sm[i] = s
    return np.interp(np.arange(len(voice44)) / hop, np.arange(nfr) + 0.5, sm)


def mix_stems(voice44, music, sfx, gm_db, sfx_gain_db=-1.0, depth_sfx=3.0, depth_mid=9.0, depth_low=3.5):
    act = activity(voice44)
    low = sg.sosfiltfilt(sg.butter(4, 160 / (SR / 2), "low", output="sos"), music, axis=0)
    mid = music - low
    g_mid = 1 - (1 - db2g(-depth_mid)) * act; g_low = 1 - (1 - db2g(-depth_low)) * act; g_sfx = 1 - (1 - db2g(-depth_sfx)) * act
    mus = (low * g_low[:, None] + mid * g_mid[:, None]) * db2g(gm_db)
    sx = sfx * g_sfx[:, None] * db2g(sfx_gain_db)
    vo = np.stack([voice44, voice44], 1)
    return vo, mus, sx, act


def gaps_report(vo, mus, sx, windows, blk=0.4, step=0.1):
    """Écarts de loudness K-pondérée pendant chaque phrase : voix - musique, voix - sfx, voix - (musique+sfx),
    en moyenne sur la phrase et au pire sur des blocs momentanés de 400 ms (pas de 100 ms) entièrement inclus dans la phrase."""
    kv, km, ks = k_weight(vo), k_weight(mus), k_weight(sx)
    ms = lambda y, a, b: float(np.mean(y[int(a * SR):int(b * SR)] ** 2, axis=0).sum()) + 1e-12
    L = lambda m: -0.691 + 10 * np.log10(m)
    rows = {}
    for k, (a, b) in windows.items():
        v, m, x = ms(kv, a, b), ms(km, a, b), ms(ks, a, b)
        gm_, gb_ = [], []
        t = a
        while t + blk <= b + 1e-9:
            vv, mm, xx = ms(kv, t, t + blk), ms(km, t, t + blk), ms(ks, t, t + blk)
            gm_.append(10 * np.log10(vv / mm)); gb_.append(10 * np.log10(vv / (mm + xx))); t += step
        if not gm_:
            gm_, gb_ = [10 * np.log10(v / m)], [10 * np.log10(v / (m + x))]
        rows[k] = {"window": [round(a, 3), round(b, 3)], "voice_lufs": round(L(v), 1), "music_lufs": round(L(m), 1), "sfx_lufs": round(L(x), 1),
                   "voice_minus_music_db": round(10 * np.log10(v / m), 1), "voice_minus_sfx_db": round(10 * np.log10(v / x), 1),
                   "voice_minus_bed_db": round(10 * np.log10(v / (m + x)), 1),
                   "worst_momentary_voice_minus_music_db": round(min(gm_), 1), "worst_momentary_voice_minus_bed_db": round(min(gb_), 1)}
    return rows


# =================================================================== chaîne ffmpeg (loudnorm 2 passes, mesures ebur128)
def ffmpeg_measure(path):
    """Renvoie I, LRA, true peak (dBTP) et pic échantillon (dBFS) par ffmpeg ebur128 (peak=true)."""
    r = subprocess.run(["ffmpeg", "-hide_banner", "-nostats", "-i", path, "-af", "ebur128=peak=true:framelog=quiet", "-f", "null", "-"],
                       capture_output=True, text=True)
    txt = r.stderr.split("Summary:")[-1]
    g = lambda pat: float(re.search(pat, txt).group(1))
    return {"I": g(r"I:\s+(-?[\d.]+) LUFS"), "LRA": g(r"LRA:\s+(-?[\d.]+) LU"), "TP": g(r"Peak:\s+(-?[\d.]+) dBFS")}


def loudnorm_two_pass(src, dst):
    af1 = f"loudnorm=I={LUFS_TARGET}:TP={TP_TARGET}:LRA=11:print_format=json"
    r = subprocess.run(["ffmpeg", "-hide_banner", "-nostats", "-i", src, "-af", af1, "-f", "null", "-"], capture_output=True, text=True)
    j = json.loads(r.stderr[r.stderr.rindex("{"):r.stderr.rindex("}") + 1])
    af2 = (f"loudnorm=I={LUFS_TARGET}:TP={TP_TARGET}:LRA=11:measured_I={j['input_i']}:measured_TP={j['input_tp']}:measured_LRA={j['input_lra']}"
           f":measured_thresh={j['input_thresh']}:offset={j['target_offset']}:linear=true:print_format=json,aresample={SR}")
    r2 = subprocess.run(["ffmpeg", "-hide_banner", "-nostats", "-y", "-i", src, "-af", af2, "-ar", str(SR), "-ac", "2", "-c:a", "pcm_f32le", dst],
                        capture_output=True, text=True)
    j2 = json.loads(r2.stderr[r2.stderr.rindex("{"):r2.stderr.rindex("}") + 1])
    return j, j2


def analysis_only():
    ensure_packs()
    for kind in ("click", "tick", "pop", "ding"):
        print(f"== {kind}")
        for pen, p, d in rank(kind)[:8]:
            print(f"  {pen:6.3f} {os.path.basename(p):22s} dur={d['dur_ms']:6.1f}ms cen={d['centroid_hz']:5d} flat={d['flatness']:.3f} hi6k={d['hi6k']:.2f} lo500={d['lo500']:.2f} f0={d['f0_note']}{d['f0_cents']:+d}c key={d['peaks_in_amin_penta']}")


# =================================================================== principal
def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--transcribe", action="store_true")
    ap.add_argument("--analyse", action="store_true")
    a = ap.parse_args()
    if a.analyse:
        analysis_only(); return
    ensure_packs()
    chosen, cand_report = choose_sfx()

    print("musique ...", flush=True)
    music, kicks = build_music()
    music = pk_norm(music, 0.9)
    print("bruitages ...", flush=True)
    sfx, sfx_log = build_sfx(chosen)
    sfx = pk_norm(sfx, 0.9)
    print("voix ...", flush=True)
    vtrack, vplace, vmeta = build_voice()

    write_wav_stereo("audio/music_v2.wav", music)
    write_wav_stereo("audio/sfx_v2.wav", sfx)
    GV.write_wav("audio/voice_track_v2.wav", vtrack, VSR)

    # ---- mesure de la parole telle qu'elle est placée (sur la piste voix seule, 24 kHz)
    starts = [TL["voice"][k] for k in KEYS]; nexts = starts[1:] + [TOTAL]
    phr = {}
    for i, k in enumerate(KEYS):
        a0 = max(0, starts[i] - 0.10); a1 = nexts[i] - 0.02 if i < 2 else TOTAL
        seg = vtrack[int(a0 * VSR):int(a1 * VSR)]
        on, off = GV.speech_bounds(seg, VSR)
        s, e = a0 + on, a0 + off
        # sous-groupes de parole : suites de trames > (pic - 35 dB), pauses internes >= 20 ms
        db, hop, win = GV.frames_db(seg, VSR, 0.005, 0.010); thr = db.max() - 35; act_ = db > thr; chunks = []; j = 0
        gap_fr = int(round(0.02 / hop))
        while j < len(act_):
            if act_[j]:
                m = j
                while m < len(act_) and (act_[m] or act_[m:m + gap_fr].any()): m += 1
                chunks.append([round(a0 + j * hop, 3), round(a0 + m * hop, 3)]); j = m
            else: j += 1
        slot_max = vmeta["phrases"][k]["slot_max"]
        phr[k] = {"text": TL["voice_text"][k], "slot_start": TL["voice"][k], "start": round(s, 3), "end": round(e, 3), "duration": round(e - s, 3),
                  "slot_max_duration": slot_max, "slot_end_max": round(TL["voice"][k] + slot_max, 3), "margin_s": round(TL["voice"][k] + slot_max - e, 3),
                  "next_start": round(nexts[i], 3) if i < 2 else None, "gap_before_next_s": round(nexts[i] - e, 3) if i < 2 else round(TOTAL - e, 3),
                  "atempo": vmeta["phrases"][k]["atempo"], "fits_slot": bool(e - s <= slot_max + 1e-6), "sub_groups": chunks, "source": vmeta["phrases"][k]["source"]}

    # ---- mixage : sidechain, niveaux, limiteur, normalisation
    v44 = sg.resample_poly(vtrack, SR, VSR)[:N]
    v44 = np.concatenate([v44, np.zeros(N - len(v44))])
    windows = {k: (phr[k]["start"], phr[k]["end"]) for k in KEYS}
    gm, depth_sfx = -8.0, 3.0
    for it in range(16):
        vo, mus, sx, act = mix_stems(v44, music, sfx, gm, depth_sfx=depth_sfx)
        rep = gaps_report(vo, mus, sx, windows)
        avg = min(r["voice_minus_music_db"] for r in rep.values())
        mom = min(r["worst_momentary_voice_minus_music_db"] for r in rep.values())
        bed = min(r["worst_momentary_voice_minus_bed_db"] for r in rep.values())
        err = max(GAP_TARGET_DB - avg, MOMENTARY_MIN_DB - mom)           # il faut satisfaire les deux critères
        if abs(GAP_TARGET_DB - avg) < 0.25 and mom >= MOMENTARY_MIN_DB:
            if bed >= BED_MIN_DB or depth_sfx >= 6.0: break
            depth_sfx += 0.5; continue
        gm -= err if err > 0 else 0.7 * err
    worst = avg
    print(f"niveau musique {gm:+.1f} dB, duck sfx {depth_sfx:.1f} dB, écart voix-musique moyen {avg:.1f} dB (pire momentané {mom:.1f}), voix-lit {bed:.1f}", flush=True)
    premix = vo + mus + sx
    # limiteur de bus + gain pour atteindre -14 LUFS avec TP <= -1.5 dBTP
    gain_db = LUFS_TARGET - lufs_integrated(premix); ceil = db2g(-2.0)
    for it in range(14):
        gl = limiter(premix * db2g(gain_db), ceil, 5.0)
        y = premix * db2g(gain_db) * gl[:, None]
        L = lufs_integrated(y); tp = true_peak_db(y)
        ok_l, ok_tp = abs(L - LUFS_TARGET) < 0.05, tp <= TP_TARGET - 0.05
        if ok_l and ok_tp: break
        if tp > TP_TARGET - 0.05: ceil *= db2g(-(tp - (TP_TARGET - 0.1)))
        gain_db += LUFS_TARGET - L
    fin_gain = db2g(gain_db) * gl[:, None]
    vo_f, mus_f, sx_f = vo * fin_gain, mus * fin_gain, sx * fin_gain
    print(f"gain {gain_db:+.1f} dB, limiteur {g2db(gl.min()):.1f} dB max, LUFS {L:.2f}, TP {tp:.2f}", flush=True)

    with tempfile.TemporaryDirectory() as d:
        pre = os.path.join(d, "pre.wav"); post = os.path.join(d, "post.wav")
        write_f32(pre, y)               # float32 : aucun écrêtage avant loudnorm
        j1, j2 = loudnorm_two_pass(pre, post)
        out_ln, _ = read_wav_f32(post)
    ln_type = j2.get("normalization_type")
    # candidat A : sortie de loudnorm (2 passes) ; candidat B : notre gain + limiteur (déjà calé sur -14 LUFS / -1,5 dBTP).
    # On garde A seulement s'il est conforme (ebur128) et s'il n'a pas déformé la dynamique (écart de gain dans le temps vs B <= 0,5 dB).
    cand, final, used = {}, y, "gain+limiteur numpy"
    fa = out_ln[:N]
    if len(fa) < N: fa = np.vstack([fa, np.zeros((N - len(fa), 2))])
    with tempfile.TemporaryDirectory() as d:
        for name, sig in (("loudnorm", fa), ("numpy", y)):
            f = os.path.join(d, name + ".wav"); write_wav_stereo(f, sig); cand[name] = ffmpeg_measure(f)
    hop = SR // 10; n10 = N // hop
    ra = np.sqrt(np.mean(fa[:n10 * hop].reshape(n10, hop, 2) ** 2, axis=(1, 2))); rb = np.sqrt(np.mean(y[:n10 * hop].reshape(n10, hop, 2) ** 2, axis=(1, 2)))
    okw = rb > 10 ** (-60 / 20); dg = 20 * np.log10((ra[okw] + 1e-9) / (rb[okw] + 1e-9)); spread = float(dg.max() - dg.min())
    cand["loudnorm"]["gain_spread_vs_numpy_db"] = round(spread, 2); cand["loudnorm"]["normalization_type"] = ln_type
    A = cand["loudnorm"]
    if abs(A["I"] - LUFS_TARGET) <= 0.3 and A["TP"] <= TP_TARGET and spread <= 0.5:
        final, used = fa, f"loudnorm 2 passes ({ln_type}), écart de gain dans le temps {spread:.2f} dB"
    assert final.shape == (N, 2)
    write_wav_stereo("audio/mix_v2.wav", final)

    # ---- mesures finales sur le fichier écrit
    me = ffmpeg_measure("audio/mix_v2.wav")
    mx, _ = read_wav_any("audio/mix_v2.wav")
    sample_peak = float(np.max(np.abs(mx)))
    clip_samples = int(np.sum(np.abs(mx) >= 32767 / 32768))
    pr = subprocess.run(["ffprobe", "-v", "error", "-show_entries", "stream=sample_rate,channels,duration,nb_samples", "-of", "json", "audio/mix_v2.wav"], capture_output=True, text=True)
    st = json.loads(pr.stdout)["streams"][0]
    wv = wave.open("audio/mix_v2.wav"); nframes, rate, nch = wv.getnframes(), wv.getframerate(), wv.getnchannels(); wv.close()
    # écarts voix/musique/sfx définitifs, mesurés sur les stems passés dans la même chaîne que le mix final
    gain_lin = float(np.sqrt(np.mean(final ** 2) / (np.mean(y ** 2) + 1e-12)))
    rep_final = gaps_report(vo_f * gain_lin, mus_f * gain_lin, sx_f * gain_lin, windows)
    # alignement voix dans le mix : décalage par corrélation croisée (voix traitée vs mix, bande 300-3400 Hz)
    lags = {}
    mono = mx.mean(1); vb = sg.sosfiltfilt(sg.butter(2, [300 / (SR / 2), 3400 / (SR / 2)], "band", output="sos"), v44)
    mb = sg.sosfiltfilt(sg.butter(2, [300 / (SR / 2), 3400 / (SR / 2)], "band", output="sos"), mono)
    for k in KEYS:
        a0, a1 = int(max(0, phr[k]["start"] - 0.05) * SR), int(min(TOTAL, phr[k]["end"] + 0.05) * SR)
        xc = sg.correlate(mb[a0:a1], vb[a0:a1], mode="full", method="fft"); lag = int(np.argmax(xc)) - (a1 - a0 - 1)
        lags[k] = round(lag / SR * 1000, 2)

    checks = {
        "mix": {"file": "audio/mix_v2.wav", "samplerate": rate, "channels": nch, "frames": nframes, "expected_frames": N,
                "duration_s": nframes / rate, "expected_duration_s": TOTAL, "duration_exact": bool(nframes == N and rate == SR and nch == 2),
                "lufs_integrated": me["I"], "lufs_target": LUFS_TARGET, "true_peak_dbtp": me["TP"], "tp_target": TP_TARGET, "lra": me["LRA"],
                "sample_peak_dbfs": round(g2db(sample_peak), 2), "samples_at_full_scale": clip_samples,
                "clipping_free": bool(clip_samples == 0 and me["TP"] <= TP_TARGET + 1e-6), "chain": used, "candidates": cand, "loudnorm_pass1": j1, "loudnorm_pass2": j2},
        "voice_vs_music_during_speech": rep_final,
        "voice_dominance_ok": bool(min(r["worst_momentary_voice_minus_music_db"] for r in rep_final.values()) >= 6.0),
        "music_gain_db": round(gm, 2), "mix_levels": {"voice_gain_db": 0.0, "sfx_gain_db": -1.0, "criteria": {"avg_gap_target_db": GAP_TARGET_DB, "momentary_min_db": MOMENTARY_MIN_DB, "bed_min_db": BED_MIN_DB}}, "sidechain": {"mid_depth_db": 9.0, "low_depth_db": 3.5, "sfx_depth_db": depth_sfx, "attack_ms": 20, "release_ms": 300, "lead_ms": 15, "bands": "musique < 160 Hz abaissée de 3,5 dB, > 160 Hz de 9 dB (le kick garde son punch)"},
        "voice_alignment_in_mix_ms": lags,
        "slots": {k: {"duration": phr[k]["duration"], "max": phr[k]["slot_max_duration"], "fits": phr[k]["fits_slot"]} for k in KEYS},
    }

    # ---- fichiers JSON
    transcript = None
    if a.transcribe:
        print("transcription Gemini de mix_v2.wav ...", flush=True)
        txt, model = GV.gemini_transcribe("audio/mix_v2.wav")
        exp = " ".join(TL["voice_text"][k] for k in KEYS)
        transcript = {"model": model, "text": txt, "expected": exp, "similarity": round(GV.text_similarity(exp, txt), 3) if txt else None}
        json.dump(transcript, open("build/mix_v2_transcript.json", "w"), ensure_ascii=False, indent=1)
    elif os.path.exists("build/mix_v2_transcript.json"):
        transcript = json.load(open("build/mix_v2_transcript.json"))
    checks["transcript_mix"] = transcript
    json.dump(checks, open("build/audio_v2_checks.json", "w"), ensure_ascii=False, indent=1)
    s1w = None
    if len(phr["s1"]["sub_groups"]) == 4:
        on_ = [c[0] for c in phr["s1"]["sub_groups"]]
        s1w = {"words": ["Votre", "annonce", "passe", "inaperçue"], "voice_onsets_s": on_, "timeline_words_s": TL["words"],
               "timeline_minus_voice_s": [round(a - b, 3) for a, b in zip(TL["words"], on_)],
               "note": "estimation par pauses d'énergie (4 groupes = 4 mots) ; > 0 : le mot apparaît à l'écran APRÈS qu'il est dit, < 0 : AVANT"}

    timing = {"total": TOTAL, "voice": GV.VOICE, "model": vmeta.get("raw_take", {}).get("model"), "source": vmeta.get("source"),
              "style": vmeta.get("style"), "measured_on": "audio/voice_track_v2.wav (voix traitée seule, parole détectée à -40 dB sous le pic) ; alignement dans le mix vérifié par corrélation (voix vs mix)",
              "phrases": phr, "s1_words_vs_timeline": s1w, "voice_alignment_in_mix_ms": lags, "all_fit_slots": bool(all(phr[k]["fits_slot"] for k in KEYS)),
              "transcripts_per_phrase": next((t.get("transcripts") for t in vmeta.get("takes", []) if t.get("transcripts")), None),
              "transcript_mix": transcript}
    json.dump(timing, open("build/voice_v2_timing.json", "w"), ensure_ascii=False, indent=1)

    lic = [{"pack": p["name"], "license": "CC0 1.0 (Creative Commons Zero)", "license_file": os.path.join(p["dir"], "License.txt"), "verified": p["license_ok"],
            "source": p["zip"] or "sfx_real/interface (déjà présent dans le dépôt, https://kenney.nl/assets/interface-sounds)"} for p in PACKS.values()]
    def fm(path, role):
        d = features(path); return {"file": os.path.relpath(path), "role": role, **{k: d[k] for k in ("dur_ms", "centroid_hz", "flatness", "hi6k", "lo500", "peaks_hz", "f0_note", "f0_cents", "attack_ms")}}
    sfx_map = {
        "licenses": lic,
        "selection_method": "chaque candidat est décodé (ffmpeg), rogné, puis analysé avec numpy : durée active, centroïde spectral, platitude spectrale (tonal vs bruit), "
                            "part d'énergie >6 kHz (stridence) et <500 Hz (coup sourd), temps d'attaque, hauteur dominante et appartenance des 3 pics principaux à la gamme pentatonique de La mineur ; "
                            "le meilleur score de pénalité par rapport au profil visé du type est retenu (build_audio_v2.py --analyse pour le classement).",
        "types": {
            "click": {"files": [fm(chosen["click"][0], "principal"), fm(chosen["click"][1], "variante (alternance 1 sur 2)")],
                      "usage": "mots du hook, vignettes de l'éventail", "treatment": "sons réels non transformés : rognage du silence, normalisation crête, gain -8,5 dB, micro-variation d'intensité, panoramique -0,25..+0,25 sur les 6 vignettes"},
            "tick": {"files": [fm(chosen["tick"][0], "principal"), fm(chosen["tick"][1], "variante (alternance 1 sur 2)")],
                     "usage": "compteur « 10 photos » et anneau « 10 min »", "treatment": "sons réels non transformés, gain -9,5 dB, micro-variation d'intensité"},
            "pop": {"files": [fm(chosen["pop"][0], "principal")], "usage": "apparition du compteur, « = 1 vidéo », anneau, logo, titre CTA",
                    "treatment": "son réel accordé par rééchantillonnage (<= 5 demi-tons) sur une note de l'accord en cours (Fa, Do, Sol, La mineur) ; cibles 784/880/988/880/1175 Hz (hauteurs montantes), gain -8 dB"},
            "ding": {"files": [fm(chosen["ding"][0], "principal")], "usage": "révélation du CTA (7,4 s)",
                     "treatment": "son réel (quintes Ré/La, dans la gamme), gain -10 dB + écho brillant à +110 ms (-10 dB, pan +0,35)"},
            "whoosh": {"layers": [{"kind": "synthèse", "desc": "bruit blanc décorrélé G/D balayé par un filtre passe-bande résonant (SVF, Q 1,3) de 300 à 3300 Hz pendant la montée puis de 3300 à 900 Hz, + couche grave passe-bas 260 Hz ; enveloppe en (t/lead)^2.2 puis décroissance exponentielle ; panoramique balayé G->D / D->G en alternance"},
                                {"kind": "réel (Kenney)", "files": ["sfx_real/interface/Audio/open_003.ogg (+close_003)", "open_002 (+close_002)", "open_004 (+close_004)"],
                                 "desc": "fin du balayage montant open_XXX + début du balayage descendant close_XXX (même timbre en miroir) = air haut naturel, mixé à -16 dB sous le corps (le corps synthétique porte le médium)"}],
                       "timing": "le fichier démarre à t (liste sfx) ; le pic tombe à la coupure/impact suivant (lead = 0,15 s ; 0,20 s avant le drop à 2,0 s) ; variantes « grand » (+2 dB, queue 0,55 s) avant les impacts de 2,0 s et 7,0 s",
                       "treatment": "gain -9,5 dB (+2 dB variante grand), crête normalisée, fondu final 20 ms"},
            "impact": {"layers": [{"kind": "réel (Kenney Impact)", "files": [fm(sfx_path("impact", "impactBell_heavy_000.ogg"), "transitoire cloche lourde, impact CTA 7,0 s (pic ~380 Hz = Sol4)"),
                                                                              fm(sfx_path("impact", "impactBell_heavy_003.ogg"), "transitoire cloche lourde, impact drop 2,0 s (pic ~326 Hz = Mi4)"),
                                                                              fm(sfx_path("impact", "impactPlate_heavy_001.ogg"), "plaque lourde : corps de l'impact (les deux impacts)")]},
                                  {"kind": "réel (Kenney Sci-Fi)", "files": [fm(sfx_path("scifi", "lowFrequency_explosion_000.ogg"), "grondement basse fréquence, CTA (filtre passe-bas 220 Hz)"),
                                                                              fm(sfx_path("scifi", "lowFrequency_explosion_001.ogg"), "grondement basse fréquence, drop (filtre passe-bas 220 Hz)")]},
                                  {"kind": "synthèse", "desc": "sub sinus qui glisse (+55 Hz) vers la tonique de l'accord (Fa1 43,7 Hz à 2,0 s ; La1 55 Hz à 7,0 s) + éclat d'aigus (bruit >3 kHz, 0,2-0,3 s)"}],
                       "why": "le pack Impact Sounds n'a pas de boom cinématique (que des chocs matière) : on empile un choc métallique réel (médium audible sur haut-parleur de téléphone), le grondement réel basse fréquence du pack Sci-Fi et un sub accordé sur la tonique",
                       "treatment": "mêmes sons empilés (transitoire x1,6 / plaque x1,2 / grondement x0,35 / sub x0,45), enveloppes exponentielles (queue ~1,25 s drop / 1,9 s CTA, plus courte pour ne pas gêner « Créez »), gain -2 dB ; mesuré : 120-500 Hz = -9 dB, 500-2000 Hz = -12 à -14 dB, <120 Hz = -3 à -5 dB (part de l'énergie totale)"}},
        "candidates_ranked": cand_report,
        "events": sfx_log,
        "bus": {"normalization": "stem sfx_v2.wav normalisé à 0,9 de crête avant mixage (-1 dB dans le mix)", "duck_under_voice_db": depth_sfx},
    }
    json.dump(sfx_map, open("build/sfx_map_v2.json", "w"), ensure_ascii=False, indent=1)

    print("\n==== RÉSUMÉ ====")
    print(f"mix_v2.wav : {nframes} échantillons ({nframes / rate:.4f} s, attendu {N}), {rate} Hz, {nch} canaux")
    print(f"LUFS intégré {me['I']} (cible {LUFS_TARGET}), true peak {me['TP']} dBTP (cible <= {TP_TARGET}), LRA {me['LRA']}, pic échantillon {g2db(sample_peak):.2f} dBFS, échantillons pleine échelle : {clip_samples}")
    for k in KEYS:
        p = phr[k]; r = rep_final[k]
        print(f"{k}: {p['start']:.2f}-{p['end']:.2f} s ({p['duration']:.2f} s / max {p['slot_max_duration']}) marge {p['margin_s']:.2f} s | voix {r['voice_lufs']} LUFS, musique {r['music_lufs']}, écart {r['voice_minus_music_db']} dB | décalage mix {lags[k]} ms")
    if transcript: print("transcription mix :", transcript["text"], "| similarité", transcript["similarity"])


def write_f32(path, x):
    """Écrit un wav float32 stéréo (WAVE_FORMAT_IEEE_FLOAT)."""
    data = x.astype("<f4").tobytes(); n = len(data)
    with open(path, "wb") as f:
        f.write(b"RIFF" + struct.pack("<I", 36 + n) + b"WAVEfmt " + struct.pack("<IHHIIHH", 16, 3, 2, SR, SR * 8, 8, 32) + b"data" + struct.pack("<I", n) + data)


def read_wav_f32(path):
    """Lit un wav float32 (WAVE_FORMAT_IEEE_FLOAT) écrit par ffmpeg."""
    raw = open(path, "rb").read()
    i = raw.index(b"data"); n = int.from_bytes(raw[i + 4:i + 8], "little")
    j = raw.index(b"fmt "); ch = int.from_bytes(raw[j + 10:j + 12], "little")
    a = np.frombuffer(raw[i + 8:i + 8 + n], dtype="<f4").astype(np.float64)
    return a.reshape(-1, ch), SR


if __name__ == "__main__":
    main()
