---
title: Langflow Agents Catalog
---

## Назначение

Единый каталог для агентных сценариев Langflow по тестам, отчетам и контрактам.

## Структура

- `SYSTEM_PROMPT_TEST_GUARDIAN.md` — системный промпт агента тестирования.
- `LANGFLOW_PIPELINE_TEST_GUARDIAN.md` — сценарий пайплайна (узлы/шаги/маршрутизация).
- `LANGFLOW_PIPELINE_TEST_GUARDIAN.draft.json` — JSON-черновик для импорта/адаптации в Langflow.
- `LANGFLOW_PIPELINE_TEST_GUARDIAN.v1.7.1.json` — версия JSON под Langflow `1.7.1`.
- `AGENT_TASK_TEST_GUARDIAN.md` — формальная постановка задачи агента.

## Импорт для Langflow 1.7.1

1. Сначала сгенерируйте свежий отчет: `npm run test:report`.
2. В Langflow импортируйте `LANGFLOW_PIPELINE_TEST_GUARDIAN.v1.7.1.json`.
3. Убедитесь, что в LLM-узле задан рабочий API key / provider.
4. Запустите flow: он анализирует `docs/automation/reports/TEST-REPORT-*.md` и выдает приоритизацию + next fix + draft для контракта.

Примечание:
- Каталог `docs/automation/reports/` закреплен в репозитории через `.gitkeep`.
- Если свежего test report нет, flow использует fallback-документ `docs/automation/API-COMPAT-AUTOMATION-20260205-04.md`.

## Артефакты выполнения

- Отчеты тестов: `docs/automation/reports/`
- Сырые логи: `test/logs/`
