---
title: Langflow Pipeline - Test Guardian
---

## Suggested Nodes

1. **Input Node**
   - Optional parameters: `scope`, `max_issues` (default 5).

2. **Command Node**
   - Run: `npm run test:report`

3. **Artifact Finder Node**
   - Find latest:
     - `docs/automation/reports/TEST-REPORT-*.md`
     - `docs/automation/reports/LATEST_TEST_REPORT.json`
     - `test/logs/unit-output-*.log`

4. **Parser Node**
   - Extract:
     - `Tests passed/failed`
     - `Assertions`
     - `Time Elapsed`
     - `Assert Failed` lines
     - runtime errors (`TypeError|ReferenceError|Uncaught`)

5. **Prioritizer Node**
   - Map issues to `P0/P1/P2`.

6. **Planner Node**
   - Select one primary next fix.
   - Produce verification command.

7. **Contract Draft Node**
   - Generate markdown snippet for
     `docs/automation/API-COMPAT-AUTOMATION-20260205-04.md`.

8. **Output Node**
   - Final structured response:
     - Run Summary
     - Top Issues
     - Next Fix
     - Contract Update Draft

## Routing Rules

- If no artifacts found -> return infra/setup error with exact missing path.
- If `Tests failed == 0` -> skip Planner and return success + maintenance advice.
- If `P0` exists -> Planner must choose `P0` issue first.
