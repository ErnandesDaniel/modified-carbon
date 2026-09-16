# SCMS Internal Portal

Внутренний портал персонала клиники (Next.js 16 + Ant Design 5).

## Запуск

```powershell
pnpm install
pnpm dev        # http://localhost:3002
pnpm build      # production build
```

Требуется запущенный backend (`../backend`, http://localhost:3001/api). Адрес backend
настраивается в `.env.local`:

```
BACKEND_URL=http://localhost:3001/api
```

## Аутентификация

Демо-режим: кнопка «Войти как сотрудник» вызывает `POST /auth/dev-login` на backend,
токен сохраняется в httpOnly-cookie, все запросы проксируются через `/api/backend/*`.

## Роли и разделы

Роль выбирается в разделе **Настройки** (`PATCH /user/me`). Меню строится по роли:

- **Sleeve Broker** — Каталог тел (UC-02), Заказы (UC-01)
- **Needlecaster** — Needlecast (UC-03)
- **Psychosurgeon** — Валидация и сертификация (UC-04)
- **Администратор** — все разделы, Пользователи и роли, Аудит

Общие разделы: Дашборд, Сертификаты.

## Экраны

| Маршрут | Назначение |
| :---- | :---- |
| `/dashboard` | Сводка клиники + рабочая очередь по роли |
| `/sleeves` | Каталог тел: фильтры, культивирование, приёмка, резерв |
| `/orders` | Заказы клиентов: подтверждение, ожидание тела, отмена |
| `/needlecast`, `/needlecast/[id]` | Procedure needlecast: старт, результат, инцидент |
| `/validation`, `/validation/[id]` | Чекпоинты, сертификация, осложнения |
| `/certificates` | Выданные сертификаты |
| `/users` | Управление ролями (RBAC) |
| `/audit` | Журнал аудита |
| `/settings` | Профиль и выбор роли |
