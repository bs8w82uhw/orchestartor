---
title: Documentation Index
---

## Overview

Welcome to the xyOps documentation. xyOps is a job scheduler, workflow engine, and server monitoring platform with a built-in web UI and REST API. This index organizes the docs into logical sections with short summaries to help you find what you need quickly. If you are deploying xyOps, start with Self-Hosting.

## Getting Started

-  [**Welcome to xyOps**](welcome.md): Introduces xyOps and provides some tips for beginners.  Shown on first login.
-  [**Self-Hosting**](hosting.md): Install xyOps with Docker, add workers, configure TLS, storage, and production settings.
-  [**Configuration**](config.md): All server configuration options, override layers, and where settings live on disk.
-  [**Scaling**](scaling.md): Best practices for running at scale, hardware sizing, caching, and multi-conductor.
-  [**Command Line**](cli.md): Service control commands and admin utilities available via `bin/control.sh`.
-  [**Cronicle**](cronicle.md): Migrate from Cronicle, enable compatibility mode, and optional UI white-labeling.
-  [**Recipes**](recipes.md): Practical patterns like continuous jobs and error handling you can copy and adapt.

## Core Concepts

-  [**Events**](events.md): Define what to run, where, when, and how; the foundation that launches jobs.
-  [**Workflows**](workflows.md): Visual graphs that orchestrate multiple jobs with control flow, fan-out/in, and limits.
-  [**Triggers**](triggers.md): Schedules, intervals, single-shot, manual, ranges, blackout windows, and precision options.
-  [**Limits**](limits.md): Self-imposed runtime constraints (time, output, CPU, memory) and retry/queue controls.
-  [**Actions**](actions.md): Reactions to job outcomes and alert state changes (email, web hook, run job, ticket, snapshot, channel).
-  [**Channels**](channels.md): Reusable bundles of notifications and follow-up actions referenced from actions.
-  [**Categories**](categories.md): Organize events/workflows, apply default actions/limits, and control visibility.
-  [**Tags**](tags.md): Labels for events/jobs for search, filtering, limits, and conditional actions.
-  [**Buckets**](buckets.md): Durable JSON + files storage for sharing data and artifacts between jobs and workflows.
-  [**Secrets**](secrets.md): Encrypted variables for jobs, plugins, and web hooks; assignment and runtime delivery.

## Monitoring & Operations

-  [**Servers**](servers.md): Worker nodes (xySat) that execute jobs, stream metrics, and participate in failover.
-  [**Groups**](groups.md): Logical sets of servers for targeting, default alert actions, and group-level views.
-  [**Monitors**](monitors.md): Minute-level time-series metrics defined by expressions, used for graphs and alerts.
-  [**Alerts**](alerts.md): Evaluate live data per server and trigger actions when expressions match.
-  [**Snapshots**](snapshots.md): Point-in-time captures of server or group state for forensics and comparisons.
-  [**Tickets**](tickets.md): Lightweight issues/runbooks integrated with jobs, alerts, files, and automation.

## Plugins & Integrations

-  [**Plugins**](plugins.md): Extend xyOps in any language; event and monitor plugin APIs, parameters, and I/O.
-  [**Marketplace**](marketplace.md): Publish and discover plugins; packaging, hosting, and requirements.
-  [**Web Hooks**](webhooks.md): Outbound HTTP requests from jobs and alerts with templated headers and bodies.
-  [**System Hooks**](syshooks.md): Run custom actions in response to global activity across xyOps.

## API & Data

-  [**REST API**](api.md): REST API endpoints, API keys, authentication, and standard response format.
-  [**API Debug and Compatibility Contract**](api-debug-compatibility.md): Mandatory API debug documentation and compatibility workflow.
-  [**API Compatibility Contract Ticket Template**](API_COMPATIBILITY_CONTRACT_TICKET_TEMPLATE.md): Template for endpoint-level compatibility sign-off.
-  [**API Compat Ticket (evaluate_automation_task)**](API-COMPAT-AUTOMATION-20260205-01.md): First endpoint compatibility ticket with autonomous/manual test plan.
-  [**Data Structures**](data.md): Complete schemas for all xyOps objects (jobs, events, users, servers, alerts, etc.).
-  [**Database Tables**](db.md): A list of all the internal xyOps database tables and column indexes.

