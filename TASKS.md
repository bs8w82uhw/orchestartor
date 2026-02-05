---
title: Project Task Backlog
---

## Priority Direction (Approved)

Focus project development on:

-  AI automation capabilities inside xyOps.
-  An "Automation Manager" layer for autonomous planning/execution control.
-  Multi-agent workflows with clear role boundaries.
-  Strong regulations (SOP/runbooks/policies) and docs-as-code discipline.
-  Gramax (`https://gram.ax/ru`) as the primary knowledge base for AI agents.

## Q1 Task Queue

1. Define AI Automation Manager architecture (control loop, permissions, escalation model).
2. Introduce multi-agent role model (Planner, Executor, Reviewer, Safety/Audit).
3. Add policy enforcement points in workflows and actions (pre-check / post-check).
4. Create a standard SOP template set (incident, rollout, rollback, access, data handling).
5. Build agent-facing knowledge taxonomy (product, operations, security, integrations).
6. Publish the "single source of truth" process for docs in Gramax.
7. Add quality gates for agent knowledge (owner, version, review date, status).
8. Define RAG-ready chunking and metadata conventions for all docs.
9. Standardize policy/contract/execution evidence docs and adopt templates across AI workflows.
10. Add automation KPIs (MTTR, automation coverage, % human escalations, policy violations).
11. Prepare phased rollout plan: pilot team -> controlled expansion -> org standard.
12. Run contract-driven debug cycle for each Automation Manager method and capture evidence.
13. Enforce API compatibility contract tickets for every endpoint change.
14. Maintain Russian-language mirrors for policy/contract/API-debug documentation.

## Documentation System Rollout Tasks

1. Canonical knowledge base URL is set: `https://app.gram.ax/github.com/bs8w82uhw/orchestartor/main/`.
2. Configure `GRAMAX_SYNC_WEBHOOK_URL` secret in GitHub repository settings.
2a. If webhook URL is unavailable, keep this item in `blocked` status and continue docs-as-code updates until URL is provided.
3. Enable branch protection: PR required, >=1 review, CODEOWNERS, required checks.
4. Adopt docs PR template for all documentation updates.
5. Keep `docs/knowledge-registry.json` updated in every docs change.
6. Review weekly "Docs Hygiene" issue and close gaps.

## Deferred (Not Blocking Core Direction)

- RU mirror for `docs/method-catalog-automation-manager.md` (parked, return after core architecture track completion).
