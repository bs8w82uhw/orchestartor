---
title: Contract Template
---

## Contract ID

`CONTRACT-<DOMAIN>-<N>`

## Purpose

Describe the outcome this contract guarantees.

## Participants

- Role A:
- Role B:
- Role C:

## Responsibilities

- Role A:
- Role B:
- Role C:

## Inputs / Outputs

- Inputs:
- Outputs:

## Prompt Template (MD)

- Template file (Markdown):
- System instructions (in template):
- User question placeholder (in template):
- Knowledge base reference (optional):
- Single-shot rule: prompt is valid only for this request; do not reuse after response.

### Template format (example)

```md
---
title: Mini Agent Prompt Template
version: 1
---

## System

You are a concise assistant. Answer in Russian.

## User

Вопрос: {{question}}

## Knowledge Base (optional)

https://app.gram.ax/github.com/bs8w82uhw/knowladge/master/
```

### Template usage

- Placeholder substitution: replace `{{question}}` with the user question at request time (no additional state carried over).
- Storage: keep prompt templates under `docs/automation/codex/templates/` and reference the file path in this contract.

## Handoff Rules

- Trigger:
- Required data:
- Timeout / retry:

## SLA / SLO

- Response time:
- Completion time:
- Error budget:

## Acceptance Criteria

- [ ]
- [ ]
- [ ]

## Escalation

- Escalation trigger:
- Escalation owner:
- Escalation channel:
