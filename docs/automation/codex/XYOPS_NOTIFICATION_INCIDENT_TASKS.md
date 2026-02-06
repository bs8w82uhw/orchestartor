---
title: xyOps Notification & Incident Tasks (AI Architect)
version: 1
---

## Task Package

### 1) Agent: Platform Architect — Notification & Incident Design

**Goal**: Design notification + incident response policy for xyOps.

**Inputs**
- Current group structure
- Required SLA/SLO and escalation windows
- Target notification channels (email/webhook/Slack)

**Outputs**
- Notification & Incident Policy document
- Channel routing rules
- Escalation matrix (P1–P4)
- Required tags and ticket linkage

**Definition of Done**
- Severity tiers defined
- Notification rules complete
- Escalation paths documented
- Tags and ticket linkage specified

---

### 2) Agent: Ops Executor — Implement Notifications

**Goal**: Create/update channels and webhook routes.

**Inputs**
- Approved policy
- Environment target
- Channel list

**Actions**
- Create/update `ops-email`
- Create/update `ops-webhook`
- Link notification channel to webhook
- Validate a test delivery

**Outputs**
- Execution log (`OUT_LOG_AGENT`)
- JSON report uploaded to `opsagentreports`

**Definition of Done**
- Channels exist and are enabled
- Webhook route validated
- Report uploaded

---

### 3) Agent: Ops Executor — Incident Event Templates

**Goal**: Implement incident and change workflow events.

**Inputs**
- Approved policy
- Group list

**Actions**
- Create `event-incident-triage`
- Create `event-change-approval`
- Apply tags `incident`, `change`
 - Ensure `eventticketscheduler` runs every 5 minutes

**Outputs**
- Execution log (`OUT_LOG_AGENT`)
- JSON report uploaded to `opsagentreports`

**Definition of Done**
- Events created and manual triggers enabled
- Tags attached
- Report uploaded

---

### 4) Agent: Evidence Recorder — Audit & Docs Update

**Goal**: Capture evidence and update docs.

**Inputs**
- Reports from Ops Executor
- Evidence JSON files

**Actions**
- Update `docs/automation/automation-permission-matrix.md`
- Link evidence paths

**Outputs**
- Documentation updated

**Definition of Done**
- Evidence referenced
- Docs updated and consistent

---

## Reporting Format

Reports must follow `MINI_AGENT_REPORT_TEMPLATE.md` and be uploaded to the `opsagentreports` bucket.
