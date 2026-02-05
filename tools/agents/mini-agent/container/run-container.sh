#!/usr/bin/env bash
set -euo pipefail

IMAGE=mini-agent-codex

# Default proxy values (override by exporting HTTP_PROXY/HTTPS_PROXY/NO_PROXY before running)
HTTP_PROXY=${HTTP_PROXY:-""}
HTTPS_PROXY=${HTTPS_PROXY:-""}
NO_PROXY=${NO_PROXY:-"localhost,127.0.0.1"}

# Image build is a separate step (see build.sh)

TEMPLATE=${1:-docs/automation/codex/templates/MINI_AGENT_PROMPT_TEMPLATE.md}
shift || true
QUESTION=${*:-}

# Persist auth between runs
CODEX_HOME=${CODEX_HOME:-$HOME/.codex}

# Pass proxy envs through (container environment should always have proxy settings)
PROXY_ENV=()
[ -n "${HTTP_PROXY}" ] && PROXY_ENV+=( -e HTTP_PROXY="${HTTP_PROXY}" )
[ -n "${HTTPS_PROXY}" ] && PROXY_ENV+=( -e HTTPS_PROXY="${HTTPS_PROXY}" )
[ -n "${NO_PROXY}" ] && PROXY_ENV+=( -e NO_PROXY="${NO_PROXY}" )

# Enable debug logging inside container when DEBUG=1
DEBUG_ENV=()
[ "${DEBUG:-0}" = "1" ] && DEBUG_ENV+=( -e DEBUG=1 )

if [ -z "${QUESTION}" ]; then
  if [ -t 0 ]; then
    echo "[mini-agent] Running container (TTY)..." >&2
    docker run --rm -it \
      -v "${CODEX_HOME}:/root/.codex" \
      -v "${PWD}:/workspace" \
      "${PROXY_ENV[@]}" \
      "${DEBUG_ENV[@]}" \
      ${IMAGE} \
      "/workspace/${TEMPLATE}"
  else
    echo "[mini-agent] Running container (stdin)..." >&2
    docker run --rm -i \
      -v "${CODEX_HOME}:/root/.codex" \
      -v "${PWD}:/workspace" \
      "${PROXY_ENV[@]}" \
      "${DEBUG_ENV[@]}" \
      ${IMAGE} \
      "/workspace/${TEMPLATE}" \
      "$(cat -)"
  fi
else
  echo "[mini-agent] Running container (question arg)..." >&2
  docker run --rm -it \
    -v "${CODEX_HOME}:/root/.codex" \
    -v "${PWD}:/workspace" \
    "${PROXY_ENV[@]}" \
    "${DEBUG_ENV[@]}" \
    ${IMAGE} \
    "/workspace/${TEMPLATE}" \
    "${QUESTION}"
fi
