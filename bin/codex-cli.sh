#!/usr/bin/env bash
set -euo pipefail

SCRIPT_NAME="codex-cli"

usage() {
  cat <<USAGE
Usage:
  ${SCRIPT_NAME} login
  ${SCRIPT_NAME} status
  ${SCRIPT_NAME} ask "<prompt>" [--json]
  ${SCRIPT_NAME} ask-stdin [--json]
  ${SCRIPT_NAME} help

Examples:
  ${SCRIPT_NAME} login
  ${SCRIPT_NAME} status
  ${SCRIPT_NAME} ask "What is the plan for today?"
  printf "Ping" | ${SCRIPT_NAME} ask-stdin
  ${SCRIPT_NAME} ask "Give me JSON" --json
USAGE
}

require_codex() {
  if ! command -v codex >/dev/null 2>&1; then
    echo "Error: codex CLI not found in PATH." >&2
    echo "Install/enable the Codex CLI, then retry." >&2
    exit 127
  fi

  # Guard against the unrelated "codex" static site generator package.
  if codex --help 2>/dev/null | grep -qiE "render your codex|skeleton|static server"; then
    echo "Error: detected the wrong 'codex' package (static site generator)." >&2
    echo "Install OpenAI Codex CLI instead: npm i -g @openai/codex" >&2
    exit 2
  fi
}

cmd=${1:-help}
shift || true

case "${cmd}" in
  login)
    require_codex
    codex login
    ;;
  status)
    require_codex
    codex login status
    ;;
  ask)
    require_codex
    if [ $# -lt 1 ]; then
      echo "Error: missing prompt." >&2
      usage
      exit 2
    fi
    prompt=$1
    shift || true
    if [ "${1:-}" = "--json" ]; then
      codex exec --json "${prompt}"
    else
      codex exec "${prompt}"
    fi
    ;;
  ask-stdin)
    require_codex
    if [ "${1:-}" = "--json" ]; then
      codex exec --json -
    else
      codex exec -
    fi
    ;;
  help|-h|--help)
    usage
    ;;
  *)
    echo "Error: unknown command: ${cmd}" >&2
    usage
    exit 2
    ;;
 esac
