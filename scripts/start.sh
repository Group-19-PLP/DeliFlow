#!/usr/bin/env bash
set -euo pipefail

# Usage: Render will provide $PORT automatically. You can also pass a port as the first argument.
PORT=${PORT:-${1:-5000}}

cd backend || { echo "backend directory not found" >&2; exit 1; }

# Ensure FLASK_APP is set so flask-migrate knows where the app is
export FLASK_APP=app.py

echo "[start.sh] Running database migrations (if present)..."
# If flask and migrations are available, attempt to upgrade the DB. Allow failure (idempotent deploys).
if command -v flask >/dev/null 2>&1; then
  flask db upgrade || true
else
  echo "[start.sh] 'flask' command not available in PATH; skipping migrations"
fi

echo "[start.sh] Ensuring database tables exist..."
python -c "from app import app, db; context = app.app_context(); context.push(); db.create_all(); context.pop()"

echo "[start.sh] Starting gunicorn on 0.0.0.0:${PORT}"
exec gunicorn app:app --bind 0.0.0.0:${PORT} --workers 2
