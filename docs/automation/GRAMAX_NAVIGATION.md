---
title: Gramax Navigation Structure
---

## Goal

Use two top-level navigation branches in Gramax to keep product docs separate from automation governance docs.

## Top-Level Branches

1. `Product Docs` (core xyOps)
2. `Automation Governance Docs` (AI automation program docs)

## Product Docs Branch

Entry point:

- `docs/index.md`

Contains:

- product features, API reference, operations, security, integrations, and platform internals.

## Automation Governance Branch

Entry point:

- `docs/automation/index.md`

Contains:

- AI automation architecture and policies
- contract templates and method catalog
- API compatibility tickets and debug standards
- execution evidence and governance lifecycle
- RU mirror in `docs/automation/ru/`

## Sync Rule

When docs are changed:

1. Keep product docs linked from `docs/index.md`.
2. Keep automation docs linked from `docs/automation/index.md`.
3. Keep cross-links minimal and intentional between branches.
