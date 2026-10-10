#!/usr/bin/env bash
# Builds shakespeares-monkeys and deploys it (frontend + the global
# best-record API) to the candicemillercreations.com nginx root on the
# shared Linode box, so it's reachable at
# https://candicemillercreations.com/shakespeares-monkeys/
#
# One-time setup only (not done by this script): the nginx location block
# that proxies /shakespeares-monkeys/api/ to the API service. See
# server/nginx-location-api.conf.
set -euo pipefail
cd "$(dirname "$0")/.."

HOST="candice@192.155.94.98"
REMOTE_DIR="/var/www/candicemillercreations.com/shakespeares-monkeys"
API_REMOTE_DIR="/opt/shakespeares-monkeys-api"
API_DATA_DIR="/var/lib/shakespeares-monkeys"
API_SERVICE="shakespeares-monkeys-api"

echo "==> Building"
npm run build

echo "==> Deploying frontend to $HOST:$REMOTE_DIR"
ssh "$HOST" "mkdir -p $REMOTE_DIR"
rsync -avz --delete dist/ "$HOST:$REMOTE_DIR/"

echo "==> Deploying API to $HOST:$API_REMOTE_DIR"
ssh "$HOST" "sudo mkdir -p $API_REMOTE_DIR $API_DATA_DIR && sudo chown \$(whoami):\$(whoami) $API_REMOTE_DIR $API_DATA_DIR"
rsync -avz server/app.py server/target.json "$HOST:$API_REMOTE_DIR/"
rsync -avz server/shakespeares-monkeys-api.service "$HOST:/tmp/$API_SERVICE.service"
ssh "$HOST" "sudo mv /tmp/$API_SERVICE.service /etc/systemd/system/$API_SERVICE.service && sudo systemctl daemon-reload && sudo systemctl enable --now $API_SERVICE && sudo systemctl restart $API_SERVICE"

echo "==> Verifying..."
ssh "$HOST" "curl -sf -o /dev/null -w 'shakespeares-monkeys: %{http_code}\n' https://candicemillercreations.com/shakespeares-monkeys/"
ssh "$HOST" "curl -sf -o /dev/null -w 'shakespeares-monkeys api: %{http_code}\n' https://candicemillercreations.com/shakespeares-monkeys/api/best"

echo "==> Done. Live at https://candicemillercreations.com/shakespeares-monkeys/"
