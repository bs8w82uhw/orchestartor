---
title: Copilot instructions for xyOps
order: 10.5
---

## Архитектура и слои

-  Сервер -- приложение на pixl-server; точка входа [./main.js](./main.js), загрузка компонентов в [./loader.js](./loader.js).
-  Основной движок -- компонент [./engine.js](./engine.js), который собирается через миксины (`ClassUtil.mixin`) в конце файла: утилиты, API, комм, серверы, задания, workflows, мониторинг и т.д. Смотри список миксинов в [./engine.js](./engine.js).
-  API слой использует namespace `app` и методы с префиксом `api_` в [./api.js](./api.js), а доменные эндпоинты разнесены по миксинам в [./../orchestartor/.github/lib/api](./../orchestartor/.github/lib/api).
-  Веб-клиент -- pixl-xyapp: базовый каркас и инициализация в [./app.js](./app.js); страницы -- в htdocs/js/pages (см. дерево проекта).

## Потоки данных и интеграции

-  Хранилища: `Storage` и `Unbase` подключаются в движке (см. [./engine.js](./engine.js)). Большинство записей и индексов живут в Unbase, кеши и state -- через Storage.
-  Реалтайм: WebSocket и broadcast-паттерны идут через движок (`startSocketListener`, `doUserBroadcastAll`) -- см. [./engine.js](./engine.js).
-  Серверы/саттелиты/группы управляются в серверном миксине [./server.js](./server.js).

## Критичные рабочие команды

-  Установка и дев-цикл: `npm install`, затем `npm run dev` (build:dev + debug) -- см. [./../orchestartor/.github/AGENTS.md](./../orchestartor/.github/AGENTS.md) и [./package.json](./package.json).
-  Сборка фронтенда: `npm run build:dev` (необфусцированные ассеты) или `npm run build:dist` -- см. [./package.json](./package.json).
-  Debug режим сервера: `./bin/debug.sh` (с REPL и echo-категориями) -- см. [./../orchestartor/.github/docs/dev.md](./../orchestartor/.github/docs/dev.md#L66-L140).
-  Тесты: `npm test` (pixl-unit) -- см. [./../orchestartor/.github/docs/dev.md](./../orchestartor/.github/docs/dev.md#L140-L170).

## Проектные паттерны и соглашения

-  Добавляя серверную функциональность, выбирай правильный миксин (например, задания -- [./job.js](./job.js), workflows -- [./workflow.js](./workflow.js), мониторинг -- [./monitor.js](./monitor.js)) и подключай API метод `api_` в соответствующем файле [./../orchestartor/.github/lib/api](./../orchestartor/.github/lib/api).
-  Проверки доступа делаются через `requireMaster`, `loadSession`, `requireValidUser`, `requireAdmin` в API-слое (см. [./api.js](./api.js) и примеры в [./admin.js](./admin.js)).
-  Конфигурации подхватываются через `multiConfig` в [./loader.js](./loader.js); локальные примеры -- в [./../orchestartor/.github/sample_conf](./../orchestartor/.github/sample_conf).
-  UI-изменения требуют пересборки ассетов (см. `build:dev`), так как `bin/build.js` собирает htdocs.

## Где искать примеры

-  Пример API эндпоинтов и доступа: [./admin.js](./admin.js).
-  Пример серверного поведения с индексом и broadcast: [./server.js](./server.js).
-  Пример клиентской инициализации и конфигов: [./app.js](./app.js).