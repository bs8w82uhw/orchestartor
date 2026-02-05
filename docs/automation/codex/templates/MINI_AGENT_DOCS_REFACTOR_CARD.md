---
title: Mini Agent Docs Refactor (Service Card)
version: 1
---

## Summary

- Template name: MINI_AGENT_DOCS_REFACTOR_TEMPLATE
- Purpose: Refactor docs to “docs as code” standards with consistent structure.
- Primary use-case: Normalize sections, headings, and wording across documents.
- Owner: docs-core

## Service Card

- Status: active
- Risk level: low
- Agent ready: true
- Last reviewed: 2026-02-05
- Next review: 2026-05-06

## Cost / Usage

- Expected token usage: medium
- Typical run time: short
- Cost notes: Single-shot prompt; no tool chaining expected.

## Inputs / Outputs

- Inputs: prompt template + user question
- Outputs: response text + change checklist

## Constraints

- Allowed folders: N/A (content-only)
- Prohibited actions: modify tracked files unless explicitly requested
- Sandbox requirements: read-only is sufficient

## Metrics (Baseline)

- Runs (weekly): TBD
- Success rate: TBD
- Failure modes: conflicting rules; insufficient context
- Avg response time: TBD

## Template Details

- Template file: `docs/automation/codex/templates/MINI_AGENT_DOCS_REFACTOR_TEMPLATE.md`
- Placeholder(s): `{{question}}`
- Example question: "Приведи документ к стандарту docs-as-code и дай чек-лист изменений."

## Change Log

- 2026-02-05: Initial card created
