## Установка зависимостей

```powershell
# Установка менеджера пакетов
npm install -g pnpm

# Установка зависимостей проекта
pnpm install

# Запуск сервера разработки с замоканным API
npm run dev:mock

# Запуск сервера разработки
npm run dev

# Генерация хуков для работы с API
npm run orval

# Сгенерировать файл service worker для работы замоканного API
npx msw init public
```

## Доступ к приложению

### Локальная разработка

- **Frontend:** http://localhost:3000

### Kubernetes кластер

Для доступа к сервисам в кластере Kubernetes:

1. **Получить IP адрес bastion:**
   ```powershell
   cd lab-3/terraform  # или lab-4/terraform
   terraform output ansible_main_external_ip
   ```

2. **Использовать полученный IP:**
   - **Frontend:** http://<BASTION_IP>:30000
   - **Backend API:** http://<BASTION_IP>:30001
   - **Swagger UI:** http://<BASTION_IP>:30001/api/swagger-ui/index.html

> **Примечание:** Сервисы Yandex Cloud доступны только с российских IP-адресов.

## Настройка окружения

Создайте файл `.env` на основе `.env.example`:
