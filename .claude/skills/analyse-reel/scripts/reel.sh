#!/usr/bin/env bash
# "L'œil" : télécharge une vidéo (Reel Instagram, TikTok, YouTube, X, Facebook...) avec yt-dlp,
# la découpe en images avec ffmpeg et fait transcrire le son par Gemini (gratuit).
# Claude regarde ensuite les planches d'images avec l'outil Read.
#
# Usage : reel.sh "<url ou fichier vidéo>" [dossier_sortie] [nb_images]
#   nb_images : "auto" par défaut (≈ 1 image / 2 s, entre 9 et 36)
# Variables optionnelles :
#   REEL_COOKIES=/chemin/cookies.txt  -> pour les vidéos privées ou si la plateforme demande une connexion
#   REEL_NO_AUDIO=1                   -> ne pas transcrire le son
set -u
SRC="${1:?url ou fichier vidéo manquant}"
OUT="${2:-${TMPDIR:-/tmp}/reel-$(date +%s)}"
N="${3:-auto}"
mkdir -p "$OUT/images" "$OUT/planches"
log() { echo "$*" >&2; }

# ---------- 1. Outils (installés automatiquement si absents) ----------
install_hint() {
  log "Installe-les à la main puis relance :"
  log "  Mac     : brew install yt-dlp ffmpeg"
  log "  Windows : winget install yt-dlp.yt-dlp Gyan.FFmpeg"
  log "  Linux   : pip install -U yt-dlp && sudo apt-get install -y ffmpeg"
}
if ! command -v ffmpeg >/dev/null; then
  log "ffmpeg absent, installation..."
  if command -v brew >/dev/null; then brew install ffmpeg
  elif command -v apt-get >/dev/null; then apt-get install -y -qq ffmpeg 2>/dev/null || sudo apt-get install -y -qq ffmpeg
  fi
  command -v ffmpeg >/dev/null || { log "Impossible d'installer ffmpeg."; install_hint; exit 1; }
fi
PIP="pip3"; command -v pip3 >/dev/null || PIP="pip"
update_ytdlp() {
  if command -v brew >/dev/null && brew list yt-dlp >/dev/null 2>&1; then brew upgrade yt-dlp >/dev/null 2>&1
  else $PIP install -q -U yt-dlp 2>/dev/null || $PIP install -q -U --user yt-dlp 2>/dev/null || $PIP install -q -U --break-system-packages yt-dlp 2>/dev/null
  fi
  hash -r
}
if ! command -v yt-dlp >/dev/null; then
  log "yt-dlp absent, installation..."
  if command -v brew >/dev/null; then brew install yt-dlp; else update_ytdlp; fi
  command -v yt-dlp >/dev/null || { log "Impossible d'installer yt-dlp."; install_hint; exit 1; }
fi

# ---------- 2. Récupérer la vidéo ----------
if [ -f "$SRC" ]; then
  VIDEO="$SRC"
else
  dl() {
    local args=(--no-playlist --no-warnings -q --write-info-json
      -f "bv*[height<=1080]+ba/b[height<=1080]/b" --merge-output-format mp4
      -o "$OUT/video.%(ext)s")
    [ -n "${REEL_COOKIES:-}" ] && args+=(--cookies "$REEL_COOKIES")
    yt-dlp "${args[@]}" "$SRC"
  }
  if ! dl; then
    log "Échec du téléchargement : mise à jour de yt-dlp et nouvel essai..."
    update_ytdlp
    if ! dl; then
      case "$SRC" in
        *youtube.com*|*youtu.be*)
          log "YouTube bloque ce serveur (« confirm you're not a bot »)."
          log "-> Utiliser le skill analyse-youtube (Gemini lit YouTube directement), ou REEL_COOKIES=cookies.txt." ;;
        *instagram.com*)
          log "Instagram demande une connexion pour ce contenu (compte privé, story, ou limite)."
          log "-> Relancer avec REEL_COOKIES=cookies.txt exporté depuis ton navigateur connecté." ;;
        *) log "-> Vérifier le lien (vidéo supprimée, privée, ou plateforme non supportée)." ;;
      esac
      exit 2
    fi
  fi
  VIDEO=$(ls "$OUT"/video.* 2>/dev/null | grep -v '\.json$' | head -1)
  [ -n "$VIDEO" ] || { log "Vidéo introuvable après téléchargement."; exit 2; }
fi

