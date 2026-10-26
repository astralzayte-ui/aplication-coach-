#!/usr/bin/env bash
# Analyse une vidéo YouTube avec Gemini (lecture native image + son).
# Bascule automatiquement de modèle si l'un est saturé (503), hors quota (429) ou retiré (404).
# Usage : gemini_youtube.sh "<url_youtube>" "<consigne>"
set -u
URL="${1:?url YouTube manquante}"
PROMPT="${2:-Analyse cette vidéo en détail : sujet, structure, hook, messages clés, points forts et faibles.}"

# Ordre de préférence. Le quota gratuit est compté par modèle.
MODELS=(
  gemini-3.8-flash
  gemini-3.7-flash
  gemini-3.6-flash
  gemini-3.5-flash
  gemini-3-flash-preview
  gemini-3.1-flash-lite
  gemini-flash-latest
  gemini-flash-lite-latest
)

BODY=$(jq -n --arg url "$URL" --arg p "$PROMPT" \
  '{contents:[{parts:[{file_data:{file_uri:$url}},{text:$p}]}]}')

for m in "${MODELS[@]}"; do
  RESP=$(curl -sS --max-time 300 \
    "https://generativelanguage.googleapis.com/v1beta/models/$m:generateContent" \
    -H "Content-Type: application/json" -d "$BODY")
  CODE=$(echo "$RESP" | jq -r '.error.code // empty' 2>/dev/null)
  if [ -z "$CODE" ]; then
    TEXT=$(echo "$RESP" | jq -r '[.candidates[0].content.parts[]? | select(.thought != true) | .text // empty] | join("")')
    if [ -n "$TEXT" ]; then
      echo "[modèle utilisé : $m]" >&2
      echo "$TEXT"
      exit 0
    fi
    echo "[$m] réponse vide, modèle suivant" >&2
  else
    echo "[$m] erreur $CODE : $(echo "$RESP" | jq -r '.error.message' | head -c 120)" >&2
  fi
done

echo "Tous les modèles Gemini ont échoué (quota du jour épuisé ou vidéo inaccessible)." >&2
exit 1
