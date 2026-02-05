---
title: Управление документацией (RU)
---

## Назначение

Эта политика определяет жизненный цикл документации для людей и AI-агентов.
Если процесс не документирован, не отревьюен и не зарегистрирован, он считается неготовым к автоматизации.

## Обязательный процесс изменений

1. Все изменения в документации проходят через Pull Request.
2. Для docs PR обязателен шаблон документационных изменений.
3. Минимум один approve перед merge.
4. В том же PR обновляется `docs/knowledge-registry.json`.
5. Для high-risk документов обязательны разделы policy, escalation и evidence.
6. Любое API-изменение требует:
   - обновления `docs/api.md`;
   - билета совместимости по `docs/automation/API_COMPATIBILITY_CONTRACT_TICKET_TEMPLATE.md`;
   - evidence автономного и ручного теста по `docs/automation/api-debug-compatibility.md`.

## Правила ветки и ревью

Для default branch должны быть включены:

- Обязательный PR перед merge.
- Минимум 1 approving review.
- Обязательные status checks (включая docs hygiene workflow).
- Обязательное разрешение всех review conversation.
- CODEOWNERS review для путей документации.

## Статусы документа

Для каждой страницы в `docs/knowledge-registry.json` задается lifecycle:

- `draft` — черновик, нельзя использовать как агентный источник.
- `active` — проверено, допускается к использованию.
- `deprecated` — устарело, оставлено для миграции/истории.

## Обязательные поля реестра

Для каждой страницы:

- `owner`
- `status`
- `last_reviewed_at` (YYYY-MM-DD)
- `next_review_at` (YYYY-MM-DD)
- `agent_ready` (true/false)
- `risk_level` (`low`, `medium`, `high`)

## Еженедельная проверка качества

Еженедельный docs hygiene workflow проверяет:

- отсутствие записей в реестре для файлов `docs/`;
- отсутствующие owner/status/review даты;
- просроченные даты ревью.

## Связка с контрактами API

Документ governance обязателен как контрольная плоскость для:

- `docs/automation/api-debug-compatibility.md`
- `docs/automation/API_COMPATIBILITY_CONTRACT_TICKET_TEMPLATE.md`
- `docs/automation/API-COMPAT-AUTOMATION-20260205-01.md`

Правило: API-билет и evidence считаются валидными только при соблюдении governance-процесса.
