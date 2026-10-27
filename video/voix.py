#!/usr/bin/env python3
"""Prépare les voix off et calcule le minutage de la vidéo.

Pour chaque fichier de public/voice : raccourcit les pauses, accélère la voix,
puis écrit dans src/minutage.json la durée de chaque scène et le début de chaque sous-titre.

Usage (depuis le dossier video/) : python3 voix.py
"""
import json
import re
import subprocess

FPS = 30
TEMPO = 1.3          # vitesse de la voix (1.3 = 30 % plus rapide) ; le français passe à 1.2
TEMPO_FR = 1.2
PAUSE = 0.10         # durée max d'une pause entre deux morceaux de phrase (s)
DEBUT = 4            # frame où la voix démarre dans chaque scène

# Pour chaque vidéo, une entrée par scène : fichier source, début de chaque sous-titre dans le fichier
# d'origine (secondes, repérés aux pauses), frames gardées après la voix (temps de lecture).
VOIX = {
    'ar': [
        ('v0.mp3', [0, 2.77, 5.40, 6.99], 12),
        ('v1.mp3', [0, 1.58, 5.17, 8.60], 10),
        ('vvoc.mp3', [0, 2.39, 4.66], 12),
        ('v2b.mp3', [0, 4.67, 8.44], 10),
        ('v3.mp3', [0, 2.02, 3.50], 18),
        ('v4b.mp3', [0, 2.87, 4.56], 45),
    ],
    'fr': [
        ('f0.mp3', [0.11, 1.58, 4.04, 5.41], 12),
        ('f1.mp3', [0, 1.52, 5.16, 7.85], 10),
        ('fvoc.mp3', [0, 2.01, 3.97], 12),
        ('f2b.mp3', [0, 2.81, 6.14], 10),
        ('f3.mp3', [0, 1.64, 3.35], 18),
        ('f4b.mp3', [0, 2.20, 3.47], 45),
    ],
    # Pubs de la semaine (pubs/semaine-27-10.md)
    'v01': [
        ('p01a.mp3', [0, 3.72, 5.79], 14),
        ('p01b.mp3', [0, 1.59, 5.34], 10),
        ('p01c.mp3', [0, 3.09], 40),
    ],
    'v02': [
        ('p02a.mp3', [0, 1.65, 4.50, 7.88], 12),
        ('p02b.mp3', [0, 4.24], 10),
        ('p02c.mp3', [0], 40),
    ],
}


def duree(chemin):
    out = subprocess.run(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', chemin],
                         capture_output=True, text=True, check=True).stdout
    return float(out)


def silences(chemin):
    err = subprocess.run(['ffmpeg', '-i', chemin, '-af', 'silencedetect=noise=-38dB:d=0.09', '-f', 'null', '-'],
                         capture_output=True, text=True).stderr
    debuts = [float(x) for x in re.findall(r'silence_start: ([\d.]+)', err)]
    fins = [float(x) for x in re.findall(r'silence_end: ([\d.]+)', err)]
    return list(zip(debuts, fins))


def preparer(source, sortie, tempo):
    """Raccourcit les pauses et accélère. Renvoie une fonction : temps d'origine -> temps dans le nouveau fichier."""
    total = duree(source)
    retire = []
    for a, b in silences(source):
        if a <= 0.01:
            retire.append((0, b))
        elif b >= total - 0.01:
            retire.append((a, total))
        elif b - a > PAUSE:
            retire.append((a + PAUSE / 2, b - PAUSE / 2))
    garde, t = [], 0.0
    for a, b in retire:
        if a > t:
            garde.append((t, a))
        t = b
    if t < total:
        garde.append((t, total))

    morceaux = ''.join(
        f'[0:a]atrim=start={a:.3f}:end={b:.3f},asetpts=PTS-STARTPTS,afade=t=in:d=0.005,afade=t=out:st={b - a - 0.005:.3f}:d=0.005[m{i}];'
        for i, (a, b) in enumerate(garde))
    liens = ''.join(f'[m{i}]' for i in range(len(garde)))
    filtre = f'{morceaux}{liens}concat=n={len(garde)}:v=0:a=1,atempo={tempo},loudnorm=I=-16:TP=-1.5[s]'
    subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', source, '-filter_complex', filtre, '-map', '[s]', '-ar', '44100', sortie],
                   check=True)
    return lambda x: (x - sum(max(0.0, min(b, x) - a) for a, b in retire)) / tempo


minutage = {}
for langue, fichiers in VOIX.items():
    m = {'durees': [], 'debuts': [], 'fins': []}
    for i, (source, coupes, queue) in enumerate(fichiers):
        sortie = f'public/voice/{langue}{i}.wav'
        nouveau = preparer(f'public/voice/{source}', sortie, TEMPO_FR if langue == 'fr' else TEMPO)
        voix = round(duree(sortie) * FPS)
        m['debuts'].append([DEBUT + round(nouveau(c) * FPS) for c in coupes])
        m['fins'].append(DEBUT + voix + 6)
        m['durees'].append(DEBUT + voix + queue)
    minutage[langue] = m
    print(langue, 'total', round(sum(m['durees']) / FPS, 1), 's', m['durees'])

with open('src/minutage.json', 'w') as f:
    json.dump(minutage, f, indent=1)