# ---------- 3. Infos ----------
D=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$VIDEO" | cut -d. -f1-2)
[ -n "$D" ] || { log "Fichier vidéo illisible."; exit 3; }
DI=${D%.*}; [ "$DI" -lt 1 ] && DI=1
RES=$(ffprobe -v error -select_streams v:0 -show_entries stream=width,height -of csv=s=x:p=0 "$VIDEO" | head -1)
HAS_AUDIO=$(ffprobe -v error -select_streams a -show_entries stream=index -of csv=p=0 "$VIDEO" | head -1)
{
  echo "Fichier    : $VIDEO"
  echo "Durée      : ${D}s"
  echo "Résolution : $RES"
  INFO="$OUT/video.info.json"
  if [ -f "$INFO" ]; then
    jq -r '"Plateforme : \(.extractor_key // "?")",
           "Auteur     : \(.uploader // .channel // "?") (\(.uploader_id // "?"))",
           "Titre      : \(.title // "")",
           "Date       : \(.upload_date // "?")",
           "Vues       : \(.view_count // "?")   Likes : \(.like_count // "?")   Commentaires : \(.comment_count // "?")",
           "Musique    : \(.track // "?") - \(.artist // "")",
           "Description:", (.description // "")' "$INFO" 2>/dev/null
  fi
} > "$OUT/infos.txt"

# ---------- 4. Découpe en images ----------
if [ "$N" = "auto" ]; then
  N=$(( (DI + 1) / 2 )); [ "$N" -lt 9 ] && N=9; [ "$N" -gt 36 ] && N=36
fi
FPS="$N/$D"
STAMP="drawtext=text='%{pts\:hms}':x=8:y=8:fontsize=24:fontcolor=white:box=1:boxcolor=black@0.6:boxborderw=6"
# Images seules (720 px, pour lire les textes à l'écran) — nom = numéro
ffmpeg -v error -y -i "$VIDEO" -vf "fps=$FPS,scale=720:-2" -q:v 3 -frames:v "$N" "$OUT/images/img_%02d.jpg"
# Planches 3x3 avec l'horodatage incrusté (à regarder en premier : 9 moments par image)
ffmpeg -v error -y -i "$VIDEO" -vf "fps=$FPS,scale=360:-2,$STAMP,tile=3x3:padding=4:color=black" \
  -q:v 3 -frames:v $(( (N + 8) / 9 )) "$OUT/planches/planche_%02d.jpg" 2>/dev/null \
|| ffmpeg -v error -y -i "$VIDEO" -vf "fps=$FPS,scale=360:-2,tile=3x3:padding=4:color=black" \
  -q:v 3 -frames:v $(( (N + 8) / 9 )) "$OUT/planches/planche_%02d.jpg"
STEP=$(awk -v d="$D" -v n="$N" 'BEGIN{printf "%.2f", d/n}')
echo "img_k = instant ≈ (k-1) × ${STEP}s" > "$OUT/images/LISEZMOI.txt"

# Coupes de montage (changements de plan)
CUTS=$(ffmpeg -v info -i "$VIDEO" -vf "select='gt(scene,0.3)',showinfo" -an -f null - 2>&1 \
  | grep -o 'pts_time:[0-9.]*' | cut -d: -f2 | awk '{printf "%.1fs ", $1}')
NCUTS=$(echo "$CUTS" | wc -w)
{
  echo "Coupes de montage : $NCUTS (≈ 1 plan toutes les $(awk -v d="$D" -v c="$NCUTS" 'BEGIN{printf "%.1f", d/(c+1)}') s)"
  echo "Instants : $CUTS"
} > "$OUT/montage.txt"

# ---------- 5. Le son : transcription Gemini (gratuit) ----------
TRANSCRIPT="$OUT/transcription.txt"
if [ -z "$HAS_AUDIO" ]; then
  echo "(pas de piste audio)" > "$TRANSCRIPT"
elif [ "${REEL_NO_AUDIO:-0}" = "1" ]; then
  echo "(transcription désactivée)" > "$TRANSCRIPT"
else
  ffmpeg -v error -y -i "$VIDEO" -vn -ac 1 -ar 16000 -b:a 32k "$OUT/audio.mp3"
  SIZE=$(wc -c < "$OUT/audio.mp3")
  if [ "$SIZE" -gt 14000000 ]; then
    echo "(audio trop long pour une transcription en un seul envoi)" > "$TRANSCRIPT"
  else
    PROMPT="Transcris mot pour mot tout ce qui est dit, en gardant la langue d'origine, avec des timestamps [mm:ss] à chaque changement de phrase ou de personne. Ensuite, sur une ligne 'SONS :', décris la musique (style, énergie, morceau connu si tu le reconnais), les effets sonores et la voix (ton, rythme). Si personne ne parle, écris 'Aucune parole.'"
    jq -n --rawfile d <(base64 -w0 "$OUT/audio.mp3" 2>/dev/null || base64 -i "$OUT/audio.mp3") --arg p "$PROMPT" \
      '{contents:[{parts:[{inline_data:{mime_type:"audio/mp3",data:($d|rtrimstr("\n"))}},{text:$p}]}]}' > "$OUT/.gemini_body.json"
    MODELS=(gemini-3.8-flash gemini-3.7-flash gemini-3.6-flash gemini-3.5-flash gemini-flash-latest gemini-3.1-flash-lite gemini-flash-lite-latest)
    : > "$TRANSCRIPT"
    for m in "${MODELS[@]}"; do
      R=$(curl -sS --max-time 180 "https://generativelanguage.googleapis.com/v1beta/models/$m:generateContent" \
        -H "Content-Type: application/json" ${GEMINI_API_KEY:+-H "x-goog-api-key: $GEMINI_API_KEY"} -d @"$OUT/.gemini_body.json")
      E=$(echo "$R" | jq -r '.error.code // empty' 2>/dev/null)
      T=$(echo "$R" | jq -r '[.candidates[0].content.parts[]? | select(.thought != true) | .text // empty] | join("")' 2>/dev/null)
      if [ -z "$E" ] && [ -n "$T" ]; then echo "$T" > "$TRANSCRIPT"; log "[son transcrit par $m]"; break; fi
      log "[$m] ${E:-réponse vide}, modèle suivant"
    done
    rm -f "$OUT/.gemini_body.json"
    [ -s "$TRANSCRIPT" ] || echo "(transcription indisponible : quota Gemini atteint ou pas de clé — analyser sans le son)" > "$TRANSCRIPT"
  fi
fi

# ---------- 6. Résumé ----------
echo "=== DOSSIER : $OUT"
cat "$OUT/infos.txt"
echo
cat "$OUT/montage.txt"
echo
echo "=== PLANCHES (à regarder en premier, 9 moments horodatés par image) :"
ls -1 "$OUT"/planches/*.jpg
echo "=== IMAGES SEULES ($N, une tous les ${STEP}s, pour zoomer sur un texte) : $OUT/images/"
echo
echo "=== SON :"
cat "$TRANSCRIPT"
