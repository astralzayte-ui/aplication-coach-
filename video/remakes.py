#!/usr/bin/env python3
"""Prépare les voix des 3 vidéos refaites d'après des vidéos concurrentes (public/remakes).

Même traitement que voix.py (pauses raccourcies, voix accélérée). Écrit src/remakes.json :
pour chaque voix, sa durée (frames) et le début de chaque sous-titre (frames).
Usage (depuis video/) : python3 remakes.py
"""
import json

from voix import FPS, duree, preparer

TEMPO = 1.25  # un peu moins rapide que les pubs : ce sont des personnes qui parlent face caméra

# fichier source (public/remakes) : début de chaque sous-titre dans le fichier d'origine (secondes)
VOIX = {
    'a_corps': [0, 1.69, 3.81, 6.26, 7.81, 9.92, 14.13, 16.16, 20.03, 22.24],
    'c_intro': [0, 3.02, 5.27, 5.98, 7.43, 10.91],
    'c_missions': [0, 1.68, 3.50, 6.14, 9.70, 11.34, 14.03, 16.55, 18.53, 20.11, 21.41],
    'c_fin': [0.10, 2.15, 4.54, 6.85, 10.38],
}

if __name__ == '__main__':
    sortie = {}
    for nom, coupes in VOIX.items():
        nouveau = preparer(f'public/remakes/{nom}.mp3', f'public/remakes/{nom}.wav', TEMPO)
        sortie[nom] = {'duree': round(duree(f'public/remakes/{nom}.wav') * FPS), 'debuts': [round(nouveau(c) * FPS) for c in coupes]}
        print(nom, sortie[nom])
    with open('src/remakes.json', 'w') as f:
        json.dump(sortie, f, indent=1)
