---
title: Mini Agent xyOps Architect (Service Card)
version: 1
---

## Summary

- Template name: MINI_AGENT_XYOPS_ARCHITECT_TEMPLATE
- Purpose: Produce a complete operating model for xyOps (roles, workflows, buckets, events, notifications).
- Primary use-case: Initial platform setup and governance definition.
- Owner: docs-core

## Service Card

- Status: active
- Risk level: medium
- Agent ready: true
- Last reviewed: 2026-02-06
- Next review: 2026-05-06

## Cost / Usage

- Expected token usage: high
- Typical run time: medium
- Cost notes: Single-shot prompt; outputs include multiple templates and checklists.

## Inputs / Outputs

- Inputs: prompt template + user question + optional environment context
- Outputs: plan + policy/config templates + checklists

## Constraints

- Allowed folders: N/A (content-only)
- Prohibited actions: modify tracked files unless explicitly requested
- Sandbox requirements: read-only is sufficient

## Metrics (Baseline)

- Runs (weekly): TBD
- Success rate: TBD
- Failure modes: missing org context, unverified assumptions
- Avg response time: TBD

## Template Details

- Template file: `docs/automation/codex/templates/MINI_AGENT_XYOPS_ARCHITECT_TEMPLATE.md`
- Placeholder(s): `{{question}}`, optional context vars
- Example question: "Спланируй роли, доступы, events, buckets и уведомления для xyOps."

## Change Log

- 2026-02-06: Initial card created
