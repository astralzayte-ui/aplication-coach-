# Consignes pour Claude

## Assimilation de vidéos
Quand l'utilisateur envoie un lien YouTube avec « assimile cette vidéo » (ou équivalent) :
1. Récupérer la transcription (outil `youtube_video_transcript`) et les infos de la vidéo (`youtube_video`).
2. Écrire une fiche dans `knowledge/<slug>.md` en suivant le format de `knowledge/README.md`.
3. Ajouter une ligne à l'index de `knowledge/README.md`.
4. Commiter et pousser.

Avant de répondre à une question sur le coaching ou l'appli, consulter les fiches de `knowledge/`.
