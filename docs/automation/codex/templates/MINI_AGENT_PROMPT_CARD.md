---
title: Mini Agent Prompt (Service Card)
version: 1
---

## Summary

- Template name: MINI_AGENT_PROMPT_TEMPLATE
- Purpose: General single-shot prompt for Codex CLI mini-agent runs.
- Primary use-case: Request refactoring, documentation standardization, or analysis tasks.
- Owner: docs-core

## Service Card

- Status: active
- Risk level: low
- Agent ready: true
- Last reviewed: 2026-02-05
- Next review: 2026-05-06

## Cost / Usage

- Expected token usage: low | medium (depends on prompt)
- Typical run time: short
- Cost notes: Single-shot prompt; no tool chaining expected.

## Inputs / Outputs

- Inputs: prompt template + user question
- Outputs: response text

## Constraints

- Allowed folders: N/A (content-only)
- Prohibited actions: modify tracked files unless explicitly requested
- Sandbox requirements: read-only is sufficient for analysis/refactor plans

## Metrics (Baseline)

- Runs (weekly): TBD
- Success rate: TBD
- Failure modes: ambiguous prompt; missing context
- Avg response time: TBD

## Template Details

- Template file: `docs/automation/codex/templates/MINI_AGENT_PROMPT_TEMPLATE.md`
- Placeholder(s): `{{question}}`
- Example question: "Приведи документ к единому стилю и дай чек-лист изменений."

## Change Log

- 2026-02-05: Initial card created
