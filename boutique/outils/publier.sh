#!/bin/bash
# Publie la boutique AVEC ses 2 fonctions (compteur + relevé).
# 🔴 Ne plus publier par un simple zip : un zip efface les fonctions.
set -e
cd "$(dirname "$0")/.."
node construire.cjs
NODE_EXTRA_CA_CERTS=/root/.ccr/ca-bundle.crt NODE_USE_ENV_PROXY=1 NETLIFY_AUTH_TOKEN=remplace-par-le-proxy \
  npx -y netlify-cli@27 deploy --prod --no-build --dir dist --functions netlify/functions \
  --site silence-boutique --message "${1:-mise à jour}"
