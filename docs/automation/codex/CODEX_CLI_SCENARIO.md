---
title: Codex CLI Shell Scenario (Mini Agent)
---

## Goal

Provide a shell-friendly scenario for sending a prompt to Codex CLI and receiving the answer in stdout. This is a separate CLI session (not the IDE chat panel). This flow is treated as a mini agent: a single-shot request with a system instruction and a user question.

## Prerequisites

- Codex CLI is installed and available in `PATH`.
- You are logged in with ChatGPT login (shared cache with the IDE extension).
- Make sure you installed OpenAI Codex CLI (`@openai/codex`), not the unrelated `codex` static site generator package.
  - Correct CLI install: `npm i -g @openai/codex`.
  - Sanity check: `codex --help` should mention commands like `exec`/`login`, not `build`/`serve`.

## Quick Scenario

1. Login (one-time):
   - `bin/codex-cli.sh login`
2. Verify login:
   - `bin/codex-cli.sh status`
3. Send a prompt from shell:
   - `bin/codex-cli.sh ask "Your question"`
   - `printf "Ping" | bin/codex-cli.sh ask-stdin`
4. Optional JSON output for scripting:
   - `bin/codex-cli.sh ask "Return JSON" --json`
   - `printf "Ping" | bin/codex-cli.sh ask-stdin --json`

## Notes

- This uses Codex CLI, which does not inject messages into the current IDE chat.
- CLI sessions do not sync conversation history with the IDE chat panel.
- The CLI uses the shared config at `~/.codex/config.toml`.
- Each connection/request should be treated as a single-shot interaction with a `system` prompt and a `user` question.
- Optionally include a knowledge base reference in the request context; once the response is returned, the prompt is no longer valid and is not reused.
- A knowledge base reference is metadata for the request, not a persistent context that carries over to later requests.
- For a step-by-step conveyor runbook and a mini-agent script, see `docs/automation/codex/MINI_AGENT_RUNBOOK.md`.
- MFA is required for ChatGPT login when using Codex CLI.
- Reference repo for Codex CLI: `https://github.com/faelmori/codex-cli`.

## Example (single-shot system + user)

```text
System: You are a concise assistant. Answer in Russian.
User: Вопрос: {{question}}
KB: https://app.gram.ax/github.com/bs8w82uhw/knowladge/master/
```

## CLI example (single-shot prompt)

```bash
printf "System: You are a concise assistant. Answer in Russian.\nUser: Вопрос: %s\nKB: https://app.gram.ax/github.com/bs8w82uhw/knowladge/master/\n" "Как проверить статус входа?" | bin/codex-cli.sh ask-stdin
```

## CLI example (single-shot prompt with JSON output)

```bash
printf "System: You are a concise assistant. Answer in Russian.\nUser: Вопрос: %s\nKB: https://app.gram.ax/github.com/bs8w82uhw/knowladge/master/\n" "Дай ответ в JSON" | bin/codex-cli.sh ask-stdin --json
```
