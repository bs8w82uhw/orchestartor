---
title: xyOps Organization Structure (Documentation)
version: 1
---

## Purpose

Document the organizational structure, ownership, and accountability model for xyOps operations.

## Org Model

### Core Functions

- **Platform Governance**: policies, roles, approvals, audit.
- **Operations Execution**: day‑to‑day event orchestration and response.
- **Evidence & Reporting**: result capture, audit trails, KPI summaries.

### Ownership

- **docs-core**: documentation, templates, runbooks.
- **ops-core**: operational execution and incident response.
- **sec-audit**: risk review and compliance evidence.

## Agent Responsibility Mapping

| Agent | Owner | Output | Bucket | Evidence |
| --- | --- | --- | --- | --- |
| Platform Architect | docs-core | Plan + templates | ops-agent-reports | doc references |
| Ops Executor | ops-core | Execution logs | ops-agent-reports | OUT_LOG_AGENT |
| Policy Reviewer | sec-audit | Approval/denial | ops-agent-reports | review summary |
| Evidence Recorder | docs-core | Docs updates | ops-agent-reports | doc references |

## Reporting Bucket

All agent reports must be written to **`ops-agent-reports`** and referenced in documentation. Files must include:

- Date/time
- Agent name
- Summary
- Evidence paths
- Result (success/partial/fail)

## Minimum Report Schema

```json
{
  "timestamp": "2026-02-06T10:00:00Z",
  "agent": "ops-executor",
  "scope": "privilege-execute",
  "summary": "ok 42 / fail 1",
  "evidence": ["/tmp/privilege-execute.json"],
  "result": "success",
  "notes": "abort_job race accepted"
}
```
