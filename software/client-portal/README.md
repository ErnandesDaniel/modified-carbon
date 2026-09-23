# SCMS · Sleeving Clinic — Client Portal

Внешний портал клиники для роли **Meth** (заказчик тела). Vite + React 19 SPA
(Feature-Sliced Design), TanStack Router (code-based) + TanStack Query, Ant Design (ru_RU, `#722ed1`).

## Стек

- bun (package manager), Vite 6, TypeScript strict
- React 19 + `@ant-design/v5-patch-for-react-19`
- `@tanstack/react-router` — маршрутизация кодом в `src/app/router.tsx`
- `@tanstack/react-query` — всё серверное состояние
- `antd` + `@ant-design/icons`
- `axios` — инстанс с `baseURL: /api` и `withCredentials: true`

## Требования

Backend должен быть запущен на **http://localhost:3001** (context-path `/api`).
В dev-режиме Vite проксирует `'/api' -> 'http://localhost:3001'` (path сохраняется).

## Запуск

```bash
bun install
bun run dev      # http://localhost:3000
```

Прочие скрипты:

```bash
bun run build      # tsc -b && vite build
bun run preview    # предпросмотр production-сборки, порт 3000
bun run lint       # tsc --noEmit
bun run typecheck  # tsc --noEmit
```

## Переменные окружения

`.env` (см. `.env.example`):

```
VITE_API_BASE=/api
```

## Авторизация

- При старте выполняется `GET /api/auth/me`. Пока запрос идёт — показывается спиннер.
- Публичные маршруты: `/` (лендинг) и `/login`. Остальные защищены guard'ом
  (`beforeLoad` в `src/app/router.tsx`) и редиректят на `/login`.
- **Google**: кнопка ведёт на `/api/oauth2/authorization/google` (backend сам ставит cookie и
  возвращает на портал).
- **Демо**: `POST /api/auth/client-dev-login`, затем обновляется `/api/auth/me` и переход в `/cabinet`.
- **Выход**: `POST /api/auth/logout`, сброс кэша и переход на `/login`.
- Ответ 401 вне публичных маршрутов и вне `/auth/*` перехватывается axios-интерцептором и
  перенаправляет на `/login` (исключение для `/auth/*` нужно, чтобы `GET /auth/me` не ломал
  публичный лендинг).

## Структура (FSD)

```
src/
  app/        # router, providers (query/antd/auth), styles
  features/   # landing, auth/login, cabinet (layout + pages)
  shared/     # api (dto + endpoints + hooks), config (labels/env), lib, ui
```

## Маршруты

| Маршрут                  | Экран                                   |
| ------------------------ | --------------------------------------- |
| `/`                      | Публичный лендинг                       |
| `/login`                 | Вход (Google / демо)                    |
| `/cabinet`               | Дашборд: этап кейса, заказы, кейсы, сертификаты |
| `/cabinet/catalog`       | Каталог доступных тел + заказ           |
| `/cabinet/orders`        | Мои заказы                              |
| `/cabinet/certificates`  | Сертификаты (печать PDF)                |
