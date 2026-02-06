#!/usr/bin/env bash
set -euo pipefail

INSECURE=0
while [[ $# -gt 0 ]]; do
  case "$1" in
    --insecure)
      INSECURE=1
      shift
      ;;
    *)
      echo "Unknown arg: $1" >&2
      exit 1
      ;;
  esac
done

if [[ "$INSECURE" == "1" ]]; then
  export NODE_TLS_REJECT_UNAUTHORIZED=0
fi

exec node "$(dirname "$0")/execute.mjs"
