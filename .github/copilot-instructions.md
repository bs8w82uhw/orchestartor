---
title: Copilot instructions for xyOps
---

## Архитектура и слои

-  Сервер -- приложение на pixl-server; точка входа [lib/main.js](lib/main.js), загрузка компонентов в [lib/loader.js](lib/loader.js).
-  Основной движок -- компонент [lib/engine.js](lib/engine.js), который собирается через миксины (`ClassUtil.mixin`) в конце файла: утилиты, API, комм, серверы, задания, workflows, мониторинг и т.д. Смотри список миксинов в [lib/engine.js](lib/engine.js).
-  API слой использует namespace `app` и методы с префиксом `api_` в [lib/api.js](lib/api.js), а доменные эндпоинты разнесены по миксинам в [lib/api](lib/api).
-  Веб-клиент -- pixl-xyapp: базовый каркас и инициализация в [htdocs/js/app.js](htdocs/js/app.js); страницы -- в htdocs/js/pages (см. дерево проекта).

## Потоки данных и интеграции

-  Хранилища: `Storage` и `Unbase` подключаются в движке (см. [lib/engine.js](lib/engine.js)). Большинство записей и индексов живут в Unbase, кеши и state -- через Storage.
-  Реалтайм: WebSocket и broadcast-паттерны идут через движок (`startSocketListener`, `doUserBroadcastAll`) -- см. [lib/engine.js](lib/engine.js).
-  Серверы/саттелиты/группы управляются в серверном миксине [lib/server.js](lib/server.js).

## Критичные рабочие команды

-  Установка и дев-цикл: `npm install`, затем `npm run dev` (build:dev + debug) -- см. [AGENTS.md](AGENTS.md) и [package.json](package.json).
-  Сборка фронтенда: `npm run build:dev` (необфусцированные ассеты) или `npm run build:dist` -- см. [package.json](package.json).
-  Debug режим сервера: `./bin/debug.sh` (с REPL и echo-категориями) -- см. [docs/dev.md](docs/dev.md#L66-L140).
-  Тесты: `npm test` (pixl-unit) -- см. [docs/dev.md](docs/dev.md#L140-L170).

## Проектные паттерны и соглашения

-  Добавляя серверную функциональность, выбирай правильный миксин (например, задания -- [lib/job.js](lib/job.js), workflows -- [lib/workflow.js](lib/workflow.js), мониторинг -- [lib/monitor.js](lib/monitor.js)) и подключай API метод `api_` в соответствующем файле [lib/api](lib/api).
-  Проверки доступа делаются через `requireMaster`, `loadSession`, `requireValidUser`, `requireAdmin` в API-слое (см. [lib/api.js](lib/api.js) и примеры в [lib/api/admin.js](lib/api/admin.js)).
-  Конфигурации подхватываются через `multiConfig` в [lib/loader.js](lib/loader.js); локальные примеры -- в [sample_conf](sample_conf).
-  UI-изменения требуют пересборки ассетов (см. `build:dev`), так как `bin/build.js` собирает htdocs.

## Где искать примеры

-  Пример API эндпоинтов и доступа: [lib/api/admin.js](lib/api/admin.js).
-  Пример серверного поведения с индексом и broadcast: [lib/server.js](lib/server.js).
-  Пример клиентской инициализации и конфигов: [htdocs/js/app.js](htdocs/js/app.js).