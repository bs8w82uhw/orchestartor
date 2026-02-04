---
title: Method Catalog - Automation Manager
---

## Scope

This catalog tracks methods involved in Automation Manager policy evaluation and enforcement.

## Contract Debug Tracking

Use the following status fields for each method:

- `autonomous`: `pending` / `pass` / `partial` / `fail`
- `manual`: `pending` / `pass` / `partial` / `fail`

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
