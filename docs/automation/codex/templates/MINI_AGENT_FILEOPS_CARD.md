---
title: Mini Agent File Ops (Service Card)
version: 1
---

## Summary

- Template name: MINI_AGENT_FILEOPS_TEMPLATE
- Purpose: Safe test file operations in a non-indexed folder with a clear audit report.
- Primary use-case: Create, rename, and move test files; produce a concise report.
- Owner: docs-core

## Service Card

- Status: active
- Risk level: low
- Agent ready: true
- Last reviewed: 2026-02-05
- Next review: 2026-05-06

## Cost / Usage

- Expected token usage: low
- Typical run time: short
- Cost notes: Single-shot prompt; no tool chaining expected.

## Inputs / Outputs

- Inputs: prompt template + user question
- Outputs: response text + file operations report (created/renamed/moved + final tree)

## Constraints

- Allowed folders: `/temp/mini-agent-fileops/` (under `.gitignore`)
- Prohibited actions: modify tracked files; operate outside ignored folders
- Sandbox requirements: write access required for file operations

## Metrics (Baseline)

- Runs (weekly): TBD
- Success rate: TBD
- Failure modes: read-only sandbox; missing permissions; missing template
- Avg response time: TBD

## Template Details

- Template file: `docs/automation/codex/templates/MINI_AGENT_FILEOPS_TEMPLATE.md`
- Placeholder(s): `{{question}}`
- Example question: "Создай тестовые файлы в /temp/mini-agent-fileops, переименуй и перемести по простому плану, затем дай отчет."

## Change Log

- 2026-02-05: Initial card created
