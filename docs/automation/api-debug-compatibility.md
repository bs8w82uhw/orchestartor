---
title: API Debug and Compatibility Contract
---

## Purpose

This document defines mandatory API documentation for:

- debugging,
- compatibility control,
- and contract sign-off.

## Scope

Applies to all endpoint changes that affect:

- request/response contract,
- auth/privilege checks,
- runtime policy behavior,
- or compatibility guarantees.

## Preconditions

- Endpoint and version are identified.
- `docs/api.md` update scope is prepared.
- Compatibility ticket file is created from template.

## Procedure

Every API endpoint change must include:

1. API reference update in `docs/api.md`.
2. Compatibility contract ticket based on `API_COMPATIBILITY_CONTRACT_TICKET_TEMPLATE.md`.
3. Autonomous and manual debug evidence.

Without these artifacts, the API change is incomplete.

### Debug Documentation Standard

For each endpoint, document:

- request/response examples,
- error behavior and codes,
- policy/permission checks,
- side effects and logs.

### Contract Ticket Workflow

1. Open contract ticket before merge.
2. Fill endpoint contract scope and compatibility guarantees.
3. Attach autonomous test evidence.
4. Attach manual test evidence.
5. Record reviewer decision.

Current ticket set:

- `docs/automation/API-COMPAT-AUTOMATION-20260205-01.md` (`evaluate_automation_task`)
- `docs/automation/API-COMPAT-AUTOMATION-20260205-02.md` (`get_automation_manager`)
- `docs/automation/API-COMPAT-AUTOMATION-20260205-03.md` (`run_event` policy gate)
- `docs/automation/API-COMPAT-AUTOMATION-20260205-04.md` (workflow `continue` policy gate)

### Compatibility Policy

- Additive changes are preferred.
- Breaking changes require explicit migration notes and approval.
- Deprecated fields need removal timeline.

### Evidence Requirements

- CI test output (autonomous).
- Manual walkthrough notes with timestamps.
- Any deny/allow policy traces for security-sensitive endpoints.

## Failure Modes

- Endpoint changed without ticket and evidence.
- Compatibility guarantees not stated explicitly.
- Manual evidence missing for high-risk runtime paths.
- Breaking change shipped without migration notes/approval.

## Escalation

- Mark ticket `conditional` or `rejected` when required evidence is missing.
- For breaking changes, require explicit reviewer sign-off and migration plan.
- Block merge until `docs/api.md`, ticket, and evidence are complete.

## Evidence Checklist

- [ ] API reference updated in `docs/api.md`.
- [ ] Compatibility ticket added/updated.
- [ ] Autonomous test evidence linked.
- [ ] Manual walkthrough evidence linked.
- [ ] Reviewer decision recorded (`approved|conditional|rejected`).
