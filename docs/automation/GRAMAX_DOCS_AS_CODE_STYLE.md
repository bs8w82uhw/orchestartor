---
title: Gramax Docs-as-Code Style for Technical Writing and AI Agents
---

## Purpose

Define one writing standard so documentation is:

- clear for humans,
- deterministic for AI agents,
- and easy to maintain in Git workflows.

## Document Contract (Required Sections)

Each operational/automation page should use this section order:

1. Purpose
2. Scope
3. Preconditions
4. Procedure (numbered)
5. Failure Modes
6. Escalation
7. Evidence Checklist
8. Change Log (optional for long-lived runbooks)

## Writing Rules (Technical Writer Style)

- Use short, imperative sentences.
- One step = one action + one expected outcome.
- Avoid ambiguous words (`maybe`, `soon`, `etc`) in procedures.
- Use explicit actors: `Planner`, `Executor`, `Reviewer`, `Safety/Audit`.
- Prefer examples with concrete values.
- Keep policy text normative: `must`, `must not`, `requires`.

## Docs-as-Code Rules

- Every docs change goes through PR + review.
- Update `docs/knowledge-registry.json` in the same PR.
- Keep links relative and stable.
- Prefer additive changes; deprecate before removing.
- Preserve audit trail via execution evidence docs.

## AI-Agent Readiness Metadata

Every page intended for agent consumption must have registry metadata:

- `owner`
- `status`
- `risk_level`
- `agent_ready`
- `last_reviewed_at`
- `next_review_at`

Recommended page-level tags (inside content):

- `agent_role_scope`
- `human_approval_required`
- `tool_scope`
- `compatibility_contract_ref`

## Chunking and Retrieval Guidance

- Keep sections self-contained (single task per section).
- Keep procedure steps atomic (small chunks).
- Place constraints near the action they govern.
- Repeat critical deny/allow conditions in both procedure and failure modes.

## Template Snippet

```md
## Purpose
...
## Scope
...
## Preconditions
- ...
## Procedure
1. ...
2. ...
## Failure Modes
- ...
## Escalation
- ...
## Evidence Checklist
- [ ] ...
```

## Gramax Mapping

- `Product Docs` branch entry: `docs/index.md`
- `Automation Governance Docs` branch entry: `docs/automation/index.md`

Use this style in the Automation Governance branch by default.
