# Consignes pour Claude

## Suivi du projet
Quand l'utilisateur demande « on en est où » (ou équivalent) : afficher `plan.md` en résumé
(fait / en cours / prochaine action concrète + sa durée réaliste). Mettre `plan.md` à jour dès qu'une étape avance.
Donner des durées réalistes, jamais gonflées.

## Assimilation de vidéos
Quand l'utilisateur envoie un lien YouTube avec « assimile cette vidéo » (ou équivalent) :
1. Récupérer la transcription (outil `youtube_video_transcript`) et les infos de la vidéo (`youtube_video`).
2. Écrire une fiche dans `knowledge/<slug>.md` en suivant le format de `knowledge/README.md`.
3. Ajouter une ligne à l'index de `knowledge/README.md`.
4. Commiter et pousser.

Avant de répondre à une question sur le coaching ou l'appli, consulter les fiches de `knowledge/`.

## Coûts
Les coûts par client et les charges fixes sont dans `couts.md`. Le mettre à jour si un prix change ou si un outil est ajouté.
