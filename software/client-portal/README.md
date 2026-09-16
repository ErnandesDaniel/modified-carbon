# SCMS Client Portal

Внешний портал клиента Meth (Next.js 16 + Ant Design 5 + NextAuth v5).

## Запуск

```powershell
pnpm install
pnpm dev        # http://localhost:3000
pnpm build      # production build
```

Требуется запущенный backend (`../backend`, http://localhost:3001/api).

## Настройка окружения

Создайте `.env.local` на основе `.env.example`:

```
BACKEND_URL=http://localhost:3001/api
AUTH_SECRET=z7R4vN1mX5qJ0bY8zP9kL2w7R4vN1mX5
AUTH_URL=http://localhost:3000
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
SERVICE_AUTHORIZATION_SECRET=my-test-secret-key
```

`AUTH_SECRET` должен совпадать с `jwt.secret` backend, `SERVICE_AUTHORIZATION_SECRET` —
с одноимённой переменной backend.

## Аутентификация

- **Google OAuth** (UC-05): NextAuth-провайдер Google; в колбэке `signIn` backend
  регистрирует/находит пользователя через `POST /auth/login` (с секретным заголовком).
- **Демо-вход (M. Kovacs)**: `POST /auth/client-dev-login` — для проверки без Google.

Все запросы к API идут через `/api/proxy/*`, который подписывает backend-JWT и
подставляет `Authorization: Bearer`.

## Экраны

| Маршрут | Назначение |
| :---- | :---- |
| `/` | Публичная страница клиники |
| `/login` | Вход через Google или демо-вход |
| `/cabinet` | Личный кабинет: этап кейса, заказы, стеки, сертификаты |
| `/cabinet/catalog` | Каталог доступных тел с фильтрами и заказом (UC-01) |
| `/cabinet/orders` | Мои заказы и их статусы |
| `/cabinet/certificates` | Сертификаты совместимости |
