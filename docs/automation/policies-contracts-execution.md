---
title: Policies, Contracts, and Execution
---

## Purpose

This guide defines how to document:

- policy rules,
- operational contracts,
- and proof of execution.

The goal is to make every automation decision auditable and safe for AI agents.

## Scope

Applies to all automation governance artifacts in `docs/automation/`:

- policy documents,
- operational contracts,
- execution evidence logs.

## Preconditions

- Document owner is assigned.
- Risk level is identified (`low|medium|high`).
- Related method/API scope is known.
- Registry update in `docs/knowledge-registry.json` is planned in the same PR.

## Procedure

Each automation flow must map to three artifacts:

1. Policy: what is allowed, restricted, or forbidden.
2. Contract: who is responsible for what, with clear inputs/outputs.
3. Execution Evidence: what actually happened, with timestamped proof.

If any of these is missing, the flow is not automation-ready.

### Policy Documentation Standard

Each policy document must include:

- scope and systems covered,
- risk levels (`low`, `medium`, `high`),
- approval requirements,
- forbidden actions,
- escalation triggers,
- exception process.

Recommended filename pattern:

- `POLICY_<domain>.md`

### Contract Documentation Standard

Each contract must define:

- participants (human/agent roles),
- responsibilities,
- handoff points,
- SLA/SLO targets,
- acceptance criteria,
- rollback ownership.

Recommended filename pattern:

- `CONTRACT_<domain>.md`

### Execution Evidence Standard

Each execution record must include:

- execution ID,
- request source,
- policy decision (`allowed` / `denied` + reason),
- actions performed,
- output artifacts,
- final result and sign-off.

Recommended filename pattern:

- `EXECUTION_<domain>_<YYYY-MM>.md`

### Quality Gates

Before a document becomes `agent_ready=true`:

1. Owner is assigned.
2. Review dates are set.
3. Linked policy and contract exist.
4. At least one execution evidence example exists.

### Review Cadence

- Weekly: execution evidence completeness.
- Monthly: policy/contract drift review.
- Quarterly: risk-level and approval model recalibration.

## Failure Modes

- Missing one of three required artifacts (policy/contract/evidence).
- Missing ownership or review dates in registry.
- Contract without explicit acceptance criteria or rollback owner.
- Evidence log without policy decision (`allowed|denied`) and reason.

## Escalation

- If artifact set is incomplete, mark status `draft` and block `agent_ready=true`.
- For high-risk scope gaps, require Safety/Audit reviewer before merge.
- Open remediation task with explicit owner and due date.

## Evidence Checklist

- [ ] Policy document exists and links to scope.
- [ ] Contract document exists and defines responsibilities/handoffs.
- [ ] Execution evidence example exists and is timestamped.
- [ ] `docs/knowledge-registry.json` updated in the same PR.
