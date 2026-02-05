---
title: Evidence Runbook (WSL2 + Docker)
---

## Purpose

Organize a repeatable path to collect autonomous and manual evidence for automation compatibility tickets.

## Preconditions

- Windows host with WSL2 distro.
- Docker Desktop installed.
- Docker Desktop WSL integration enabled for this distro.
- Node.js available in the target runtime (container or native).

## Procedure

1. Verify environment:

```sh
wsl.exe -l -v
docker version
docker compose version
```

2. Run autonomous suite in container:

```sh
docker compose -f docker-compose.test.yml --profile auto run --rm xyops-test-auto
```

3. Run manual verification environment:

```sh
docker compose -f docker-compose.test.yml --profile manual up xyops-test-manual
```

4. Execute manual scenario for workflow continue gate (`advisory` then `enforced`) and capture:
   - request payload
   - response payload
   - workflow state snapshot
   - log lines with policy reason

5. Stop manual environment:

```sh
docker compose -f docker-compose.test.yml --profile manual down
```

6. Attach evidence in:
   - `docs/automation/API-COMPAT-AUTOMATION-20260205-04.md`
   - `docs/automation/EXECUTION_automation-manager_2026-02.md`
   - `docs/automation/method-catalog-automation-manager.md`

## Evidence Checklist

- [ ] `auto` profile run log attached.
- [ ] Manual walkthrough timestamp recorded.
- [ ] Deny/allow traces attached.
- [ ] Ticket decision updated (`conditional` -> `approved` if complete).
