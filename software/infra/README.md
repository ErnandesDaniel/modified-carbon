# Инфраструктура

Всё, что относится к запуску окружения: единый `compose.yaml` и переменные окружения.
Папка самодостаточна — Compose берёт за корень проекта каталог этого файла, поэтому
относительные пути указаны от `infra/`.

## Структура

```
/infra
├── compose.yaml              # единый compose: инфраструктура + (профиль full) backend/порталы
├── .env / .env.example       # переменные окружения (единый источник)
```

## Требования

| Инструмент | Версия |
| :---- | :---- |
| Docker Desktop | актуальный |
| Java JDK | 21 |
| Maven | 3.9+ |
| Bun | 1.3+ |

## Подготовка

Создайте `infra/.env` на основе `infra/.env.example` и заполните переменные (в первую
очередь Google OAuth; для локальной демонстрации достаточно демо-входа).

## Запуск (из каталога `software/`)

### 1. Локальная разработка (backend `mvn`, порталы `bun`)

```powershell
# только инфраструктура (Postgres + pgAdmin)
docker compose -f infra/compose.yaml up -d

# backend (читает backend/.env)
cd backend; Copy-Item .env.example .env; mvn spring-boot:run

# порталы
cd ../client-portal;   bun install; bun run dev      # http://localhost:3000
cd ../internal-portal; bun install; bun run dev      # http://localhost:3002
```

Swagger: http://localhost:3001/api/swagger-ui/index.html

### 2. Весь стек в контейнерах

```powershell
docker compose -f infra/compose.yaml --profile full up -d --build
```

Поднимаются: `postgres`, `pgadmin`, `backend`, `client-portal` (nginx, :3000),
`internal-portal` (nginx, :3002). Портальные nginx проксируют `/api` в `backend:3001`.

### Остановка

```powershell
docker compose -f infra/compose.yaml down                # инфраструктура
docker compose -f infra/compose.yaml --profile full down # весь стек
docker compose -f infra/compose.yaml --profile full down -v   # + удалить volume'ы (сброс БД)
```

## Переменные окружения

Один файл `infra/.env` (и `backend/.env` для локального запуска backend). Значения
`DB_HOST=localhost` рассчитаны на запуск с хоста; внутри compose backend переопределяет
хост на `postgres` в блоке `environment`.

| Переменная | Назначение |
| :---- | :---- |
| `DB_NAME`, `DB_PORT` | имя и порт БД |
| `ADMIN_DB_USERNAME` / `ADMIN_DB_PASSWORD` | администратор БД (контейнер + Liquibase) |
| `APP_DB_USERNAME` / `APP_DB_PASSWORD` | пользователь приложения (`app_user`, только DML) |
| `PGADMIN_DEFAULT_EMAIL` / `PGADMIN_DEFAULT_PASSWORD` / `PG_ADMIN_PORT` | pgAdmin |
| `AUTH_SECRET` | HMAC-секрет для JWT |
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` / `GOOGLE_REDIRECT_URI` | Google OAuth |
| `FRONTEND_BASE_URL` | куда редиректить после входа |
| `COOKIE_SECURE` | cookie только по HTTPS (prod — `true`) |
| `FORWARD_HEADERS_STRATEGY` | `framework` за реверс-прокси |

## Сборка образов

| Сервис | Контекст сборки | Ignore-файл |
| :---- | :---- | :---- |
| backend | `backend/` | `backend/.dockerignore` |
| client-portal | `client-portal/` | `client-portal/.dockerignore` |
| internal-portal | `internal-portal/` | `internal-portal/.dockerignore` |

Backend собирается Maven'ом (`mvn package -DskipTests`), порталы — Bun'ом (`bun run build`)
и раздаются nginx.

## Заметки для прода

- **Секреты** — не в `.env`, а в секрет-хранилище / k8s Secret. `.env` — только локально.
- **Cookie** — за HTTPS ставить `COOKIE_SECURE=true`, `FORWARD_HEADERS_STRATEGY=framework`.
- **Google redirect URI** — для прода указать реальный домен в `GOOGLE_REDIRECT_URI`
  и добавить его в Google Console.
- **БД** — в проде можно использовать внешний managed Postgres; приложение не меняется
  (роли разделены: `APP_DB_USERNAME` для рантайма, `ADMIN_DB_USERNAME` для миграций).
