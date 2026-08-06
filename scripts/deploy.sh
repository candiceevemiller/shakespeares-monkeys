#!/usr/bin/env bash
# Builds shakespeares-monkeys and deploys it as a subpath under the
# candicemillercreations.com nginx root on the shared Linode box, so it's
# reachable at https://candicemillercreations.com/shakespeares-monkeys/
set -euo pipefail
cd "$(dirname "$0")/.."

HOST="candice@192.155.94.98"
REMOTE_DIR="/var/www/candicemillercreations.com/shakespeares-monkeys"

echo "==> Building"
npm run build

echo "==> Deploying to $HOST:$REMOTE_DIR"
ssh "$HOST" "mkdir -p $REMOTE_DIR"
rsync -avz --delete dist/ "$HOST:$REMOTE_DIR/"

echo "==> Verifying..."
ssh "$HOST" "curl -sf -o /dev/null -w 'shakespeares-monkeys: %{http_code}\n' https://candicemillercreations.com/shakespeares-monkeys/"

echo "==> Done. Live at https://candicemillercreations.com/shakespeares-monkeys/"
