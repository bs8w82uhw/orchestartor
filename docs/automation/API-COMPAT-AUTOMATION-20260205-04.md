---
title: API Compatibility Contract Ticket - workflow continue policy gate
---

## Ticket ID

`API-COMPAT-AUTOMATION-20260205-04`

## Endpoint

- Method: `POST`
- Path: `/api/app/run_event/v1` (workflow-type event execution path)
- Version: `v1`

## Contract Scope

- Request schema:
  - Existing `run_event` schema unchanged.
  - Workflow controller policy context is read from workflow node data (`risk_level|risk`, `human_approved`).
- Response schema:
  - Launch contract remains `{ code: 0, id: <job_id> }` on accepted start.
  - Policy decision for controller continue stage is stored in workflow state and logs.
- Error schema:
  - Standard API error format at endpoint level (`code`, `description`).
  - Continue-stage deny is reflected as workflow controller error state, not transport schema change.
- Auth and privileges:
  - Same `run_event` auth/privileges contract (valid session/API key + `run_jobs` + category/target checks).

## Compatibility Guarantees

- Backward compatibility statement:
  - No request/response schema changes for `run_event`.
  - Policy gate is additive runtime behavior for workflow continue stage.
- Deprecated fields (if any):
  - None.
- Breaking changes (if any):
  - None in endpoint contract; behavior may deny continue stage in enforced mode.

## Debug Coverage

### Autonomous Tests

- Contract assertions:
  - Workflow continue policy gate implementation:
    - `lib/workflow.js:1028` (`continueWFController`)
    - `lib/workflow.js:1066` (`state.automation_policy`)
  - Existing API launch contract remains covered by `run_event` behavior.
- Negative cases:
  - Add explicit automated test where continue threshold is met but policy denies stage.
- Policy/security cases:
  - Validate deny in enforced mode when high risk and `human_approved=false`.
  - Validate advisory trace in advisory mode.

### Manual Tests

- Steps:
  1. Start manual test mode.
  2. Run workflow event via `run_event`.
  3. Configure controller node with high-risk and no approval.
  4. Observe continue stage under `advisory` then under `enforced`.
- Human checkpoints:
  - `workflow.state[node].automation_policy` is populated.
  - Deny reason appears in workflow logs.
  - Continue nodes are blocked when policy denies.
- Expected outcomes:
  - Advisory mode: continue may proceed with advisory message.
  - Enforced mode + no approval: continue stage denied and marked error.

## Evidence

- PR link: pending
- Test run links:
  - Local attempt (2026-02-05): `npm test` -> blocked in current environment
  - Blocker output: `WSL 1 is not supported. Please upgrade to WSL 2 or above. Could not determine Node.js install directory`
  - Environment probe (2026-02-05): `node -v` -> `node: command not found`
  - Environment probe (2026-02-05): `docker version` -> `docker could not be found in this WSL distro (enable Docker Desktop WSL integration)`
  - Runbook for completion: `docs/automation/EVIDENCE_RUNBOOK_WSL2_DOCKER.md`
  - Autonomous run (2026-02-05): `docker compose -f docker-compose.test.yml --profile auto run --rm xyops-test-auto` reached test execution but failed before ticket sign-off.
  - Follow-up run (2026-02-05): `docker compose ... run --rm xyops-test-auto sh -lc "mkdir -p conf && cp -rf sample_conf/* conf/ && npm install --include=dev && npm test"` executed test harness and failed with runtime exception.
- Logs/traces:
  - `lib/workflow.js:1028`
  - `lib/workflow.js:1066`
  - `docs/automation/method-catalog-automation-manager.md` (`continueWFController` row)
  - Failure trace: `TypeError: Cannot read properties of undefined (reading 'forEach')` in `lib/monitor.js:908` via `handleQuickMonData`

## Decision

- Status: `conditional`
- Reviewer: docs-core
- Date: 2026-02-05
- Conditions to move to `approved`:
  - Attach autonomous workflow continue deny/allow evidence
  - Attach manual walkthrough evidence with workflow-state snapshots
  - Resolve/contain failing autonomous runtime exception (`lib/monitor.js:908`) so workflow-continue scenarios can complete
  - Run autonomous suite in supported environment with Node.js + Docker available (WSL2/Docker/native Linux)

## Evidence Update Template (Copy/Paste)

Use this block after running `docs/automation/EVIDENCE_RUNBOOK_WSL2_DOCKER.md`:

```md
### Evidence Update (fill after run)

- Autonomous run date:
- Environment:
- Autonomous command:
- Autonomous result:
- Autonomous log artifact/link:

- Manual run date:
- Manual environment:
- Scenario 1 (advisory) result:
- Scenario 2 (enforced + no approval) result:
- Workflow state snapshot link:
- Log trace link:

### Decision Update

- Status: `approved`
- Reviewer:
- Date:
- Notes:
```

## Approval Transition Checklist

- [ ] Autonomous deny/allow evidence attached.
- [ ] Manual walkthrough evidence attached.
- [ ] Workflow state snapshots attached.
- [ ] Decision switched from `conditional` to `approved`.
