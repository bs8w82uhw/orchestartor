---
title: Method Catalog - Automation Manager
---

## Scope

This catalog tracks methods involved in Automation Manager policy evaluation and enforcement.

Russian mirror: `docs/automation/ru/ru-method-catalog-automation-manager.md`.

## Contract Debug Tracking

Use the following status fields for each method:

- `autonomous`: `pending` / `pass` / `partial` / `fail`
- `manual`: `pending` / `pass` / `partial` / `fail`

## Method-by-Method Debug Matrix (Cycle 2026-02-05)

| Method | Autonomous | Manual | Evidence | Remediation / Next Step |
|--------|------------|--------|----------|--------------------------|
| `api_get_automation_manager` | pass | pending | `test/suites/test-admin.js:208` | Add manual operator check for role visibility and recent decisions payload. |
| `api_evaluate_automation_task` | pass | pending | `test/suites/test-admin.js:218` | Add manual deny-path checks in enforced mode and approval toggle scenarios. |
| `automationManagerSetup` | partial | pending | `lib/automation-manager.js` + API smoke via `test/suites/test-admin.js:208` | Add direct init contract test (config permutations). |
| `getAutomationManagerStatus` | partial | pending | Indirect via `api_get_automation_manager` (`test/suites/test-admin.js:208`) | Add direct shape/sanitization test on manager state copy. |
| `evaluateAutomationPolicy` | partial | pending | Indirect via `api_evaluate_automation_task` (`test/suites/test-admin.js:218`) | Add autonomous matrix tests for low/medium/high + allow/deny outcomes. |
| `recordAutomationDecision` | partial | pending | Indirect decision flow via `lib/api/automation.js:45` | Add ring-buffer limit test (100 max) and ordering assertions. |
| `normalizeAutomationRisk` | pass | pending | Risk normalization assert (`test/suites/test-admin.js:229`) | Add malformed-risk fallback tests (`null`, unknown string). |
| `launchJob` (policy gate) | pending | pending | Gate implementation `lib/job.js:87` | Add autonomous deny/allow tests with enforced mode. |
| `runJobAction` (policy gate) | pending | pending | Gate implementation `lib/action.js:132` | Add autonomous deny-path tests and meta-log assertions. |
| `continueWFController` (policy gate) | pending | pending | Gate implementation `lib/workflow.js:1057` | Add workflow-level contract tests + manual walkthrough. |

### Coverage Snapshot

- Autonomous: `pass=3`, `partial=4`, `pending=3`, `fail=0`.
- Manual: `pending=10` (operator cycle not yet executed).

## API Methods

### api_get_automation_manager

- Location: `lib/api/automation.js`
- Contract: returns manager status + recent decisions.
- Preconditions: master node, admin session.
- Output: `{ code: 0, manager: {...} }`

### api_evaluate_automation_task

- Location: `lib/api/automation.js`
- Contract: evaluates one task against policy.
- Preconditions: master node, admin session.
- Input: `title`, `risk_level`, `human_approved`.
- Output: `{ code: 0, task: {...}, decision: {...} }`

## Core Policy Methods

### automationManagerSetup

- Location: `lib/automation-manager.js`
- Contract: initializes runtime manager state from config.
- Side effects: creates `this.automationManager`.

### getAutomationManagerStatus

- Location: `lib/automation-manager.js`
- Contract: returns safe copy of manager state for API.

### evaluateAutomationPolicy

- Location: `lib/automation-manager.js`
- Contract: policy decision with allow/deny + reason.
- Output fields: `allowed`, `reason`, `risk_level`, `mode`, approval flags.

### recordAutomationDecision

- Location: `lib/automation-manager.js`
- Contract: appends decision to in-memory ring buffer (max 100).

### normalizeAutomationRisk

- Location: `lib/automation-manager.js`
- Contract: normalizes risk to `low|medium|high` (default `medium`).

## Enforcement Methods

### launchJob (policy gate)

- Location: `lib/job.js`
- Contract: blocks job launch when policy denies in enforced mode.
- Evidence: `job.automation_policy` + job log entry.

### runJobAction (policy gate)

- Location: `lib/action.js`
- Contract: blocks action execution when policy denies.
- Evidence: `action.automation_policy`, action code `policy`, meta log.

### continueWFController (policy gate)

- Location: `lib/workflow.js`
- Contract: blocks controller continue stage when policy denies.
- Evidence: `workflow.state[node].automation_policy`, workflow log.
