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

## WSL Launch Options

If `docker` is not available in WSL, use one of these options.

### Option A: Docker Desktop + WSL Integration

1. Open Docker Desktop.
2. Go to `Settings -> Resources -> WSL Integration`.
3. Enable integration for your distro (e.g. Ubuntu).
4. Restart terminal and verify:

```sh
docker version
docker compose version
```

Then run the compose commands from this guide.

### Option B: Native WSL (No Docker)

Use local runtime directly inside WSL:

Autonomous tests:

```sh
npm install
npm test
```

Manual mode:

```sh
npm install
npm run build:dev
npm run dev
```

Then open `http://localhost:5522`.
