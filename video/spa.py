#!/usr/bin/env python3
"""Prépare la pub motion design d'un spa (src/Spa.tsx) : voix off, minutage, musique.

Voix : même traitement que voix.py (pauses raccourcies, voix accélérée).
Minutage : début de chaque phrase (repéré aux pauses du fichier d'origine), groupé par scène,
écrit dans src/spa.json (frames locales à chaque scène).
Musique : ambiance marocaine synthétisée (bourdon, oud en mode hijaz, bendir), sans droits à payer.

Usage (depuis video/) : python3 spa.py   (numpy requis pour la musique)
"""
import json
import subprocess

from voix import FPS, duree, preparer

TEMPO = 1.3
DEBUT = 6     # frame où la voix démarre
FIN = 75      # frames gardées après la voix (carte finale)

# Pour chaque pub : voix source (public/spa), puis par scène le début de chaque phrase dans le fichier d'origine (s).
SPAS = {
    'andalous_ar': ('voix_ar3.wav', [
        [0, 3.75],                       # accroche
        [7.82, 10.93, 12.11, 13.73],     # rituel : savon beldi, kessa, eau de fleur d'oranger, ghassoul
        [17.87, 21.09],                  # résultat
        [23.50, 25.23, 26.61],           # confiance
        [28.72, 30.81],                  # note Google
        [33.93, 35.37, 37.25, 38.90],    # horaires, lieu
        [40.25, 41.85, 44.14],           # fin : nom, « appelez-nous à ce numéro », « pour nos disponibilités »
    ]),
}


def musique(sortie, secondes=40, sr=44100):
    import numpy as np
    rng = np.random.default_rng(7)
    n = int(secondes * sr)
    t = np.arange(n) / sr
    mix = np.zeros(n)

    # Bourdon (ré + la) qui respire doucement
    for f0, v in [(73.42, 0.16), (110.0, 0.08), (146.83, 0.05)]:
        for d in (-0.4, 0.4):
            mix += v * np.sin(2 * np.pi * (f0 + d) * t) * (0.75 + 0.25 * np.sin(2 * np.pi * t / 9))

    # Oud : cordes pincées (Karplus-Strong), mode hijaz sur ré
    def corde(f, dur=2.6, force=1.0):
        m = int(dur * sr)
        p = int(sr / f)
        buf = rng.uniform(-1, 1, p)
        y = np.zeros(m)
        for i in range(m):
            y[i] = buf[i % p]
            buf[i % p] = 0.497 * (buf[i % p] + buf[(i + 1) % p])
        return force * y * np.exp(-np.arange(m) / sr * 1.6)

    hijaz = {'D': 146.83, 'Eb': 155.56, 'F#': 185.0, 'G': 196.0, 'A': 220.0, 'Bb': 233.08, 'C': 261.63, 'D2': 293.66}
    noir = 60 / 72  # 72 battements par minute
    phrase = [('D', 1), ('Eb', .5), ('F#', .5), ('G', 1), ('F#', .5), ('Eb', .5), ('D', 2),
              ('A', 1), ('Bb', .5), ('A', .5), ('G', 1), ('F#', .5), ('G', .5), ('A', 2),
              ('D2', 1), ('C', .5), ('Bb', .5), ('A', 1), ('G', .5), ('F#', .5), ('Eb', 1), ('D', 3)]
    pos = 2 * noir
    while pos < secondes - 4:
        for note, d in phrase:
            if pos >= secondes - 4:
                break
            s = corde(hijaz[note], force=0.32 if d < 1 else 0.4)
            i = int(pos * sr)
            mix[i:i + len(s)] += s[:n - i]
            pos += d * noir

    # Bendir : « doum » grave sur 1 et 3, « tak » léger sur le contretemps
    def frappe(grave):
        m = int(0.5 * sr)
        tt = np.arange(m) / sr
        if grave:
            f = 52 + 50 * np.exp(-tt * 30)
            return 0.55 * np.sin(2 * np.pi * np.cumsum(f) / sr) * np.exp(-tt * 9)
        return 0.10 * rng.uniform(-1, 1, m) * np.exp(-tt * 40)

    temps = 4 * noir
    while temps < secondes - 3:
        for k, grave in [(0, True), (1.5, False), (2, True), (3.5, False)]:
            i = int((temps + k * noir) * sr)
            s = frappe(grave)
            mix[i:i + len(s)] += s[:n - i]
        temps += 4 * noir

    # Réverbération (convolution avec une queue de bruit) puis fondus
    ir = rng.standard_normal(int(1.8 * sr)) * np.exp(-np.arange(int(1.8 * sr)) / sr * 3.2)
    ir[0] = 6
    taille = 1 << int(np.ceil(np.log2(n + len(ir))))
    mix = np.fft.irfft(np.fft.rfft(mix, taille) * np.fft.rfft(ir, taille), taille)[:n]
    mix *= np.clip(t / 2.5, 0, 1) * np.clip((secondes - t) / 3, 0, 1)
    mix = (mix / np.max(np.abs(mix)) * 0.8 * 32767).astype(np.int16)

    import wave
    with wave.open(sortie, 'wb') as w:
        w.setnchannels(1)
        w.setsampwidth(2)
        w.setframerate(sr)
        w.writeframes(mix.tobytes())
    subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', sortie, '-af', 'lowpass=f=5200,loudnorm=I=-20:TP=-2', '-ar', '44100',
                    sortie.replace('.wav', '.mp3')], check=True)


if __name__ == '__main__':
    sortie = {}
    for nom, (source, scenes) in SPAS.items():
        voix = f'public/spa/{nom}.wav'
        nouveau = preparer(f'public/spa/{source}', voix, TEMPO)
        fin_voix = DEBUT + round(duree(voix) * FPS)
        debuts = [DEBUT + round(nouveau(s[0]) * FPS) - (0 if i == 0 else 4) for i, s in enumerate(scenes)]
        debuts[0] = 0
        total = fin_voix + FIN
        bornes = debuts + [total]
        liste = []
        for i, coupes in enumerate(scenes):
            phrases = [DEBUT + round(nouveau(c) * FPS) - bornes[i] for c in coupes]
            fins = phrases[1:] + [(bornes[i + 1] if i + 1 < len(scenes) else fin_voix + 10) - bornes[i]]
            liste.append({'de': bornes[i], 'duree': bornes[i + 1] - bornes[i], 'phrases': [[a, b] for a, b in zip(phrases, fins)]})
        sortie[nom] = {'voix': f'spa/{nom}.wav', 'duree': total, 'scenes': liste}
        print(nom, round(total / FPS, 1), 's', [s['duree'] for s in liste])
    with open('src/spa.json', 'w') as f:
        json.dump(sortie, f, indent=1)
    musique('public/spa/musique.wav')
    print('musique ok')
