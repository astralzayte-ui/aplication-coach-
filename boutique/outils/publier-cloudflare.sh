#!/bin/bash
# Publie la boutique chez Cloudflare (site + 3 fonctions : compteur, relevé, inscription).
# La clé Cloudflare est ajoutée par les secrets réseau de l'environnement, jamais écrite ici.
set -e
cd "$(dirname "$0")/.."
node construire.cjs
NODE_USE_ENV_PROXY=1 NODE_EXTRA_CA_CERTS=/root/.ccr/ca-bundle.crt CLOUDFLARE_API_TOKEN=remplace-par-le-proxy \
  CLOUDFLARE_ACCOUNT_ID=d51d4afc16e78c0f5dc9460b0d944ee4 WRANGLER_SEND_METRICS=false \
  npx -y wrangler@4 pages deploy dist --project-name silence-boutique --branch main --commit-dirty=true \
  --commit-message "${1:-mise à jour}"
