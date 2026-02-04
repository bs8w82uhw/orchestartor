---
title: Testing with Docker Compose
---

## Purpose

This compose setup provides two test modes aligned with contract-driven validation:

- Autonomous tests (scripted): full test suite.
- Manual tests (operator-driven): interactive debug server.

## File

- `docker-compose.test.yml`

## Autonomous Test Mode

Run:

```sh
docker compose -f docker-compose.test.yml --profile auto run --rm xyops-test-auto
```

This executes `npm test` in a containerized environment.

## Manual Test Mode

Run:

```sh
docker compose -f docker-compose.test.yml --profile manual up xyops-test-manual
```

Then open:

- `http://localhost:5522`

This starts a dev build and debug server with Automation Manager enabled in advisory mode.

## Stop Manual Mode

```sh
docker compose -f docker-compose.test.yml --profile manual down
```

## Notes

- Use manual mode for contract walkthroughs and human checkpoints.
- Use autonomous mode for repeatable regression checks.
