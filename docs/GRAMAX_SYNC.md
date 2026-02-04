# Gramax Sync Setup

## Goal

Keep Gramax aligned with this repository so AI agents always consume current documentation.

## Sync Model

- Source of truth in Git: `docs/`, `TASKS.md`, `AGENTS.md`.
- GitHub Action (`docs-sync-gramax.yml`) runs on changes in these paths.
- Action sends a webhook payload with repo, branch, commit, and changed files.

## Required Secret

Add repository secret:

- `GRAMAX_SYNC_WEBHOOK_URL`: endpoint provided by your Gramax integration.

## Payload Contract

The webhook receives JSON:

```json
{
  "provider": "github",
  "repository": "owner/repo",
  "branch": "main",
  "commit": "sha",
  "changed_files": ["docs/index.md", "TASKS.md"]
}
```

## Operational Notes

- If secret is missing, the workflow skips sync and exits cleanly.
- For manual sync, run the workflow via `workflow_dispatch`.
- Keep docs statuses and owners current in `docs/knowledge-registry.json`.
