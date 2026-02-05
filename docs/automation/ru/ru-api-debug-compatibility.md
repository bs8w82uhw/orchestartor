---
title: Отладка API и контракт совместимости
---

## Назначение

Зафиксировать обязательный контур для:

- отладки API,
- контроля совместимости,
- контрактного sign-off.

## Область

Применяется к изменениям endpoint'ов, которые затрагивают:

- request/response контракт,
- auth/privilege checks,
- runtime policy behavior,
- compatibility guarantees.

## Предусловия

- Определены endpoint и версия.
- Подготовлено обновление `docs/api.md`.
- Создан ticket по шаблону совместимости.

## Процедура

Любое изменение API должно включать:

1. Обновление `docs/api.md`.
2. Билет совместимости API по шаблону.
3. Доказательства автономного и ручного тестирования.

### Что фиксировать в отладке

- Примеры request/response.
- Ошибки и их формат.
- Проверки прав и policy.
- Побочные эффекты и логи.

### Политика совместимости

- Предпочтительны additive-изменения.
- Breaking changes допускаются только с миграционными заметками и отдельным согласованием.
- Deprecated-поля должны иметь срок удаления.

## Сценарии отказа

- Endpoint изменен без ticket и evidence.
- Не зафиксированы compatibility guarantees.
- Нет ручного evidence для high-risk runtime путей.
- Breaking change без migration notes и explicit approval.

## Эскалация

- Статус ticket: `conditional`/`rejected`, если evidence неполный.
- Для breaking changes обязателен отдельный reviewer sign-off.
- Merge блокируется до заполнения `docs/api.md`, ticket и evidence.

## Чеклист доказательств

- [ ] Обновлен `docs/api.md`.
- [ ] Добавлен/обновлен compatibility ticket.
- [ ] Приложены autonomous evidence.
- [ ] Приложены manual evidence.
- [ ] Зафиксировано reviewer decision (`approved|conditional|rejected`).
