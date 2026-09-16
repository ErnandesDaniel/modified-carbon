-- init-test-db.sql - инициализация pgvector для тестов
--
-- Этот скрипт выполняется Testcontainers при старте тестового PostgreSQL.
-- Создание пользователя и БД происходит через Liquibase миграцию в приложении.
--
-- Задача этого скрипта: установивить расширение pgvector

-- Установка расширения pgvector (обязательно для тестов!)
CREATE EXTENSION IF NOT EXISTS vector;