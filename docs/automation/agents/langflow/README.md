---
title: Langflow Agents Catalog
---

## Назначение

Единый каталог для агентных сценариев Langflow по тестам, отчетам и контрактам.

## Структура

- `SYSTEM_PROMPT_TEST_GUARDIAN.md` — системный промпт агента тестирования.
- `LANGFLOW_PIPELINE_TEST_GUARDIAN.md` — сценарий пайплайна (узлы/шаги/маршрутизация).
- `LANGFLOW_PIPELINE_TEST_GUARDIAN.draft.json` — JSON-черновик для импорта/адаптации в Langflow.
- `LANGFLOW_PIPELINE_TEST_GUARDIAN.v1.7.1.json` — рабочая версия JSON под твое окружение Langflow `1.7.1`.
- `LANGFLOW_PIPELINE_TEST_GUARDIAN.v1.7.1.portable.json` — переносимая версия с нейтральными provider-настройками.
- `AGENT_TASK_TEST_GUARDIAN.md` — формальная постановка задачи агента.

## Импорт для Langflow 1.7.1

1. Сначала сгенерируйте свежий отчет: `bash bin/test-report-agent.sh`.
2. Запустите Langflow в тестовом compose-контуре:
   - `docker compose -f docker-compose.test.yml --profile langflow up -d langflow`
   - UI: `http://localhost:7860`
   - первый запуск собирает образ `Dockerfile.langflow` (это нормально)
3. В Langflow импортируйте один из вариантов:
   - `LANGFLOW_PIPELINE_TEST_GUARDIAN.v1.7.1.json` (текущий рабочий в твоем окружении)
   - `LANGFLOW_PIPELINE_TEST_GUARDIAN.v1.7.1.portable.json` (для переноса в другое окружение)
4. Убедитесь, что в LLM-узле задан рабочий API key / provider.
5. Запустите flow: он анализирует `docs/automation/reports/TEST-REPORT-*.md` и выдает приоритизацию + next fix + draft для контракта.

Примечание:
- Каталог `docs/automation/reports/` закреплен в репозитории через `.gitkeep`.
- Скрипт всегда обновляет алиасы:
  - `docs/automation/reports/LATEST_TEST_REPORT.md`
  - `docs/automation/reports/LATEST_TEST_REPORT.json`
- Если свежего test report нет, агент вернет `unknown` по метрикам (без выдуманных значений).

## Управление Langflow (Docker Compose)

- Старт: `docker compose -f docker-compose.test.yml --profile langflow up -d langflow`
- Логи: `docker compose -f docker-compose.test.yml --profile langflow logs -f langflow`
- Стоп: `docker compose -f docker-compose.test.yml --profile langflow stop langflow`
- Удалить контейнер: `docker compose -f docker-compose.test.yml --profile langflow rm -f langflow`

## Smoke-check (коротко)

1. `bash bin/test-report-agent.sh`
2. Импортируйте flow JSON в Langflow UI
3. Проверьте, что node `Directory` читает `docs/automation/reports`
4. Запустите flow и сверяйте числа с `docs/automation/reports/LATEST_TEST_REPORT.json`

## Артефакты выполнения

- Отчеты тестов: `docs/automation/reports/`
- Сырые логи: `test/logs/` (если каталог недоступен по правам, fallback: `docs/automation/reports/raw-logs/`)
