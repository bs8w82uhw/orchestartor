# Workspace Guide for Coding Agents

## Quick Start

```sh
npm install
npm run build:dev
npm run dev
```

## Common Commands

- `npm run build:dev`: Builds frontend assets in unminified dev mode.
- `npm run build:dist`: Builds production assets.
- `npm run dev`: Fast local loop (`build:dev` then `bin/debug.sh`).
- `npm test`: Runs the full integration-heavy test suite.
- `make help`: Shows shorthand local workflow commands.
- `make dev`: Shorthand to run local dev loop.

## Repo Map

- `lib/`: server components, APIs, workflows, schedulers, monitors.
- `htdocs/`: web app assets and static files.
- `test/`: full test harness and suite files.
- `bin/`: operational scripts (`build`, `debug`, `control`).
- `sample_conf/`: local config and email templates.
- `TASKS.md`: current prioritized backlog and direction.
- `docs/ai-automation-knowledge-strategy.md`: AI automation + multi-agent governance model.
- `docs/DOCS_GOVERNANCE.md`: docs lifecycle, review, and quality rules.
- `docs/knowledge-registry.json`: owner/status/review metadata for all docs pages.

## Practical Workflow

1. Change code.
2. Rebuild assets (`npm run build:dev`) if UI/static files are affected.
3. Run relevant tests (or `npm test` for full validation).
4. Keep commits focused and avoid unrelated formatting churn.
