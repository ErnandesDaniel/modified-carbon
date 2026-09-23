# SCMS Internal Portal

Внутренний портал персонала клиники (Vite + React 19 + TanStack + Ant Design 5).

SPA с ролевым доступом (RBAC) для сотрудников: Sleeve Broker, Needlecaster, Psychosurgeon, Admin.

## Стек

- **Bun** — пакетный менеджер и рантайм скриптов
- **Vite 6** + **React 19** + **TypeScript** (strict)
- **@tanstack/react-router** — code-based маршрутизация (`src/app/router.tsx`)
- **@tanstack/react-query** — серверное состояние
- **Ant Design 5** + `@ant-design/v5-patch-for-react-19`, локаль `ru_RU`, тема `colorPrimary: #722ed1`
- **axios** — `baseURL: /api`, `withCredentials: true`, 401 -> редирект на `/login`

## Запуск

```sh
bun install
bun run dev        # http://localhost:3002
```

Vite проксирует `/api` на backend `http://localhost:3001` (`changeOrigin: true`).

Требуется запущенный backend (`software/backend`, http://localhost:3001).

### Скрипты

| Скрипт | Назначение |
| :---- | :---- |
| `bun run dev` | dev-сервер на порту **3002** |
| `bun run build` | `tsc --noEmit && vite build` (папка `dist/`) |
| `bun run preview` | предпросмотр production-сборки |
| `bun run lint` | проверка типов (`tsc --noEmit`) |
| `bun run typecheck` | проверка типов (`tsc --noEmit`) |

## Переменные окружения

Скопируйте `.env.example` в `.env`:

```
VITE_API_BASE=/api
```

## Аутентификация

No cookie -> redirect на `/login`. Сессия загружается через `GET /api/auth/me`.

Демо-вход: кнопка «Войти как сотрудник» вызывает `POST /api/auth/dev-login` (body `{ name }`),
backend ставит httpOnly-cookie, после чего портал переходит на `/dashboard`.

## Роли и разделы (RBAC)

Роль берётся из `user.role`; меню и разделы фильтруются по роли. Смена роли доступна в
**Настройки** (`PATCH /api/user/me`) и мгновенно перестраивает интерфейс.

| Раздел | Путь | Роли |
| :---- | :---- | :---- |
| Дашборд | `/dashboard` | все сотрудники |
| Каталог тел | `/sleeves` | SLEEVE_BROKER, ADMIN |
| Заказы | `/orders` | SLEEVE_BROKER, ADMIN |
| Needlecast | `/needlecast`, `/needlecast/:id` | NEEDLECASTER, ADMIN |
| Валидация | `/validation`, `/validation/:id` | PSYCHOSURGEON, ADMIN |
| Сертификаты | `/certificates` | все сотрудники |
| Пользователи | `/users` | ADMIN |
| Аудит | `/audit` | ADMIN |
| Настройки | `/settings` | все сотрудники |

## Архитектура (FSD)

```
src/
  app/            # провайдеры, router.tsx, shell
  features/       # страницы-фичи (auth, dashboard, sleeves, orders, needlecast, validation, certificates, users, audit, settings)
  shared/         # api (typed REST), config, lib, ui, styles
```

### Typed API layer

`src/shared/api` — рукописный типизированный слой, повторяющий структуру reference `shared/rest-client`:
DTO (`dto/`), axios-инстанс (`axiosInstance.ts`) и запросы + фабрики `queryOptions` (`index.ts`).
