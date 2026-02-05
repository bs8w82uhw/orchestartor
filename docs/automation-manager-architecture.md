---
title: Automation Manager Architecture
---

## Purpose

Define the execution architecture for AI automation in xyOps:

- control loop,
- permission model,
- escalation model,
- and multi-agent handoff contracts.

This is the implementation-level companion to `docs/ai-automation-knowledge-strategy.md`.

## Control Loop

1. Intake
   - Request enters via API, workflow, schedule, or operator action.
2. Plan
   - Planner role classifies intent, scope, and risk (`low|medium|high`).
3. Policy Evaluation
   - `evaluateAutomationPolicy` returns `allowed/denied` with reason.
4. Execution
   - Executor performs allowed operations within tool and scope limits.
5. Review
   - Reviewer validates output contract and regression signals.
6. Audit
   - Safety/Audit validates evidence completeness and policy compliance.
7. Close or Escalate
   - Complete with sign-off or escalate to human approval path.

## Permission Matrix (Role Boundaries)

Detailed matrix reference: `docs/automation-permission-matrix.md`.

### Planner

- Allowed: decompose tasks, select methods, assign risk.
- Not allowed: execute mutating operations.

### Executor

- Allowed: run approved methods and record outputs.
- Not allowed: override policy denials.

### Reviewer

- Allowed: verify contract conformance, request re-run.
- Not allowed: bypass missing evidence.

### Safety/Audit

- Allowed: enforce policy gates and escalation decisions.
- Not allowed: execute business actions directly.

## Escalation Model

Escalation is mandatory when any of the following is true:

- `risk_level=high` and `human_approved=false`
- policy evaluation returns `denied`
- contract checks end as `partial` or `fail`
- required evidence artifacts are missing

Escalation contract:

1. Freeze mutating execution.
2. Emit denial/escalation reason.
3. Open remediation task with contract reference.
4. Require explicit human sign-off before retry.

## Policy Enforcement Points

Current runtime enforcement points:

- `lib/job.js` -> `launchJob` gate
- `lib/action.js` -> `runJobAction` gate
- `lib/workflow.js` -> `continueWFController` gate
- `lib/api/automation.js` -> manager introspection/evaluation APIs

Method-level contracts are tracked in:

- `docs/method-catalog-automation-manager.md`
- `docs/contract-debug-stages.md`

## Contract-Driven Test Model

Each method is validated in two modes:

- Autonomous tests: scripted contract assertions.
- Manual tests: operator walkthrough for policy and UX behavior.

For every endpoint/method change:

1. Update API documentation.
2. Create or update compatibility contract ticket.
3. Attach autonomous + manual evidence.

## Operational Artifacts

- Policy template: `docs/POLICY_TEMPLATE.md`
- Contract template: `docs/CONTRACT_TEMPLATE.md`
- Execution evidence template: `docs/EXECUTION_EVIDENCE_TEMPLATE.md`
- Role SLA/SLO contract: `docs/automation-role-sla-slo.md`
- Governance rules: `docs/DOCS_GOVERNANCE.md`

## KPI Baseline

Track continuously:

- automation success rate,
- human escalation rate,
- policy denial rate,
- contract pass rate by method,
- evidence completeness rate.
