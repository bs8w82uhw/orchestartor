# Documentation Governance

## Purpose

This policy defines how documentation is managed for humans and AI agents.
If a process is not documented and reviewed, it is considered not automation-ready.

## Required Workflow

1. All docs changes go through Pull Requests.
2. Every docs PR must use the docs PR template.
3. At least one reviewer is required for docs PRs.
4. `docs/knowledge-registry.json` must be updated in the same PR.
5. High-risk automation docs require explicit policy and escalation sections.

## Branch and Review Rules

Configure these repository settings for the default branch:

- Require pull request before merge.
- Require at least 1 approving review.
- Require status checks to pass (including docs hygiene workflow).
- Require conversation resolution before merge.
- Enforce CODEOWNERS review for docs paths.

## Document States

Each page must have a lifecycle state in `docs/knowledge-registry.json`:

- `draft`: Work in progress, not safe for agent execution.
- `active`: Reviewed and approved for use.
- `deprecated`: Legacy guidance, kept only for reference/migration.

## Mandatory Metadata

For each page entry:

- `owner`
- `status`
- `last_reviewed_at` (YYYY-MM-DD)
- `next_review_at` (YYYY-MM-DD)
- `agent_ready` (true/false)
- `risk_level` (`low`, `medium`, `high`)

## Weekly Knowledge Hygiene

A weekly workflow validates:

- Missing registry entries for docs pages.
- Missing owners/status/review dates.
- Expired review dates.

Output is published as a report and should be reviewed by docs owners.
