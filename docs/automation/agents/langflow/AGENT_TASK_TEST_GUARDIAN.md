---
title: Agent Task - Test Guardian
---

## Mission

Автономно запускать тесты, анализировать падения, приоритизировать проблемы и готовить отчет + план следующего фикса.

## Inputs

- Команда: `npm run test:report`
- Репорт: `docs/automation/reports/TEST-REPORT-*.md`
- Raw log: `test/logs/unit-output-*.log`
- Контракт: `docs/automation/API-COMPAT-AUTOMATION-20260205-04.md`

## Outputs

1. Краткий статус прогона (`pass/fail`, `failed count`, `elapsed`).
2. Топ-5 проблем с приоритетами `P0/P1/P2`.
3. Один рекомендуемый следующий фикс (файл, метод, проверка).
4. Готовый блок Evidence/Decision для контрактного тикета.

## Prioritization Rules

- `P0`: runtime crash (`TypeError`, `ReferenceError`, `Uncaught Exception`).
- `P1`: нарушение API/контрактного поведения.
- `P2`: нестабильность теста, данные/окружение.

## Done Criteria

- Отчет сформирован.
- Падения сгруппированы и приоритизированы.
- Выдан четкий next step для разработки.
