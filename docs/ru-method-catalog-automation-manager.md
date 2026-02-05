---
title: Каталог методов — Automation Manager (RU)
---

## Область

Каталог фиксирует методы Automation Manager для policy evaluation и enforcement.

## Трекинг отладки контрактов

Используются статусы:

- `autonomous`: `pending` / `pass` / `partial` / `fail`
- `manual`: `pending` / `pass` / `partial` / `fail`

## Матрица отладки по методам (цикл 2026-02-05)

| Метод | Autonomous | Manual | Evidence | Следующий шаг |
|------|------------|--------|----------|---------------|
| `api_get_automation_manager` | pass | pending | `test/suites/test-admin.js:208` | Ручная проверка структуры `recentDecisions`. |
| `api_evaluate_automation_task` | pass | pending | `test/suites/test-admin.js:218` | Ручной deny/allow в `enforced` режиме. |
| `automationManagerSetup` | partial | pending | `lib/automation-manager.js` | Добавить прямой init-тест по конфиг-вариантам. |
| `getAutomationManagerStatus` | partial | pending | Косвенно через API | Добавить прямой тест sanitization/shape. |
| `evaluateAutomationPolicy` | partial | pending | Косвенно через API | Добавить matrix-тест low/medium/high. |
| `recordAutomationDecision` | partial | pending | `lib/api/automation.js:45` | Проверить ring buffer limit = 100. |
| `normalizeAutomationRisk` | pass | pending | `test/suites/test-admin.js:229` | Добавить fallback-кейсы для invalid risk. |
| `launchJob` (policy gate) | pending | pending | `lib/job.js:87` | Добавить deny/allow autonomous кейсы. |
| `runJobAction` (policy gate) | pending | pending | `lib/action.js:132` | Добавить deny-path и meta-log asserts. |
| `continueWFController` (policy gate) | pending | pending | `lib/workflow.js:1057` | Добавить workflow contract tests + manual walkthrough. |

## Снимок покрытия

- Autonomous: `pass=3`, `partial=4`, `pending=3`, `fail=0`.
- Manual: `pending=10`.

## API-методы

### api_get_automation_manager

- Location: `lib/api/automation.js`
- Contract: возвращает статус менеджера и недавние policy-решения.

### api_evaluate_automation_task

- Location: `lib/api/automation.js`
- Contract: оценивает задачу по policy.

## Core policy-методы

### automationManagerSetup

- Location: `lib/automation-manager.js`
- Contract: инициализирует runtime-состояние менеджера.

### getAutomationManagerStatus

- Location: `lib/automation-manager.js`
- Contract: возвращает безопасную копию состояния менеджера.

### evaluateAutomationPolicy

- Location: `lib/automation-manager.js`
- Contract: решение allow/deny + reason.

### recordAutomationDecision

- Location: `lib/automation-manager.js`
- Contract: запись решения в ring buffer (max 100).

### normalizeAutomationRisk

- Location: `lib/automation-manager.js`
- Contract: нормализация `low|medium|high` (default `medium`).

## Enforcement-методы

### launchJob (policy gate)

- Location: `lib/job.js`
- Contract: блок запуска при deny в `enforced`.

### runJobAction (policy gate)

- Location: `lib/action.js`
- Contract: блок action execution при deny.

### continueWFController (policy gate)

- Location: `lib/workflow.js`
- Contract: блок стадии `continue` при deny.
