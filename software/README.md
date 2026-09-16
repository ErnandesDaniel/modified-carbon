# SCMS — Программная реализация

Рабочее приложение Sleeving Clinic Management System: единый backend и два раздельных
веб-портала (внешний для клиентов Meth и внутренний для персонала клиники).

> 📋 План демонстрации соответствия прецедентам UC-01…UC-05 — в [`DEMO.md`](DEMO.md).

## Состав

```
software/
├── backend/          # Spring Boot 3.4 (Java 21) + PostgreSQL + Liquibase — API
├── client-portal/    # Next.js 16 — внешний портал Meth (Google OAuth / демо-вход)
└── internal-portal/  # Next.js 16 — внутренний портал персонала (dev-вход + выбор роли)
```

| Приложение | Порт | Назначение |
| :---- | :---- | :---- |
| backend | 3001 (`/api`) | REST API, БД, бизнес-логика, JWT |
| client-portal | 3000 | Каталог, заказ тела, статус кейса, сертификаты |
| internal-portal | 3002 | Резерв тел, needlecast, валидация, аудит, роли |

## Быстрый старт

### 1. Backend + БД

```powershell
cd software/backend
Copy-Item .env.example .env
docker compose up -d          # PostgreSQL + pgAdmin
mvn spring-boot:run           # http://localhost:3001/api
```

Swagger: http://localhost:3001/api/swagger-ui/index.html

### 2. Внутренний портал (персонал)

```powershell
cd software/internal-portal
pnpm install
pnpm dev                      # http://localhost:3002
```

Вход — кнопкой «Войти как сотрудник» (дефолтный сотрудник). Роль выбирается в
разделе **Настройки**; меню и главная страница меняются под роль:

| Роль | Доступные разделы |
| :---- | :---- |
| Sleeve Broker | Каталог тел, Заказы |
| Needlecaster | Needlecast |
| Psychosurgeon | Валидация |
| Администратор | Все разделы + Пользователи, Аудит |

### 3. Внешний портал (клиент Meth)

```powershell
cd software/client-portal
pnpm install
pnpm dev                      # http://localhost:3000
```

Вход: Google OAuth либо «Демо-вход (M. Kovacs)» для быстрой проверки без Google.
Для реального Google OAuth заполните `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET`
в `software/client-portal/.env.local`.

## Поток данных

```
Next.js portal ──(cookie session)──► /api/proxy/* ──(JWT Bearer)──► backend /api/*
                                              └── PostgreSQL (Liquibase)
```

- `client-portal` получает JWT через NextAuth (`/auth/login`) либо демо-вход (`/auth/client-dev-login`).
- `internal-portal` получает JWT через `/auth/dev-login` и хранит его в httpOnly-cookie.
- Оба портала проксируют запросы в backend, подставляя `Authorization: Bearer <JWT>`.
