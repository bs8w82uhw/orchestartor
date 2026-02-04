---
title: API Compatibility Contract Ticket - evaluate_automation_task
---

## Ticket ID

`API-COMPAT-AUTOMATION-20260205-01`

## Endpoint

- Method: `POST`
- Path: `/api/app/evaluate_automation_task/v1`
- Version: `v1`

## Contract Scope

- Request schema:
  - Optional `id` (String)
  - Optional `title` (String)
  - Optional `risk_level` (String: `low|medium|high`, defaults to `medium`)
  - Optional `human_approved` (Boolean, defaults to `false`)
- Response schema:
  - `code` (Number, success = `0`)
  - `task` (Object)
    - `id`, `title`, `risk_level`, `human_approved`
  - `decision` (Object)
    - `allowed`, `reason`, `risk_level`, `mode`, `requires_human_approval`, `human_approved`
- Error schema:
  - Standard API error: `{ code: <string>, description: <string> }`
- Auth and privileges:
  - Master node required
  - Admin privileges required

## Compatibility Guarantees

- Backward compatibility statement:
  - Endpoint is additive and v1-stable.
  - Optional request fields can be omitted safely.
- Deprecated fields (if any):
  - None.
- Breaking changes (if any):
  - None in this ticket scope.

## Debug Coverage

### Autonomous Tests

- Contract assertions:
  - `test_admin_evaluate_automation_task` in `test/suites/test-admin.js`
  - Validates response envelope and decision object.
- Negative cases:
  - Admin/session failure paths covered by existing API auth tests.
- Policy/security cases:
  - High-risk input with `human_approved=false` validated for decision output.

### Manual Tests

- Steps:
  1. Start manual test mode (`docker compose -f docker-compose.test.yml --profile manual up xyops-test-manual`).
  2. Send API call to `/api/app/evaluate_automation_task/v1` with:
     - `risk_level=high`, `human_approved=false`
     - repeat with `human_approved=true`
  3. Verify JSON structure and decision reason text.
- Human checkpoints:
  - Confirm reason text matches configured mode (`advisory` / `enforced`).
  - Confirm risk normalization for invalid risk values.
- Expected outcomes:
  - Advisory mode: response allowed with recommendation for approval.
  - Enforced mode + high risk + no approval: response denied in decision.

## Evidence

- PR link: pending
- Test run links: pending CI/docker execution
- Logs/traces:
  - Transaction event `automation_policy_eval`
  - Decision payload in API response

## Decision

- Status: `conditional`
- Reviewer: docs-core
- Date: 2026-02-05
- Conditions to move to `approved`:
  - Attach autonomous run evidence
  - Attach manual walkthrough evidence
