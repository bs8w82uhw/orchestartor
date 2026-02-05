#!/usr/bin/env bash
set -euo pipefail

IMAGE=mini-agent-codex

echo "[mini-agent] Building image ${IMAGE}..." >&2
docker build -t ${IMAGE} -f tools/agents/mini-agent/container/Dockerfile .
