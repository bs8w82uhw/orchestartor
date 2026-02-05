---
title: Test Report Agent
---

## Purpose

Test Report Agent runs the full autonomous test pipeline and generates a structured Markdown report for debugging, contract tickets, and Gramax knowledge sync.

## What It Does

1. Runs Docker-based test flow (`docker-compose.test.yml`).
2. Captures raw logs in `test/logs/unit-output-*.log`.
3. Builds a report in `docs/automation/reports/TEST-REPORT-*.md`.
4. Extracts summary, failing assertions, and runtime error markers.

## Run

```sh
npm run test:report
```

or

```sh
bash bin/test-report-agent.sh
```

## Outputs

- Report: `docs/automation/reports/TEST-REPORT-<UTC_TIMESTAMP>.md`
- Raw log: `test/logs/unit-output-<UTC_TIMESTAMP>.log`

## Recommended Workflow

1. Run `npm run test:report`.
2. Use report summary to prioritize failures.
3. Fix top issue group.
4. Re-run and compare with previous report.
5. Attach report path to API compatibility contract ticket evidence.
