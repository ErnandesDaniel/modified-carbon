# SCMS Backend

Backend приложения Sleeving Clinic Management System (Java 21 + Spring Boot 3.4).

Обслуживает **внешний портал Meth** и **внутренний портал персонала**. Единая PostgreSQL БД,
миграции через Liquibase, JWT (HS256) для доступа к API.

## Быстрый старт

```powershell
# 1. Поднять PostgreSQL и pgAdmin
docker compose up -d

# 2. Создать .env
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
| Google OAuth (service login) | `POST /auth/login` | client-portal (через NextAuth) |
| Dev-вход | `POST /auth/dev-login` | internal-portal (дефолтный сотрудник) |

Оба способа выдают доступ по JWT. Для `POST /auth/login` требуется заголовок
`Service-Authorization: <SERVICE_AUTHORIZATION_SECRET>`.

## Эндпоинты

Полный список — в Swagger. Основные группы:

- `/auth` — вход
- `/user` — профиль и роли (RBAC)
- `/sleeves`, `/sleeves/cultivation`, `/sleeves/{id}/intake/*`, `/sleeves/{id}/reserve` — UC-01/UC-02
- `/orders` — UC-01
- `/cases`, `/cases/{id}/start|complete|incident` — UC-03
- `/cases/{id}/checkpoints`, `/checkpoints/{id}`, `/cases/{id}/confirm|complications` — UC-04
- `/certificates` — UC-04
- `/stacks` — учёт стеков
- `/dashboard/admin`, `/dashboard/client` — дашборды
- `/audit` — аудит-журнал

## Тесты

```powershell
mvn test
```
