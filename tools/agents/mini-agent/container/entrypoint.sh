#!/usr/bin/env bash
set -euo pipefail
if [ "${DEBUG:-0}" = "1" ]; then
  set -x
fi

log() {
  echo "[mini-agent] $*" >&2
}

TEMPLATE=${1:-/workspace/docs/automation/codex/templates/MINI_AGENT_PROMPT_TEMPLATE.md}
shift || true
QUESTION=${*:-}

if [ -z "${QUESTION}" ]; then
  if [ -t 0 ]; then
    QUESTION="Пинг"
  else
    QUESTION=$(cat -)
  fi
fi

if ! command -v codex >/dev/null 2>&1; then
  log "Error: codex CLI not found in PATH."
  exit 127
fi

if [ ! -f "${TEMPLATE}" ]; then
  log "Error: template not found: ${TEMPLATE}"
  exit 2
fi

log "Template: ${TEMPLATE}"
log "Question: ${QUESTION}"
log "Proxy: HTTP_PROXY=${HTTP_PROXY:-<unset>} HTTPS_PROXY=${HTTPS_PROXY:-<unset>} NO_PROXY=${NO_PROXY:-<unset>}"
log "Codex: $(codex --version 2>/dev/null || echo '<unknown>')"
log "Checking login status..."

# 1) Check login status
if ! codex login status >/dev/null 2>&1; then
  log "Not logged in. Starting device-auth login..."
  codex login --device-auth
  log "Login complete."
else
  log "Already logged in."
fi

log "Executing scenario via codex exec -"
# 2) Execute scenario
PROMPT=$(sed "s/{{question}}/${QUESTION//\//\\/}/g" "${TEMPLATE}")
printf "%s" "${PROMPT}" | codex exec -
