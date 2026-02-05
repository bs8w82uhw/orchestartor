#!/usr/bin/env bash
set -euo pipefail

TEMPLATE=${1:-docs/automation/codex/templates/MINI_AGENT_PROMPT_TEMPLATE.md}
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
  echo "Error: codex CLI not found in PATH." >&2
  echo "Install OpenAI Codex CLI: npm i -g @openai/codex" >&2
  exit 127
fi

# Guard against the unrelated "codex" static site generator package.
if codex --help 2>/dev/null | grep -qiE "render your codex|skeleton|static server"; then
  echo "Error: detected the wrong 'codex' package (static site generator)." >&2
  echo "Install OpenAI Codex CLI instead: npm i -g @openai/codex" >&2
  exit 2
fi

if [ ! -f "${TEMPLATE}" ]; then
  echo "Error: template not found: ${TEMPLATE}" >&2
  exit 2
fi

PROMPT=$(QUESTION="${QUESTION}" perl -0777 -pe 's/\\{\\{question\\}\\}/$ENV{QUESTION}/g' "${TEMPLATE}")
printf "%s" "${PROMPT}" | codex exec -
