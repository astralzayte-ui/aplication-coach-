#!/usr/bin/env python3
"""Voix off v2 (ImmoClap, story 9,5 s) : Gemini TTS, voix « Sulafat » (chaleureuse).

Lancer depuis /home/user/aplication-coach-/immo-motion :
    python3 gen_voice_v2.py              # génère N prises, choisit la meilleure, découpe en 3 phrases
    python3 gen_voice_v2.py --reuse      # ne rappelle pas l'API : redécoupe audio/voice_v2.wav
    python3 gen_voice_v2.py --per-phrase # force une prise par phrase (repli)

Sorties (audio/) :
    voice_v2.wav            prise brute retenue (24 kHz mono), les 3 phrases
    s1_v2.wav s2_v2.wav s3_v2.wav   phrases découpées (silences rognés, atempo <= 1,12 si besoin)
    voice_v2_takes.json     détails : modèle, prises, durées vs créneaux, atempo, transcriptions
    candidates/voice_v2_take*.wav   toutes les prises essayées

Le texte et les instants viennent de timeline_v2.json (jamais modifié ici).
"""
import argparse, base64, difflib, json, os, re, subprocess, sys, tempfile, time, unicodedata, wave
import numpy as np

HERE = os.path.dirname(os.path.abspath(__file__))
os.chdir(HERE)

TL = json.load(open("timeline_v2.json"))
KEYS = ["s1", "s2", "s3"]
TEXT = {k: TL["voice_text"][k] for k in KEYS}
START = {k: TL["voice"][k] for k in KEYS}
TOTAL = TL["total"]

SR = 24000                       # fréquence native de Gemini TTS
VOICE = "Sulafat"
MODELS = ["gemini-3.1-flash-tts-preview", "gemini-3.8-flash-tts"]   # le 2e est lent : dernier recours
SLOT_MAX = {"s1": 1.8, "s2": 4.8, "s3": 2.0}                       # durées max de la spec (s)
MAX_ATEMPO = 1.12
PRE = 0.020                      # silence conservé avant le début de parole dans s*_v2.wav (s)
POST = 0.090                     # queue conservée après la fin de parole (s)
EXPECTED_TAKE = 8.3              # durée attendue d'une prise unique (s) ; > 1,5x => on réessaie

STYLE = ("Lis ce texte publicitaire en français avec une voix de femme chaleureuse, souriante et naturelle, "
         "au rythme vivant et enjoué, sans traîner, avec de courtes pauses entre les trois phrases ; "
         "la dernière phrase est un appel à l'action dit avec assurance, un peu plus posé : ")
STYLE_ONE = ("Dis cette phrase publicitaire en français avec une voix de femme chaleureuse, souriante et naturelle, "
             "au rythme vivant et enjoué, sans traîner : ")
SEPARATOR = " ... "

TRANSCRIBE_MODELS = ["gemini-flash-latest", "gemini-3.8-flash", "gemini-3.7-flash", "gemini-3.5-flash",
                     "gemini-3-flash-preview", "gemini-2.5-flash"]
API = "https://generativelanguage.googleapis.com/v1beta/models"


# ------------------------------------------------------------------ utilitaires audio
def read_wav(path):
    w = wave.open(path)
    sr, n, ch = w.getframerate(), w.getnframes(), w.getnchannels()
    a = np.frombuffer(w.readframes(n), dtype=np.int16).astype(np.float32) / 32768
    w.close()
    if ch > 1:
        a = a.reshape(-1, ch).mean(1)
    return a, sr


def write_wav(path, x, sr=SR):
    x = np.asarray(x, dtype=np.float64)
    w = wave.open(path, "wb")
    w.setnchannels(1); w.setsampwidth(2); w.setframerate(sr)
    w.writeframes(np.clip(np.round(x * 32768), -32768, 32767).astype(np.int16).tobytes())
    w.close()


