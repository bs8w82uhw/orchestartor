# Mini Agent (Conveyor Style)

A minimal, single-shot agent that sends a prompt template (Markdown) + user question to Codex CLI. Authentication is via MFA with ChatGPT login.

## Conveyor Steps

1. Prepare template (shell stays the same, you can swap the scenario/template).
2. Provide a question (arg or stdin).
3. Execute the agent (Codex CLI).
4. Receive answer in stdout.

## Quick Run

```bash
# one-time login (MFA required)
codex login

# question as arg
./tools/agents/mini-agent/run.sh docs/automation/codex/templates/MINI_AGENT_PROMPT_TEMPLATE.md "Пинг"

# question from stdin
printf "Пинг" | ./tools/agents/mini-agent/run.sh docs/automation/codex/templates/MINI_AGENT_PROMPT_TEMPLATE.md
```

## Container Run (with proxy + login check)

```bash
export HTTP_PROXY="http://user:pass@host:port"
export HTTPS_PROXY="http://user:pass@host:port"
export NO_PROXY="localhost,127.0.0.1"

./tools/agents/mini-agent/container/build.sh
./tools/agents/mini-agent/container/run-container.sh docs/automation/codex/templates/MINI_AGENT_PROMPT_TEMPLATE.md "Пинг"
```

## Template Rules

- `{{question}}` is replaced at request time.
- Single-shot: the prompt is valid only for this request.
- You can swap template files without changing the shell interface.
