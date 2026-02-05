---
title: API Compatibility Contract Ticket - run_event policy gate
---

## Ticket ID

`API-COMPAT-AUTOMATION-20260205-03`

## Endpoint

- Method: `POST`
- Path: `/api/app/run_event/v1`
- Version: `v1`

## Contract Scope

- Request schema:
  - Existing `run_event` request contract remains unchanged (`id|title`, optional `params`, `input`, `test`, etc.).
  - Optional policy-related fields flow through to launch path (e.g. `risk_level`, `human_approved`) when provided.
- Response schema:
  - Success: `{ code: 0, id: <job_id> }`
  - Error: standard API error format (`code`, `description`), including policy-deny path via launch error.
- Error schema:
  - Standard API error: `{ code: <string>, description: <string> }`
  - Policy deny behavior: event launch failure message includes automation policy reason.
- Auth and privileges:
  - Master node required
  - Valid user required
  - `run_jobs` privilege required
  - Category/target privilege checks still required

## Compatibility Guarantees

- Backward compatibility statement:
  - Endpoint request/response envelope is preserved.
  - Policy gate is additive to launch behavior and does not change success payload shape.
- Deprecated fields (if any):
  - None.
- Breaking changes (if any):
  - None in transport/schema; behavioral deny path may trigger based on enforced policy configuration.

## Debug Coverage

### Autonomous Tests

- Contract assertions:
  - Existing `run_event` test coverage (event run path) plus Automation Manager API coverage.
  - Code references:
    - `lib/api/events.js:373` (`api_run_event`)
    - `lib/api/events.js:495` (`launchJob` callback path)
    - `lib/job.js:87` (automation policy gate in `launchJob`)
- Negative cases:
  - Existing auth/privilege/manual-trigger checks remain in `api_run_event`.
  - Policy-deny path needs explicit automated test case in enforced mode.
- Policy/security cases:
  - High-risk + no approval in enforced mode should deny launch with reason.

### Manual Tests

- Steps:
  1. Start manual test mode (`docker compose -f docker-compose.test.yml --profile manual up xyops-test-manual`).
  2. Set Automation Manager to `enforced`.
  3. Call `/api/app/run_event/v1` for a runnable event with high-risk context and no approval.
  4. Repeat with `human_approved=true`.
- Human checkpoints:
  - Deny case returns expected error and reason text.
  - Allow case returns job `id` and job includes `automation_policy`.
- Expected outcomes:
  - Enforced + high risk + no approval => denied.
  - Enforced + high risk + approval => allowed.

## Evidence

- PR link: pending
- Test run links: pending CI/docker execution
- Logs/traces:
  - `lib/api/events.js:373`
  - `lib/job.js:87`
  - `docs/method-catalog-automation-manager.md` (policy-gated methods matrix)

## Decision

- Status: `conditional`
- Reviewer: docs-core
- Date: 2026-02-05
- Conditions to move to `approved`:
  - Attach autonomous enforced-mode deny/allow test evidence for `run_event`
  - Attach manual walkthrough evidence with timestamps and policy reason traces
