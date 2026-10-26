---
name: analyse-youtube
description: Analyse une vidéo YouTube (ou Short) nativement avec Gemini, image et son compris, en basculant automatiquement de modèle Gemini quand l'un atteint son quota. Utilise ce skill dès que l'utilisateur envoie un lien YouTube ou demande d'analyser, résumer, décortiquer une vidéo YouTube.
---

# Analyse de vidéos YouTube via Gemini

## Fonctionnement
- La session a une clé API Gemini injectée par le proxy pour `generativelanguage.googleapis.com` : aucune clé à fournir.
- Gemini lit les liens YouTube nativement (`file_data.file_uri` = URL YouTube).
- La clé est sur la **version gratuite de l'API**. L'abonnement Gemini Pro de l'utilisateur ne s'applique PAS à l'API (c'est séparé chez Google) : ne pas le lui reproposer.
- Le quota gratuit est **compté par modèle** (~20 requêtes/jour/modèle) et environ **8 h de vidéo YouTube par jour** au total.

## Utilisation
Lancer le script, qui essaie les modèles dans l'ordre et passe au suivant sur 429 / 503 / 404 :

```bash
.claude/skills/analyse-youtube/scripts/gemini_youtube.sh "<url>" "<consigne précise>"
```

Adapter la consigne à la demande (hook, script, structure, montage, CTA, etc.). Le modèle utilisé s'affiche sur stderr.

## Si tout échoue
1. Quota du jour épuisé → le dire en une ligne, proposer d'attendre la remise à zéro quotidienne ou d'activer la facturation sur aistudio.google.com.
2. En attendant : récupérer la transcription via l'outil `v1_youtube_video_transcript` (scrape_reseaux) et analyser soi-même.

## Mettre à jour la liste des modèles
Si beaucoup de 404 : lister les modèles disponibles et mettre à jour `MODELS` dans le script.

```bash
curl -sS "https://generativelanguage.googleapis.com/v1beta/models?pageSize=100" | jq -r '.models[].name'
```