## Access & Identity

-  [**Users and Roles**](users.md): Account model, roles, resource restrictions, preferences, and avatars.
-  [**Privileges**](privileges.md): Full list of privileges and what each grants across the application.
-  [**SSO Setup**](sso.md): Single Sign-On integration and external identity provider setup.

## File Formats and Protocols

-  [**xyOps Expression Format**](xyexp.md): JEXL-based expressions and helper functions used across the system.
-  [**xyOps Portable Data Format**](xypdf.md): Transfer format (XYPDF) for moving objects between systems.
-  [**xyOps Backup Format**](xybk.md): NDJSON-based bulk export/import format used by the admin tools.
-  [**xyOps Wire Protocol**](xywp.md): JSON over STDIO contract for plugins communicating with xyOps/xySat.

## Developer Guides

-  [**Contributing**](https://github.com/pixlcore/xyops/blob/main/CONTRIBUTING.md): How to contribute to xyOps.
-  [**Development**](dev.md): Architecture overview, component list, client framework, and local dev setup.
-  [**Testing with Docker Compose**](testing-docker-compose.md): Containerized autonomous and manual test modes.
-  [**AI Automation Strategy**](ai-automation-knowledge-strategy.md): Multi-agent model, governance framework, and knowledge-system approach.
-  [**Policies, Contracts, and Execution**](policies-contracts-execution.md): Documentation standard for policy rules, role contracts, and execution evidence.
-  [**Method Template**](METHOD_TEMPLATE.md): Standard template for documenting method contracts.
-  [**Method Catalog (Automation Manager)**](method-catalog-automation-manager.md): Tracked methods with policy and enforcement contracts.
-  [**Contract Debug Stages**](contract-debug-stages.md): Step-by-step method debug process against contracts.
-  [**Policy Template**](POLICY_TEMPLATE.md): Reusable template for policy documents.
-  [**Contract Template**](CONTRACT_TEMPLATE.md): Reusable template for operational contracts.
-  [**Execution Evidence Template**](EXECUTION_EVIDENCE_TEMPLATE.md): Reusable template for run evidence and audit trails.
-  [**Execution Evidence (Automation Manager, 2026-02)**](EXECUTION_automation-manager_2026-02.md): First execution log for policy/enforcement rollout.
-  [**Docs Governance**](DOCS_GOVERNANCE.md): Rules for PR flow, reviews, lifecycle statuses, and weekly hygiene.
-  [**Gramax Sync Setup**](GRAMAX_SYNC.md): Repository-to-Gramax sync workflow and webhook setup.
-  [**Logging**](logging.md): A list of all xyOps log files including descriptions and example rows.
-  [**Security**](security.md): How to report xyOps vulnerabilities responsibly.

## Meta

-  [**GitHub Project**](https://github.com/pixlcore/xyops/blob/main/README.md): Home of the xyOps open source repository.
-  [**Code of Conduct**](https://github.com/pixlcore/xyops/blob/main/CODE_OF_CONDUCT.md): Contributor Covenant Code of Conduct.
-  [**License**](https://github.com/pixlcore/xyops/blob/main/LICENSE.md): Open source BSD 3-Clause license (OSI-approved).
-  [**Trademarks**](https://github.com/pixlcore/xyops/blob/main/TRADEMARKS.md): xyOps™, xySat™ and PixlCore™ are trademarks.
-  [**Longevity**](https://github.com/pixlcore/xyops/blob/main/LONGEVITY.md): Project longevity and forever license pledge.
-  [**Governance**](governance.md): Project governance, contribution expectations, and decision-making.
-  [**Colophon**](colophon.md): We stand on the shoulders of these particular giants.
