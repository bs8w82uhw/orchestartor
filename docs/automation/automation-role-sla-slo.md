---
title: Automation Role SLA/SLO Contract
---

## Purpose

Define measurable reliability and quality targets per Automation Manager role:

- Planner
- Executor
- Reviewer
- Safety/Audit

These targets are the minimum operational contract for AI automation readiness.

## Measurement Window

- Primary window: rolling 30 days.
- Reporting cadence: weekly operational review, monthly baseline recalibration.

## Role SLO Matrix

| Role | KPI | SLO Target | SLA Trigger |
|------|-----|------------|-------------|
| Planner | Plan completeness (required fields + risk tag + method mapping) | >= 98% | < 95% for 2 consecutive weeks |
| Planner | Plan-to-execution handoff latency | p95 <= 5 min | p95 > 10 min in weekly report |
| Executor | Successful execution rate for policy-allowed tasks | >= 97% | < 95% for 2 consecutive weeks |
| Executor | Runtime failures due to invalid inputs | <= 1.5% | > 3% in any weekly report |
| Reviewer | Contract validation coverage (executions reviewed vs required) | 100% for high risk, >= 98% overall | Any missed high-risk review |
| Reviewer | False-pass rate (later found contract violations) | <= 1% | > 2% in monthly review |
| Safety/Audit | Policy decision logging completeness | 100% | Any missing decision artifact |
| Safety/Audit | Escalation correctness (high risk without approval must escalate) | 100% | Any non-escalated violating case |

## Global System SLO

- Automation success rate: >= 96%.
- Human escalation rate: 5-20% expected range (too low may indicate unsafe bypasses).
- Policy denial observability: 100% denials must include reason text and actor context.
- Evidence completeness: >= 99% of executions include linked evidence artifact.

## SLA Breach Handling Contract

When any SLA trigger fires:

1. Create remediation ticket linked to affected role and metric.
2. Attach 7-day evidence snapshot (logs, method IDs, policy decisions).
3. Assign owner and ETA.
4. Track recovery until metric returns to SLO for 2 consecutive windows.

## Data Sources

- API decision payloads (`evaluate_automation_task`).
- Runtime policy gates in job/action/workflow logs.
- Method contract debug records (`docs/automation/contract-debug-stages.md` outcomes).
- Execution evidence logs (`docs/automation/EXECUTION_automation-manager_2026-02.md` and subsequent files).

## Governance Links

- Architecture: `docs/automation/automation-manager-architecture.md`
- Permission matrix: `docs/automation/automation-permission-matrix.md`
- Policy/contract/evidence standard: `docs/automation/policies-contracts-execution.md`
- Docs governance: `docs/automation/DOCS_GOVERNANCE.md`
