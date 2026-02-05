---
title: API Compatibility Contract Ticket - get_automation_manager
---

## Ticket ID

`API-COMPAT-AUTOMATION-20260205-02`

## Endpoint

- Method: `GET`
- Path: `/api/app/get_automation_manager/v1`
- Version: `v1`

## Contract Scope

- Request schema:
  - No endpoint-specific parameters.
  - Standard session/API key transport is required.
- Response schema:
  - `code` (Number, success = `0`)
  - `manager` (Object)
    - `enabled` (Boolean)
    - `mode` (String)
    - `roles` (Array<String>)
    - `require_human_approval_for` (Array<String>)
    - `recentDecisions` (Array<Object>)
- Error schema:
  - Standard API error: `{ code: <string>, description: <string> }`
- Auth and privileges:
  - Master node required
  - Admin privileges required

## Compatibility Guarantees

- Backward compatibility statement:
  - Endpoint is additive and v1-stable.
  - Response includes stable top-level `manager` object with safe-copy fields.
- Deprecated fields (if any):
  - None.
- Breaking changes (if any):
  - None in this ticket scope.

## Debug Coverage

### Autonomous Tests

- Contract assertions:
  - `test_admin_get_automation_manager` in `test/suites/test-admin.js`
  - Validates `code`, `manager` envelope, and type checks for `enabled`, `mode`, `roles`.
- Negative cases:
  - Session/admin error behavior is covered by existing admin/session API tests.
- Policy/security cases:
  - Confirms status endpoint exposes read-only manager state via `getAutomationManagerStatus()`.

### Manual Tests

- Steps:
  1. Start manual test mode (`docker compose -f docker-compose.test.yml --profile manual up xyops-test-manual`).
  2. Call `/api/app/get_automation_manager/v1` as admin.
  3. Verify `manager` structure and presence of `recentDecisions`.
  4. Trigger `evaluate_automation_task` and call status endpoint again.
- Human checkpoints:
  - Confirm `recentDecisions` updates after evaluation.
  - Confirm no sensitive mutable internals are returned.
- Expected outcomes:
  - Stable response shape and types.
  - Recent decisions list reflects latest policy evaluations.

## Evidence

- PR link: pending
- Test run links: pending CI/docker execution
- Logs/traces:
  - `test/suites/test-admin.js:208`
  - `lib/api/automation.js:10`
  - `lib/automation-manager.js:28`

## Decision

- Status: `conditional`
- Reviewer: docs-core
- Date: 2026-02-05
- Conditions to move to `approved`:
  - Attach autonomous run evidence
  - Attach manual walkthrough evidence for `recentDecisions` update behavior
