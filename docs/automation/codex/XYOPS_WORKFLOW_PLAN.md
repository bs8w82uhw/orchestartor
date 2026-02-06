---
title: xyOps Operating Model Plan (AI Architect Output)
version: 1
---

## Scope & Assumptions

- Target environment: `https://127.0.0.1:5523` (test)
- Management uses verified xyOps APIs and privileges.
- Data is non‑critical in test. Production requires stricter retention, audit, and approvals.
- An admin account exists for API key and role management.

## Roles & Privileges

### Role Definitions

1. Platform Admin
- Full administrative privileges
- Manages API keys, roles, buckets, categories, integrations

2. Ops Executor
- Operates events, snapshots, and job execution within approved categories/groups
- No role or key management

3. Observer / Auditor
- Read-only access to logs, status, reports
- No mutating privileges

### Role Policy Template

```json
{
  "roles": [
    {
      "id": "platform_admin",
      "title": "Platform Admin",
      "privileges": {
        "create_alerts": 1,
        "edit_alerts": 1,
        "delete_alerts": 1,
        "create_buckets": 1,
        "edit_buckets": 1,
        "delete_buckets": 1,
        "create_categories": 1,
        "edit_categories": 1,
        "delete_categories": 1,
        "create_channels": 1,
        "edit_channels": 1,
        "delete_channels": 1,
        "create_events": 1,
        "edit_events": 1,
        "delete_events": 1,
        "create_groups": 1,
        "edit_groups": 1,
        "delete_groups": 1,
        "run_jobs": 1,
        "abort_jobs": 1,
        "tag_jobs": 1,
        "create_monitors": 1,
        "edit_monitors": 1,
        "delete_monitors": 1,
        "create_plugins": 1,
        "edit_plugins": 1,
        "delete_plugins": 1,
        "create_roles": 1,
        "edit_roles": 1,
        "delete_roles": 1,
        "create_tags": 1,
        "edit_tags": 1,
        "delete_tags": 1,
        "create_tickets": 1,
        "edit_tickets": 1,
        "delete_tickets": 1,
        "create_web_hooks": 1,
        "edit_web_hooks": 1,
        "delete_web_hooks": 1,
        "create_snapshots": 1,
        "delete_snapshots": 1,
        "add_servers": 1
      }
    },
    {
      "id": "ops_executor",
      "title": "Ops Executor",
      "privileges": {
        "create_events": 1,
        "edit_events": 1,
        "delete_events": 1,
        "run_jobs": 1,
        "abort_jobs": 1,
        "tag_jobs": 1,
        "create_snapshots": 1,
        "delete_snapshots": 1
      }
    },
    {
      "id": "observer",
      "title": "Observer",
      "privileges": {}
    }
  ]
}
```

## Bucket Strategy

### Buckets

- `ops-raw`: inbound artifacts (logs, dumps)
- `ops-processed`: processed outputs and reports
- `ops-temp`: short‑lived files
- `ops-agent-reports`: agent outputs (summaries, deltas, evidence pointers)

### Retention

- `ops-raw`: 30 days
- `ops-processed`: 90 days
- `ops-temp`: 7 days
- `ops-agent-reports`: 90 days (audit trail)

### Bucket Template

```json
{
  "buckets": [
    {"id": "ops-raw", "title": "Ops Raw", "retention_days": 30},
    {"id": "ops-processed", "title": "Ops Processed", "retention_days": 90},
    {"id": "ops-temp", "title": "Ops Temp", "retention_days": 7},
    {"id": "ops-agent-reports", "title": "Ops Agent Reports", "retention_days": 90}
  ]
}
```

## Events & Schedules

### Event Catalog

- `event-daily-healthcheck`: daily health checks
- `event-weekly-report`: weekly reporting
- `event-on-demand-debug`: manual diagnostics

### Event Template

```json
{
  "id": "event-daily-healthcheck",
  "title": "Daily Healthcheck",
  "enabled": 1,
  "category": "general",
  "targets": ["main"],
  "plugin": "testplug",
  "params": { "duration": 30 },
  "triggers": [
    {"type": "schedule", "enabled": true, "hours": [3], "minutes": [0]},
    {"type": "manual", "enabled": true}
  ],
  "algo": "all"
}
```

## Notifications

### Channels

- `ops-email`: email notifications
- `ops-webhook`: webhook to ticket system

### Notification Template

```json
{
  "channels": [
    {
      "id": "ops-email",
      "title": "Ops Email",
      "enabled": true,
      "users": ["admin"]
    },
    {
      "id": "ops-webhook",
      "title": "Ops WebHook",
      "method": "POST",
      "url": "https://example.com/hook"
    }
  ]
}
```

## Runbooks & Governance

- All changes are documented in `docs/automation/...`.
- Privilege expansions require review and explicit approval.
- Use `privilege-check` and `privilege-execute` for evidence collection.
- Agent roles and prompts are defined in `docs/automation/codex/XYOPS_AGENT_ROLES_WORKFLOW.md`.

## Operational Checklist

### Day‑0

- Create roles and API keys
- Set up buckets and retention
- Create base events

### Day‑1

- Configure notifications
- Validate `run_job` / `abort_job`

### Day‑2

- Weekly audits
- Planned upgrades and migrations

## Open Questions

- Which integrations are required (email/Slack/SIEM)?
- Which production categories/groups are needed?
- Any data types prohibited from buckets?
