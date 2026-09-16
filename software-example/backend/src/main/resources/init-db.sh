#!/bin/bash
set -e

# Проверяем что переменные заданы
if [ -z "$APP_DB_PASSWORD" ]; then
    echo "ERROR: APP_DB_PASSWORD is not set"
    exit 1
fi

if [ -z "$APP_DB_USERNAME" ]; then
    echo "ERROR: APP_DB_USERNAME is not set"
    exit 1
fi

# Устанавливаем расширение pgvector
echo "Installing pgvector extension..."
psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOF
    CREATE EXTENSION IF NOT EXISTS vector;
EOF

# Создаем пользователя (игнорируем ошибку если уже существует)
psql -v ON_ERROR_STOP=0 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOF
    CREATE USER "$APP_DB_USERNAME" WITH PASSWORD '$APP_DB_PASSWORD';
EOF

# Выдаем права
psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOF
    -- Даем права на подключение и использование схемы
    GRANT CONNECT ON DATABASE "$POSTGRES_DB" TO "$APP_DB_USERNAME";
    GRANT USAGE ON SCHEMA public TO "$APP_DB_USERNAME";

    -- Даем права на данные (SELECT, INSERT, UPDATE, DELETE)
    GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO "$APP_DB_USERNAME";
    GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO "$APP_DB_USERNAME";

    -- Настраиваем автоматическую выдачу прав на таблицы, которые создаст Liquibase
    ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO "$APP_DB_USERNAME";
    ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT USAGE, SELECT ON SEQUENCES TO "$APP_DB_USERNAME";
EOF
