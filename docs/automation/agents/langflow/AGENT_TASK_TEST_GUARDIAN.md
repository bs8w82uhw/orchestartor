---
title: Agent Task - Test Guardian
---

## Mission

Автономно запускать тесты, анализировать падения, приоритизировать проблемы и готовить отчет + план следующего фикса.

## Inputs

- Команда: `bash bin/test-report-agent.sh`
- Репорт: `docs/automation/reports/TEST-REPORT-*.md`
- Алиас свежего репорта: `docs/automation/reports/LATEST_TEST_REPORT.md`
- Машинный summary: `docs/automation/reports/LATEST_TEST_REPORT.json`
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
- Если данных нет в артефактах, возвращается `unknown`, а не гипотеза.

## Prompt Template Standard (Annotations)

Ниже приведен стандарт аннотаций, которые агент должен генерировать вместе с промтом, передаваемым раннеру. Аннотации служат для однозначного исполнения, логирования и повторяемости.

### Required Properties

- `id`: уникальный идентификатор шаблона.
- `title`: короткое название.
- `version`: версия шаблона.
- `owner`: владелец.
- `status`: `draft|active|deprecated`.
- `risk_level`: `low|medium|high`.
- `agent_ready`: `true|false`.
- `inputs`: входные данные (переменные).
- `outputs`: ожидаемые выходы.
- `constraints`: ограничения на действия.
- `preflight_checklist`: список проверок до запуска.
- `dry_run`: флаг или режим безопасного запуска.
- `runner`: как выполнить (команда/раннер).

### Optional Properties

- `audience`: целевая аудитория.
- `role`: роль/персона.
- `structure`: требуемая структура ответа.
- `negative_prompts`: список исключений.
- `metrics`: базовые метрики.

### Template Example (YAML + Prompt)

```yaml
id: test-guardian-v1
title: Test Guardian
version: 1
owner: docs-core
status: active
risk_level: low
agent_ready: true
role: "QA lead"
audience: "инженеры и релиз-менеджеры"
structure: "Вводная -> Top-5 проблем -> Рекомендация -> Evidence/Decision"
negative_prompts:
  - "не делать предположений без данных"
  - "не менять код"
inputs:
  - report_path
  - log_path
outputs:
  - summary
  - priorities
  - next_fix
constraints:
  - "read-only файловая система"
preflight_checklist:
  - "артефакты доступны"
  - "репорт актуален"
dry_run: true
runner: "codex exec -"
```

```text
System: You are a test guardian. Follow the structure strictly.
User: Analyze {{report_path}} and {{log_path}}. Provide summary, priorities, and next fix.
```

### Examples (Prompt Styles)

- Ролевая установка: "Ты — техписатель/QA lead. Пиши кратко и по делу."
- Целевая аудитория: "Объясни для нетехнических менеджеров, без жаргона."
- Структурирование запроса: "Сделай план с введением, 3 разделами и заключением."
- Негативные промпты: "Не предлагай изменения в коде. Не используй внешние источники."
