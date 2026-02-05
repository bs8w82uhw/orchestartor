---
title: Стандарт Gramax: Docs-as-Code, техрайтинг и адаптация для AI-агентов
---

## Назначение

Единый стандарт написания документации, чтобы она была:

- понятна людям,
- однозначна для AI-агентов,
- поддерживаема через Git-процессы.

## Обязательная структура документа

1. Purpose / Назначение
2. Scope / Область
3. Preconditions / Предусловия
4. Procedure / Процедура (нумерованные шаги)
5. Failure Modes / Сценарии отказа
6. Escalation / Эскалация
7. Evidence Checklist / Чеклист доказательств

## Правила техрайтинга

- Короткие, императивные формулировки.
- Один шаг = одно действие + ожидаемый результат.
- Не использовать размытые формулировки (`возможно`, `и т.д.`) в процедурах.
- Явно указывать роль исполнителя: `Planner`, `Executor`, `Reviewer`, `Safety/Audit`.
- Политики писать нормативно: `must`, `must not`, `requires`.

## Правила Docs-as-Code

- Любое изменение через PR + review.
- В том же PR обновлять `docs/knowledge-registry.json`.
- Ссылки только стабильные и относительные.
- Изменения предпочтительно additive; удаление через этап deprecation.

## Готовность для AI-агентов

Для агентных страниц обязательны поля реестра:

- `owner`
- `status`
- `risk_level`
- `agent_ready`
- `last_reviewed_at`
- `next_review_at`

Рекомендуемые служебные теги в тексте:

- `agent_role_scope`
- `human_approval_required`
- `tool_scope`
- `compatibility_contract_ref`

## Правила для RAG/поиска

- Один раздел = одна завершенная задача.
- Шаги процедуры атомарные.
- Ограничения размещать рядом с действием.
- Критические deny/allow условия повторять в Procedure и Failure Modes.

## Привязка к Gramax

- Ветка `Product Docs` -> `docs/index.md`
- Ветка `Automation Governance Docs` -> `docs/automation/index.md`
