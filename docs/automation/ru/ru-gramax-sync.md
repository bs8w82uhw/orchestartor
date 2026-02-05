---
title: Синхронизация с Gramax (RU)
---

## Цель

Поддерживать базу знаний Gramax синхронной с репозиторием, чтобы агенты работали по актуальной документации.

## Канонический URL базы знаний

- `https://app.gram.ax/github.com/bs8w82uhw/knowladge/master/`

## Где добавить webhook URL

В GitHub репозитории:

1. `Settings`
2. `Secrets and variables`
3. `Actions`
4. `New repository secret`

Создайте secret:

- `GRAMAX_SYNC_WEBHOOK_URL` = webhook URL из интеграции Gramax.

## Модель синхронизации

- Источник истины: `docs/`, `TASKS.md`, `AGENTS.md`.
- Workflow: `.github/workflows/docs-sync-gramax.yml`.
- Запуск: push в docs-пути и ручной `workflow_dispatch`.

## Контракт payload

```json
{
  "provider": "github",
  "repository": "owner/repo",
  "branch": "main",
  "commit": "sha",
  "changed_files": ["docs/index.md", "TASKS.md"]
}
```

## Если webhook пока не найден

- Оставьте задачу как `blocked` в бэклоге.
- Продолжайте вести docs-as-code в репозитории.
- После получения webhook URL добавьте secret и вручную запустите sync workflow.
