---
title: Тестирование через Docker Compose (RU)
---

## Назначение

Тестовая среда поддерживает два режима проверки контрактов:

- Автономные тесты (скриптовые, без ручного участия).
- Ручные тесты (интерактивная отладка оператором).

## Файл

- `docker-compose.test.yml`

## Автономный режим

```sh
docker compose -f docker-compose.test.yml --profile auto run --rm xyops-test-auto
```

Команда запускает `npm test` в изолированном контейнере.

## Ручной режим

```sh
docker compose -f docker-compose.test.yml --profile manual up xyops-test-manual
```

После запуска откройте:

- `http://localhost:5522`

## Остановка ручного режима

```sh
docker compose -f docker-compose.test.yml --profile manual down
```

## Запуск в WSL

### Вариант A: Docker Desktop + WSL Integration

1. Откройте Docker Desktop.
2. Перейдите в `Settings -> Resources -> WSL Integration`.
3. Включите интеграцию для вашей дистрибуции (например, Ubuntu).
4. Проверьте в WSL:

```sh
docker version
docker compose version
```

### Вариант B: Без Docker (нативно в WSL)

Автономные тесты:

```sh
npm install
npm test
```

Ручной режим:

```sh
npm install
npm run build:dev
npm run dev
```
