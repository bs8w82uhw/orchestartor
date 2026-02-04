---
title: Local Contributing Workflow
---

This file is a practical local workflow companion to `CONTRIBUTING.md`.

## 1) Setup

```sh
npm install
make build-dev
```

## 2) Run Locally

```sh
make dev
```

This starts xyOps in debug mode after a dev asset build.

## 3) Test Before Commit

```sh
make test
```

The test suite is integration-heavy and may take time.

## 4) Keep Changes Focused

-  Prefer small PRs with one clear purpose.
-  Avoid unrelated refactors and formatting churn.
-  Update docs (`docs/` or local guides) when behavior changes.

## 5) Useful Paths

-  `lib/` server logic and APIs
-  `htdocs/` web assets
-  `test/` suite and fixtures
-  `sample_conf/` config templates