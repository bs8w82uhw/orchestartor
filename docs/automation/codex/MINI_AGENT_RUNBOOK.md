---
title: Mini Agent Conveyor Runbook
---

## Purpose

A step-by-step conveyor flow for running the mini agent via Codex CLI (MFA login). You can replace the scenario (prompt template) while keeping the shell interface unchanged. The default use-case is refactoring documentation sections and enforcing consistent style/structure across documents.

## Conveyor Flow

1. **Template**
   - Select a Markdown template (`.md`) that contains `{{question}}`.
   - Example: `docs/automation/codex/templates/MINI_AGENT_PROMPT_TEMPLATE.md`.
2. **Question**
   - Provide the user question as an argument or via stdin.
3. **Execution**
   - Run the mini agent script (Codex CLI).
4. **Output**
   - Read the answer from stdout.
5. **Report**
   - Create a JSON report using `MINI_AGENT_REPORT_TEMPLATE.md`.
   - Upload the report to the `opsagentreports` bucket.
5. **Reset**
   - Prompt is single-shot: do not reuse it after response.
6. **Primary Assignment**
   - Refactor documentation sections and enforce one consistent structure/style across related docs.
7. **Checklist & Dry Run**
   - Preflight checklist runs before execution (template path, question, CLI available).
   - Use `DRY_RUN=1` to print the resolved prompt without executing.

## Local Run

```bash
# one-time login (MFA required)
codex login

./tools/agents/mini-agent/run.sh docs/automation/codex/templates/MINI_AGENT_PROMPT_TEMPLATE.md "Как проверить статус?"

# create report file (example)
cat <<'JSON' > /tmp/agent-report.json
{
  "timestamp": "2026-02-06T10:00:00Z",
  "agent": "ops-executor",
  "workflow": "mini-agent",
  "scope": "test",
  "summary": "ok",
  "result": "success",
  "evidence": ["/tmp/privilege-execute.json"],
  "notes": "baseline run"
}
JSON

export OUT_LOG_AGENT="/tmp/agent-report.json"
./tools/agents/agent-report/upload_report.sh --insecure
```

## Container Run (with proxy + login check)

```bash
export HTTP_PROXY="http://user:pass@host:port"
export HTTPS_PROXY="http://user:pass@host:port"
export NO_PROXY="localhost,127.0.0.1"

./tools/agents/mini-agent/container/build.sh
./tools/agents/mini-agent/container/run-container.sh docs/automation/codex/templates/MINI_AGENT_PROMPT_TEMPLATE.md "Как проверить статус?"
```

## Swap Scenario (same shell)

```bash
./tools/agents/mini-agent/run.sh docs/automation/codex/templates/ANOTHER_TEMPLATE.md "Новый вопрос"
```

## Notes

- The shell interface stays the same; only the template changes.
- Each request is a mini-agent single-shot interaction.
- If you are in a headless/WSL environment, use `codex login --device-auth`.
- Use `tools/agents/agent-report/update_inventory.sh` to refresh `XYOPS_INVENTORY_SNAPSHOT.md` from `/tmp/xyops_check_summary.json`.

## MCP Debug Tools

- Codex CLI and the IDE extension share config at `~/.codex/config.toml`.
- List MCP servers: `codex mcp list`.
- Add a server (example): `codex mcp add <name> --url <url>`.