def frames_db(x, sr, hop_s=0.005, win_s=0.010):
    """Niveau RMS (dBFS) par trame ; la trame i est centrée sur i*hop."""
    hop, win = int(hop_s * sr), int(win_s * sr)
    c = np.concatenate([[0.0], np.cumsum(x.astype(np.float64) ** 2)])
    n = max(0, (len(x) - win) // hop + 1)
    idx = np.arange(n) * hop
    ms = (c[idx + win] - c[idx]) / win
    return 10 * np.log10(ms + 1e-12), hop / sr, win / sr


def speech_bounds(x, sr, rel_db=-40.0, floor_db=-70.0, min_run=0.012):
    """Début et fin (s) de la parole : première/dernière trame au-dessus de max+rel_db (run >= min_run)."""
    db, hop, win = frames_db(x, sr)
    thr = max(db.max() + rel_db, floor_db)
    act = db > thr
    need = max(1, int(round(min_run / hop)))
    # une trame ne compte que si elle appartient à un run actif d'au moins `need` trames
    ok = np.zeros_like(act)
    i = 0
    while i < len(act):
        if act[i]:
            j = i
            while j < len(act) and act[j]:
                j += 1
            if j - i >= need:
                ok[i:j] = True
            i = j
        else:
            i += 1
    idx = np.where(ok)[0]
    if len(idx) == 0:
        return 0.0, len(x) / sr
    return idx[0] * hop, idx[-1] * hop + win


def split_phrases(x, sr):
    """Découpe une prise unique en 3 phrases d'après les deux pauses les plus plausibles. None si impossible."""
    db, hop, win = frames_db(x, sr, 0.01, 0.01)
    thr = db.max() - 45
    act = db > thr
    on = np.where(act)[0]
    if len(on) == 0:
        return None
    a0, a1 = on[0], on[-1]
    gaps, i = [], a0
    while i <= a1:
        if not act[i]:
            j = i
            while j <= a1 and not act[j]:
                j += 1
            if (j - i) * hop >= 0.12:
                gaps.append((i * hop, j * hop))
            i = j
        else:
            i += 1
    if len(gaps) < 2:
        return None
    # fractions attendues d'après le nombre de caractères (départage les pauses internes d'une phrase)
    n = [len(TEXT[k]) for k in KEYS]
    exp1, exp2 = n[0] / sum(n), (n[0] + n[1]) / sum(n)
    t0, t1 = a0 * hop, a1 * hop
    best, best_cost = None, 1e9
    for p in range(len(gaps)):
        for q in range(p + 1, len(gaps)):
            f1 = ((gaps[p][0] + gaps[p][1]) / 2 - t0) / (t1 - t0)
            f2 = ((gaps[q][0] + gaps[q][1]) / 2 - t0) / (t1 - t0)
            cost = abs(f1 - exp1) + abs(f2 - exp2) - 0.6 * ((gaps[p][1] - gaps[p][0]) + (gaps[q][1] - gaps[q][0]))
            if cost < best_cost:
                best, best_cost = (gaps[p], gaps[q]), cost
    (g1, g2) = best
    cuts = [0, int((g1[0] + g1[1]) / 2 * sr), int((g2[0] + g2[1]) / 2 * sr), len(x)]
    return [x[cuts[i]:cuts[i + 1]] for i in range(3)], [(g1, g2)]


def atempo(x, sr, factor):
    if abs(factor - 1) < 1e-4:
        return x
    with tempfile.TemporaryDirectory() as d:
        a, b = os.path.join(d, "a.wav"), os.path.join(d, "b.wav")
        write_wav(a, x, sr)
        subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", a, "-af", f"atempo={factor:.5f}", b], check=True)
        y, _ = read_wav(b)
    return y


def trim_phrase(x, sr):
    """Rogne le silence : renvoie (audio avec PRE avant la parole et POST après, durée de parole)."""
    on, off = speech_bounds(x, sr)
    i0 = max(0, int((on - PRE) * sr))
    i1 = min(len(x), int((off + POST) * sr))
    y = x[i0:i1].copy()
    fi, fo = int(0.004 * sr), int(0.060 * sr)
    y[:fi] *= np.linspace(0, 1, fi)
    y[-fo:] *= np.linspace(1, 0, fo)
    pre = on - i0 / sr
    return y, off - on, pre


# ------------------------------------------------------------------ Gemini
def curl_json(url, body, timeout=180):
    with tempfile.NamedTemporaryFile("w", suffix=".json", delete=False) as f:
        json.dump(body, f)
        path = f.name
    try:
        r = subprocess.run(["curl", "-sS", "-m", str(timeout), "-X", "POST", url, "-H", "Content-Type: application/json",
                            "-d", "@" + path], capture_output=True, text=True)
    finally:
        os.unlink(path)
    try:
        return json.loads(r.stdout)
    except Exception:
        return {"error": {"code": 0, "message": (r.stdout or r.stderr)[:200]}}


def tts(text, style, model, attempts=4):
    body = {"contents": [{"parts": [{"text": style + text}]}],
            "generationConfig": {"responseModalities": ["AUDIO"],
                                 "speechConfig": {"voiceConfig": {"prebuiltVoiceConfig": {"voiceName": VOICE}}}}}
    last = None
    for a in range(attempts):
        t0 = time.time()
        d = curl_json(f"{API}/{model}:generateContent", body)
        try:
            pcm = base64.b64decode(d["candidates"][0]["content"]["parts"][0]["inlineData"]["data"])
            return np.frombuffer(pcm, dtype=np.int16).astype(np.float32) / 32768, time.time() - t0
        except Exception:
            last = json.dumps(d)[:160]
            print(f"   [{model}] essai {a + 1} échoué : {last}", flush=True)
            time.sleep(3 + 3 * a)
    print(f"   [{model}] abandon : {last}", flush=True)
    return None, 0.0


def norm_text(s):
    s = unicodedata.normalize("NFKD", s.lower())
    s = "".join(c for c in s if not unicodedata.combining(c))
    s = s.replace("immoclap", "immo clap").replace("immo-clap", "immo clap")
    s = re.sub(r"\b10\b", "dix", s)
    s = re.sub(r"[^a-z0-9 ]+", " ", s)
    return re.sub(r"\s+", " ", s).strip()


def text_similarity(expected, got):
    a, b = norm_text(expected).split(), norm_text(got).split()
    return difflib.SequenceMatcher(None, a, b).ratio()


def gemini_transcribe(wav_path, models=TRANSCRIBE_MODELS):
    """Transcription par Gemini : audio mp3 en base64 écrit dans un fichier, curl -d @fichier, repli de modèle."""
    with tempfile.TemporaryDirectory() as d:
        mp3 = os.path.join(d, "a.mp3")
        subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", wav_path, "-ac", "1", "-ar", "24000", "-b:a", "64k", mp3], check=True)
        b64 = base64.b64encode(open(mp3, "rb").read()).decode()
        body = {"contents": [{"parts": [
            {"inline_data": {"mime_type": "audio/mp3", "data": b64}},
            {"text": "Transcris mot pour mot ce qui est dit dans cet audio (français). Réponds uniquement par la "
                     "transcription, sans commentaire, avec la ponctuation."}]}],
            "generationConfig": {"temperature": 0}}
        path = os.path.join(d, "body.json")
        json.dump(body, open(path, "w"))
        for m in models:
            for a in range(3):
                r = subprocess.run(["curl", "-sS", "-m", "120", "-X", "POST", f"{API}/{m}:generateContent",
                                    "-H", "Content-Type: application/json", "-d", "@" + path], capture_output=True, text=True)
                try:
                    j = json.loads(r.stdout)
                except Exception:
                    j = {"error": {"code": 0, "message": r.stdout[:100]}}
                if "error" not in j:
                    try:
                        txt = "".join(p.get("text", "") for p in j["candidates"][0]["content"]["parts"] if not p.get("thought"))
                        if txt.strip():
                            return txt.strip(), m
                    except Exception:
                        pass
                code = j.get("error", {}).get("code")
                print(f"   transcription [{m}] erreur {code}", flush=True)
                if code == 503:
                    time.sleep(2 + 2 * a)
                    continue
                break      # 429/404/autre : modèle suivant
    return None, None


# ------------------------------------------------------------------ prises
def evaluate(phrases):
    """Pour chaque phrase : durée de parole, atempo nécessaire, ok/pas ok. + coût de préférence."""
    info, cost, ok = {}, 0.0, True
    for k, p in zip(KEYS, phrases):
        on, off = speech_bounds(p, SR)
        dur = off - on
        need = max(1.0, dur / (SLOT_MAX[k] * 0.985))          # petite marge sous le créneau
        fits = need <= MAX_ATEMPO
        ok &= fits
        r = dur / need / SLOT_MAX[k]
        cost += (need - 1) * 10 + max(0, r - 0.95) * 10 + max(0, 0.45 - r) * 2
        info[k] = {"dur": round(dur, 3), "atempo": round(need, 4), "fits": fits}
    return ok, cost, info


def make_single_takes(n_takes):
    takes = []
    text = SEPARATOR.join(TEXT[k] for k in KEYS)
    os.makedirs("audio/candidates", exist_ok=True)
    for i in range(n_takes):
        for m in MODELS:
            x, took = tts(text, STYLE, m)
            if x is None:
                continue
            dur = len(x) / SR
            print(f" prise {i + 1} [{m}] : {dur:.2f} s en {took:.1f} s", flush=True)
            if dur > 1.5 * EXPECTED_TAKE:
                print("   trop long (> 1,5x l'attendu), on réessaie", flush=True)
                continue
            write_wav(f"audio/candidates/voice_v2_take{i + 1}.wav", x)
            takes.append({"i": i + 1, "model": m, "x": x, "gen_s": round(took, 1)})
            break
    return takes


def finalize(chosen_phrases, source):
    """Écrit s1..s3_v2.wav (atempo si besoin) et renvoie les infos."""
    out = {}
    for k, p in zip(KEYS, chosen_phrases):
        on, off = speech_bounds(p, SR)
        dur = off - on
        need = max(1.0, dur / (SLOT_MAX[k] * 0.985))
        if need > MAX_ATEMPO + 1e-6:
            raise SystemExit(f"{k} : {dur:.2f} s ne rentre pas dans {SLOT_MAX[k]} s même à atempo {MAX_ATEMPO}")
        q = atempo(p, SR, need) if need > 1.0005 else p
        y, sdur, pre = trim_phrase(q, SR)
        write_wav(f"audio/{k}_v2.wav", y)
        out[k] = {"file": f"audio/{k}_v2.wav", "speech_dur": round(sdur, 3), "pre_roll": round(pre, 4),
                  "raw_dur": round(dur, 3), "atempo": round(need, 4) if need > 1.0005 else 1.0,
                  "slot_max": SLOT_MAX[k], "source": source}
    return out


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--takes", type=int, default=3)
    ap.add_argument("--reuse", action="store_true", help="réutilise audio/voice_v2.wav (aucun appel API de synthèse)")
    ap.add_argument("--per-phrase", action="store_true")
    ap.add_argument("--no-verify", action="store_true", help="saute la transcription Gemini des 3 phrases")
    a = ap.parse_args()
    os.makedirs("audio", exist_ok=True)
    meta = {"voice": VOICE, "style": STYLE, "text": TEXT, "slots": SLOT_MAX, "max_atempo": MAX_ATEMPO}

    chosen, source, phrases = None, None, None
    if a.reuse and os.path.exists("audio/voice_v2.wav") and not a.per_phrase:
        x, sr = read_wav("audio/voice_v2.wav")
        assert sr == SR
        sp = split_phrases(x, SR)
        if sp is None:
            raise SystemExit("--reuse : impossible de découper audio/voice_v2.wav en 3 phrases")
        phrases = sp[0]
        ok, cost, info = evaluate(phrases)
        old = json.load(open("audio/voice_v2_takes.json")) if os.path.exists("audio/voice_v2_takes.json") else {}
        chosen = {"x": x, "model": old.get("raw_take", {}).get("model", "reuse"), "i": 0}
        source = old.get("source", "single-take (réutilisée)")
        meta["takes"] = old.get("takes") or [{"i": 0, "model": "reuse", "info": info, "ok": ok}]      # garde les transcriptions déjà vérifiées
    elif not a.per_phrase:
        takes = make_single_takes(a.takes)
        scored = []
        for t in takes:
            sp = split_phrases(t["x"], SR)
            if sp is None:
                print(f" prise {t['i']} : découpe en 3 phrases impossible", flush=True)
                continue
            ok, cost, info = evaluate(sp[0])
            t.update(phrases=sp[0], ok=ok, cost=cost, info=info)
            print(f" prise {t['i']} : " + " | ".join(f"{k} {v['dur']:.2f}s (x{v['atempo']:.3f})" for k, v in info.items())
                  + f" | ok={ok} coût={cost:.2f}", flush=True)
            scored.append(t)
        meta["takes"] = [{"i": t["i"], "model": t["model"], "gen_s": t["gen_s"], "ok": t["ok"], "cost": round(t["cost"], 3),
                          "info": t["info"]} for t in scored]
        scored = sorted([t for t in scored if t["ok"]], key=lambda t: t["cost"])
        # vérification par transcription, de la meilleure à la moins bonne
        for t in scored:
            if a.no_verify:
                chosen = t; break
            good = True; trs = {}
            with tempfile.TemporaryDirectory() as d:
                for k, p in zip(KEYS, t["phrases"]):
                    f = os.path.join(d, k + ".wav"); write_wav(f, p)
                    txt, m = gemini_transcribe(f)
                    sim = text_similarity(TEXT[k], txt) if txt else 0.0
                    trs[k] = {"text": txt, "model": m, "similarity": round(sim, 3)}
                    print(f"   prise {t['i']} {k} -> « {txt} » (sim {sim:.2f})", flush=True)
                    good &= sim >= 0.8
            t["transcripts"] = trs
            for m_ in meta["takes"]:
                if m_["i"] == t["i"]:
                    m_["transcripts"] = trs
            if good:
                chosen = t; break
        if chosen:
            phrases = chosen["phrases"]; source = f"single-take #{chosen['i']}"

    if chosen is None:
        print(" repli : une prise par phrase", flush=True)
        phrases, parts = [], {}
        for k in KEYS:
            best = None
            for att in range(4):
                for m in MODELS:
                    x, took = tts(TEXT[k], STYLE_ONE, m)
                    if x is None:
                        continue
                    on, off = speech_bounds(x, SR)
                    need = (off - on) / (SLOT_MAX[k] * 0.985)
                    print(f"  {k} [{m}] {off - on:.2f} s (atempo {max(1, need):.3f})", flush=True)
                    if need <= MAX_ATEMPO and (best is None or off - on < best[1]):
                        best = (x, off - on, m)
                    break
                if best:
                    break
            if best is None:
                raise SystemExit(f"{k} : aucune prise ne rentre dans le créneau")
            phrases.append(best[0]); parts[k] = best[2]
        gap = np.zeros(int(0.45 * SR), dtype=np.float32)
        raw = np.concatenate([phrases[0], gap, phrases[1], gap, phrases[2]])
        chosen = {"x": raw, "model": "per-phrase", "i": 0}
        source = "per-phrase"
        meta["per_phrase_models"] = parts

    write_wav("audio/voice_v2.wav", chosen["x"])
    res = finalize(phrases, source)
    meta["source"] = source
    meta["phrases"] = res
    meta["raw_take"] = {"file": "audio/voice_v2.wav", "duration": round(len(chosen["x"]) / SR, 3), "model": chosen["model"]}
    json.dump(meta, open("audio/voice_v2_takes.json", "w"), ensure_ascii=False, indent=1)
    print("voix v2 :", source)
    for k in KEYS:
        r = res[k]
        end = START[k] + r["speech_dur"]
        print(f"  {k} : {r['speech_dur']:.2f} s (créneau {r['slot_max']} s, atempo {r['atempo']}) -> {START[k]:.2f}-{end:.2f} s")


if __name__ == "__main__":
    main()
