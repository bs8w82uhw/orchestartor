---
title: Contract Debug Stages
---

## Goal

Standardize method debugging so each method is validated against its documented contract.

Russian mirror: `docs/ru-contract-debug-stages.md`.

## Stage 1: Contract Load

- Open method spec (from method catalog + template).
- Confirm inputs, outputs, side effects, and error contract.

## Stage 2: Preconditions

- Validate required state (master node, session, permissions, config flags).
- Record precondition snapshot.

## Stage 3: Input Validation

- Run happy-path input.
- Run malformed input.
- Run missing required input.
- Execute both test modes:
  - Autonomous (scripted/API-level assertions).
  - Manual (operator-driven scenario verification).

## Stage 4: Policy Gate Validation

- Run with low/medium/high risk.
- Run with and without `human_approved`.
- Validate `allowed/denied` and denial reason text.

## Stage 5: Output Contract Validation

- Confirm response shape and required fields.
- Confirm error format and status behavior.

## Stage 6: Side Effects Validation

- Confirm state updates (job/action/workflow fields).
- Confirm no unintended mutations.

## Stage 7: Observability Validation

- Confirm log lines are emitted.
- Confirm audit decision artifacts are present.

## Stage 8: Contract Sign-Off

- Mark method status: `pass` / `partial` / `fail`.
- Create remediation tasks for any contract violations.
- Record test-mode coverage:
  - `autonomous_coverage`: % of contract checks automated.
  - `manual_coverage`: % of contract checks validated manually.
