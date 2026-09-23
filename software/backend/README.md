# SCMS Backend

Backend приложения Sleeving Clinic Management System (Java 21 + Spring Boot 3.4),
реализованный в архитектурном стиле эталонного проекта `ai-graph-chat`.

Обслуживает **внешний портал Meth** и **внутренний портал персонала**. Единая PostgreSQL БД,
миграции через Liquibase, аутентификация через Spring Security OAuth2 с JWT в httpOnly-cookie.
DTO — Java records, маппинг сущностей и ошибки — по конвенциям примера.

## Быстрый старт

```powershell
# 1. Поднять инфраструктуру (PostgreSQL + pgAdmin) из общего compose
cd ../infra
docker compose -f compose.yaml up -d

# 2. Создать .env
cd ../backend
Copy-Item .env.example .env

# 3. Запустить приложение
mvn spring-boot:run
```

## Доступ

- **API:** http://localhost:3001/api
- **Swagger UI:** http://localhost:3001/api/swagger-ui/index.html
- **pgAdmin:** http://localhost:8081

## Аутентификация

| Способ | Endpoint | Кто использует |
| :---- | :---- | :---- |
| Google OAuth2 | `GET /api/oauth2/authorization/google` | client-portal |
| Демо-вход клиента | `POST /auth/client-dev-login` | client-portal (без Google) |
| Вход персонала | `POST /auth/dev-login` | internal-portal (имя сотрудника) |
| Текущий пользователь | `GET /auth/me` | оба портала |
| Выход | `POST /auth/logout` | оба портала |
| Обновление токена | `POST /auth/refresh` | оба портала |

OAuth2-успех кладёт access/refresh JWT в httpOnly-cookie (`JWT`, `REFRESH`) и редиректит
на `FRONTEND_BASE_URL`. Защищённые запросы аутентифицируются фильтром
`JwtCookieAuthenticationFilter` (читает cookie), а `@CurrentUserId` резолвит id из JWT.

## Эндпоинты

Полный список — в Swagger. Основные группы:

- `/auth` — вход/выход/refresh/me
- `/user`, `/user/me`, `/user/{id}` — профиль и роли (RBAC)
- `/sleeves`, `/sleeves/cultivation`, `/sleeves/{id}/intake/*`, `/sleeves/{id}/reserve|release` — UC-01/UC-02
- `/orders` — UC-01 (`confirm`, `await-body`, `cancel`)
- `/cases`, `/cases/{id}/start|complete|incident` — UC-03
- `/cases/{id}/checkpoints`, `/checkpoints/{id}`, `/cases/{id}/confirm|complications` — UC-04
- `/certificates` — UC-04
- `/stacks` — учёт стеков
- `/dashboard/admin`, `/dashboard/client` — дашборды
- `/audit` — аудит-журнал

## Стиль и качество кода

Код форматируется автоматически: **Spotless + Palantir Java Format** (120 символов,
wildcard-импорты запрещены).

```powershell
mvn spotless:apply     # отформатировать
mvn spotless:check     # проверить (привязано к verify)
```

## Тесты

```powershell
mvn test
```

## Docker

Образ собирается двухстадийно (`maven:3.9-eclipse-temurin-21-alpine` → `eclipse-temurin:21-jre-alpine`)
и запускается на `:3001`. Полный стек (БД + backend + порталы) — в `software/infra/compose.yaml`.
