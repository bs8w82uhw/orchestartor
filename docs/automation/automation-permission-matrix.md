---
title: Automation Manager Permission Matrix
---

## Purpose

Define hard role boundaries for AI automation execution using a single matrix:

- role,
- action type,
- risk level,
- human approval requirement,
- and resulting decision contract.

## Decision Rules

Global enforcement rules:

1. Any mutating high-risk action requires `human_approved=true`.
2. Any `denied` policy decision blocks execution in enforced mode.
3. Reviewer and Safety/Audit can block completion, but cannot execute business mutations.

## Matrix

| Role | Action | Risk | Human Approval Required | Allowed | Result |
|------|--------|------|-------------------------|---------|--------|
| Planner | Plan decomposition, routing, risk classification | low/medium/high | no | yes | Plan artifact + risk tag |
| Planner | Direct mutating runtime execution | any | n/a | no | Deny: planner scope violation |
| Executor | Read-only checks, status collection | low/medium/high | no | yes | Evidence/log update |
| Executor | Mutating execution (`launchJob`, `runJobAction`, workflow continue) | low/medium | no | yes | Execute with policy trace |
| Executor | Mutating execution (`launchJob`, `runJobAction`, workflow continue) | high | yes | conditional | Allow only if `human_approved=true` |
| Executor | Override prior deny decision | any | n/a | no | Deny: policy override forbidden |
| Reviewer | Contract validation + regression checks | low/medium/high | no | yes | Pass/partial/fail decision |
| Reviewer | Force success without evidence | any | n/a | no | Deny: evidence missing |
| Safety/Audit | Policy gate + escalation decision | low/medium/high | no | yes | Allow/deny with reason |
| Safety/Audit | Direct business mutation execution | any | n/a | no | Deny: audit scope violation |

## Endpoint and Method Mapping

Primary API endpoints:

- `GET /api/app/get_automation_manager/v1`
- `POST /api/app/evaluate_automation_task/v1`

Primary enforcement methods:

- `evaluateAutomationPolicy` (`lib/automation-manager.js`)
- `launchJob` policy gate (`lib/job.js`)
- `runJobAction` policy gate (`lib/action.js`)
- `continueWFController` policy gate (`lib/workflow.js`)

## Privilege Validation (Runtime)

Latest automated privilege check (HTTPS `https://localhost:5523`):

- Result: **pass** for all listed privileges.
- Exception: `comment_jobs` was **skipped** (no matching privilege/endpoint in docs/code).

Summary source: `tools/agents/privilege-check/run.sh --insecure` (output JSON).

Recommended execution pattern (stores the JSON report for audit):

```bash
export XYOPS_API_KEY="...api key..."
export OUT_LOG_AGENT="/tmp/privilege-check.json"
./tools/agents/privilege-check/run.sh --insecure
```

Latest privilege-execute report (real mutations) from `/tmp/privilege-execute.json`:

- baseUrl: `https://127.0.0.1:5523`
- summary: **ok 42 / fail 1** (accepted as successful)
- failure: `abort_job` can race if the job completes too quickly; treat as acceptable in this test.
- note: all other steps completed successfully.

Latest xyops-bootstrap run (test env) from `/tmp/xyops-bootstrap.json`:

- baseUrl: `https://127.0.0.1:5523`
- summary: **ok 12 / fail 0**
- scope: roles, buckets, channels, webhook, daily healthcheck event

## Contract Evidence Requirements

Each matrix-relevant change must include:

1. API doc update (`docs/api.md`).
2. Compatibility contract ticket (`docs/automation/API_COMPATIBILITY_CONTRACT_TICKET_TEMPLATE.md`).
3. Autonomous and manual evidence (`docs/automation/api-debug-compatibility.md`).
4. Method-level contract debug trace (`docs/automation/contract-debug-stages.md`).

## Escalation Contract

Escalation is mandatory when one or more conditions hold:

- high risk without human approval,
- denied policy decision,
- contract result `partial` or `fail`,
- missing evidence.

Escalation output must include:

- denial reason,
- affected method/endpoint,
- remediation ticket reference,
- operator sign-off requirement.
