# SCMS — Sleeving Clinic Management System

Рабочее приложение SCMS, реализующее прецеденты UC-01…UC-05: единый backend, внешний портал
клиента (Meth) и внутренний портал персонала. Архитектура и стиль повторяют эталонный проект
`ai-graph-chat` (Spring Boot + Vite/React + FSD).

План демонстрации соответствия прецедентам — в [`DEMO.md`](DEMO.md).

## Структура

```
software/
├── backend/          # Spring Boot 3.4 (Java 21) + PostgreSQL + Liquibase — API (:3001)
├── client-portal/    # Vite + React 19 (SPA) — внешний портал Meth (:3000)
├── internal-portal/  # Vite + React 19 (SPA) — внутренний портал персонала (:3002)
└── infra/            # compose, .env, конфиги запуска
```

## Быстрый старт

Подробно — в [`infra/README.md`](infra/README.md). Кратко:

```powershell
# 1. Переменные окружения
Copy-Item infra/.env.example infra/.env      # и заполнить

# 2а. Весь стек в контейнерах
docker compose -f infra/compose.yaml --profile full up -d --build

# 2б. Или локальная разработка: инфраструктура + mvn + bun
docker compose -f infra/compose.yaml up -d
cd backend;        Copy-Item .env.example .env; mvn spring-boot:run
cd ../client-portal;   bun install; bun run dev
cd ../internal-portal; bun install; bun run dev
```

Адреса:

- Клиент (Meth): http://localhost:3000
- Персонал: http://localhost:3002
- Backend / Swagger UI: http://localhost:3001/api/swagger-ui/index.html
- pgAdmin: http://localhost:8081

## Аутентификация (cookie-based, как в ai-graph-chat)

- **Клиент (Meth):** Google OAuth2 — фронт редиректит на `/api/oauth2/authorization/google`,
  backend (`oauth2Login`) кладёт JWT в httpOnly-cookie и редиректит обратно. Демо-вход без
  Google: кнопка «Демо-вход (M. Kovacs)» → `POST /api/auth/client-dev-login`.
- **Персонал:** `POST /api/auth/dev-login` (имя сотрудника) → cookie. Роль переключается в
  «Настройках» (`PATCH /api/user/me`) — меню меняется под роль (RBAC).
- Прочее: `GET /api/auth/me`, `POST /api/auth/logout`, `POST /api/auth/refresh`.

## Роли персонала (internal-portal)

| Роль | Доступные разделы |
| :---- | :---- |
| Sleeve Broker | Каталог тел, Заказы |
| Needlecaster | Needlecast |
| Psychosurgeon | Валидация |
| Администратор | Все разделы + Пользователи, Аудит |

## Покрытие прецедентов

| UC | Где |
| :---- | :---- |
| UC-05 RegisterMeth | client-portal `/login` (Google + демо) |
| UC-01 OrderSleeve | client `/cabinet/catalog` → `POST /orders`; internal `/orders` |
| UC-02 ManageSleeveReserve | internal `/sleeves` (культивация, приёмка, резерв) |
| UC-03 ConductNeedlecast | internal `/needlecast` (старт/результат/инцидент) |
| UC-04 ExamineAndCertify | internal `/validation` (чекпоинты → сертификат) |
| RBAC / Аудит | internal `/settings`, `/users`, `/audit` |

## Документация подсистем

- [`infra/README.md`](infra/README.md) — запуск, переменные окружения, режимы Docker
- [`backend/README.md`](backend/README.md) — API, аутентификация, стиль кода
- [`client-portal/README.md`](client-portal/README.md) — внешний портал Meth
- [`internal-portal/README.md`](internal-portal/README.md) — внутренний портал персонала
