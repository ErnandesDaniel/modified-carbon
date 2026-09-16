# Notes Backend

Backend-приложение на Spring Boot для управления заметками (Java 21 + Maven).

## Быстрый старт

```powershell
# 1. Запустить инфраструктуру бэкенда
docker compose up
```

```powershell
# 2. Запустить приложение в dev режиме
mvn spring-boot:run
```

```powershell
# Запуск тестов
mvn test
```

## Доступ к приложению

### Локальная разработка

- **Swagger UI:** http://localhost:3001/api/swagger-ui/index.html
- **pgAdmin:** http://localhost:8081

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
   - **Grafana:** http://<BASTION_IP>:30030 (admin/admin123)
   - **Prometheus:** http://<BASTION_IP>:30090

> **Примечание:** Сервисы Yandex Cloud доступны только с российских IP-адресов.

## Настройка окружения

Создайте файл `.env` на основе `.env.example`:

```powershell
Copy-Item .env.example .env
```

# Горячая перезагрузка (IntelliJ IDEA)
Ctrl + F9

```powershell
# Компиляция
mvn compile
```

```powershell
# Сборка production JAR
mvn clean package
```

```powershell
# Запуск production сборки
java -jar target/back-0.0.1.jar
```