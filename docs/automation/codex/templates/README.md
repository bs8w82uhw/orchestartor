---
title: Codex Templates Catalog
---

## Policy

Every template must have a corresponding Service Card documenting purpose, constraints, and baseline metrics.

## Templates

- `MINI_AGENT_PROMPT_TEMPLATE.md`
  - Card: `MINI_AGENT_PROMPT_CARD.md`
- `MINI_AGENT_FILEOPS_TEMPLATE.md`
  - Card: `MINI_AGENT_FILEOPS_CARD.md`
- `MINI_AGENT_DOCS_REFACTOR_TEMPLATE.md`
  - Card: `MINI_AGENT_DOCS_REFACTOR_CARD.md`
- `MINI_AGENT_XYOPS_ARCHITECT_TEMPLATE.md`
  - Card: `MINI_AGENT_XYOPS_ARCHITECT_CARD.md`
- `TEMPLATE_CARD_TEMPLATE.md`
  - Card: N/A (meta template)

## Run (Annotated)

```bash
# Required: path to template
TEMPLATE="docs/automation/codex/templates/MINI_AGENT_DOCS_REFACTOR_TEMPLATE.md"

# Optional: question (if omitted, run.sh uses stdin or "Пинг")
QUESTION="Приведи документ к стандарту docs-as-code и дай чек-лист изменений."

# Optional: dry run (print resolved prompt only)
DRY_RUN=1

# Execute (local CLI)
./tools/agents/mini-agent/run.sh "${TEMPLATE}" "${QUESTION}"
```

## Variables & Checklist

- Any `{{VAR}}` placeholder is replaced by the environment variable `VAR` if set.
- `{{question}}` is always set from the question argument or stdin.
- Preflight checklist runs before execution (template path, question, CLI available).
