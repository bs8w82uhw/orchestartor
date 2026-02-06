---
title: xyOps Ticket Processing Policy
version: 1
---

## Purpose

Define how tickets are created, tagged, prioritized, and closed in xyOps.

## Status Flow

- `open` → `in_progress` → `resolved` → `closed`
- Reopen: `closed` → `open` if new evidence appears.

## Severity & SLA

| Severity | Tag | First Response | Resolution Target |
| --- | --- | --- | --- |
| P1 | `incident` | 15 min | 4 hours |
| P2 | `incident` | 1 hour | 24 hours |
| P3 | `maintenance` | 4 hours | 3 days |
| P4 | `change` | 1 day | 7 days |

## Required Tags

- `incident` for outages and degradations
- `change` for planned changes
- `maintenance` for scheduled operations
- `audit` for compliance / evidence tracking

## Ticket Fields

- `subject`: short summary
- `body`: incident details / change plan
- `tags`: required tags above
- `assignees`: primary owner
- `notify`: on-call list or group

## Orchestrator Behavior

- The ticket scheduler event (`eventticketscheduler`) polls open tickets tagged `incident`.
- Orchestrator adds a comment indicating pickup.
- Orchestrator triggers `eventincidenttriage` with `ticket_id` in input data.

## Evidence Requirements

- All ticket-related automations must log outputs to `opsagentreports`.
- Any ticket status change must be recorded in `add_ticket_change`.
