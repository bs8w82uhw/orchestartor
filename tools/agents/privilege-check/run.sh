#!/usr/bin/env bash
set -euo pipefail

if [ -z "${XYOPS_API_KEY:-}" ]; then
  echo "XYOPS_API_KEY is required" >&2
  exit 1
fi

INSECURE=0
if [ "${1:-}" = "--insecure" ]; then
  INSECURE=1
  shift
fi

BASE=${XYOPS_BASE_URL:-https://localhost:5523}
export XYOPS_BASE_URL="${BASE}"

if [ "${INSECURE}" = "1" ]; then
  export NODE_TLS_REJECT_UNAUTHORIZED=0
fi

node tools/agents/privilege-check/priv_check.mjs
