-- liquibase formatted sql
-- changeset scms:2 splitStatements:false

-- Пользователи
INSERT INTO users (id, display_name, email, role) VALUES
    (1, 'Demo Staff', 'staff@scms.local', 'SLEEVE_BROKER'),
    (2, 'Лоренс Банкрофт', 'meth1@scms.local', 'METH'),
    (3, 'Рэйчел Ковачски', 'meth2@scms.local', 'METH'),
    (4, 'Такеши Кавахара', 'meth3@scms.local', 'METH'),
    (5, 'M. Kovacs', 'm.kovacs@gmail.com', 'METH');

-- Идентификации
INSERT INTO user_identities (id, user_id, user_name, provider_name, provider_user_id) VALUES
    (1, 1, 'Demo Staff', 'LOCAL', 'demo-staff'),
    (2, 2, 'Лоренс Банкрофт', 'GOOGLE', 'google-meth-1'),
    (3, 3, 'Рэйчел Ковачски', 'GOOGLE', 'google-meth-2'),
    (4, 4, 'Такеши Кавахара', 'GOOGLE', 'google-meth-3'),
    (5, 5, 'M. Kovacs', 'GOOGLE', 'google-meth-kovacs');

-- Генетические архивы
INSERT INTO genetic_archives (id, code, name) VALUES
    (1, 'BIOGEN', 'Архив BioGen Alpha'),
    (2, 'NEXUS', 'Архив «Нью-Голливуд»'),
    (3, 'SYNTH', 'Архив «Протекторат»');

-- Каталог тел (sleeves)
INSERT INTO sleeves (id, code, gender, height, weight, age, genetic_archive_id, status, dna_donor, notes, cultivation_started_at, planned_ready_at, cultivation_stage_percent, reserved_for_user_id) VALUES
    (1, 'SLV-042', 'FEMALE', 172, 58, 26, 2, 'AVAILABLE', 'Donor B-17', 'Повышенная нейропластичность, идеальна для интеллектуальных стеков', NULL, NULL, 0, NULL),
    (2, 'SLV-117', 'MALE', 185, 80, 31, 1, 'AVAILABLE', 'Donor A-04', 'Оптимальная физическая форма, высокая выносливость', NULL, NULL, 0, NULL),
    (3, 'SLV-203', 'FEMALE', 168, 55, 24, 2, 'RESERVED', 'Donor C-11', 'Зарезервировано за клиентом M. Kovacs', NULL, NULL, 0, 5),
    (4, 'SLV-045', 'FEMALE', 176, 70, 28, 1, 'CULTIVATING', 'Donor D-22', 'Культивирование по заказу ORD-1002', '2384-09-02 09:00:00', '2384-09-30', 45, NULL),
    (5, 'SLV-046', 'MALE', 182, 78, 30, 2, 'INTAKE', 'Donor E-33', 'Ожидает приёмки Sleeve Broker', NULL, NULL, 0, NULL),
    (6, 'SLV-047', 'FEMALE', 169, 56, 25, 3, 'AVAILABLE', 'Donor F-44', 'Повышенная устойчивость к stack shock', NULL, NULL, 0, NULL),
    (7, 'SLV-051', 'MALE', 180, 78, 34, 1, 'AVAILABLE', 'Donor G-55', 'Универсальная совместимость', NULL, NULL, 0, NULL),
    (8, 'SLV-088', 'FEMALE', 165, 52, 22, 3, 'AVAILABLE', 'Donor H-66', 'Максимальная нейропластичность', NULL, NULL, 0, NULL),
    (9, 'SLV-090', 'MALE', 190, 90, 40, 3, 'IN_USE', 'Donor I-77', 'Активен — кейс CS-104', NULL, NULL, 0, NULL),
    (10, 'SLV-095', 'FEMALE', 170, 60, 32, 2, 'AVAILABLE', 'Donor J-88', 'Идеальная совместимость с женскими стеками', NULL, NULL, 0, NULL);

-- Кортикальные стеки
INSERT INTO stacks (id, code, owner_user_id, status, location, last_extracted_at) VALUES
    (1, 'STK-77', 5, 'IN_USE', 'Операционная №1', '2384-09-01 10:00:00'),
    (2, 'STK-101', 2, 'IN_USE', 'Операционная №1', '2384-09-01 10:00:00'),
    (3, 'STK-102', 3, 'STORED', 'Хранилище A-12', NULL),
    (4, 'STK-103', 4, 'STORED', 'Хранилище A-13', NULL),
    (5, 'STK-104', 3, 'AVAILABLE', 'Хранилище A-14', NULL);

-- Заказы
INSERT INTO sleeve_orders (id, code, meth_user_id, sleeve_id, gender, height, weight, age, genetic_archive_id, status) VALUES
    (1, 'ORD-1001', 5, 3, 'FEMALE', 168, 55, 24, 2, 'CONFIRMED'),
    (2, 'ORD-1002', 3, NULL, 'FEMALE', 176, 70, 28, 1, 'AWAITING_BODY'),
    (3, 'ORD-1003', 2, 2, 'MALE', 185, 80, 31, 1, 'CONFIRMED');

-- Кейсы needlecast
INSERT INTO needlecast_cases (id, code, order_id, meth_user_id, sleeve_id, stack_id, status, needlecaster_name, start_time, end_time, result, incident_type, incident_note) VALUES
    (1, 'CS-101', 1, 5, 3, 1, 'COMPLETED', 'Иванов К.А.', '2384-09-01 10:00:00', '2384-09-01 11:45:00', 'SUCCESS', NULL, NULL),
    (2, 'CS-103', NULL, 4, 4, 4, 'PENDING', 'Петров Д.С.', NULL, NULL, NULL, NULL, NULL),
    (3, 'CS-104', NULL, 2, 9, 2, 'INCIDENT', 'Иванов К.А.', '2384-09-08 09:00:00', '2384-09-08 09:32:00', 'FAILED', 'STACK_SHOCK', 'Сильный stack shock уровня 3, требуется наблюдение'),
    (4, 'CS-102', 2, 3, 6, 5, 'IN_PROGRESS', 'Сидоров А.М.', '2384-09-09 14:30:00', NULL, NULL, NULL, NULL);

-- Контрольные точки валидации
INSERT INTO checkpoints (id, case_id, label, description, category, status, required) VALUES
    (1, 1, 'Когнитивный тест #1', 'Базовая ориентация: имя, место, дата.', 'COGNITIVE', 'PASSED', TRUE),
    (2, 1, 'Когнитивный тест #2', 'Память: события за последние 48 часов до переноса.', 'COGNITIVE', 'PASSED', TRUE),
    (3, 1, 'Проверка Stack Shock', 'Оценка по шкале Stack Shock Index (0-10).', 'STACK', 'PASSED', TRUE),
    (4, 1, 'Физический осмотр', 'Рефлексы, подвижность конечностей, реакция зрачков.', 'PHYSICAL', 'PASSED', TRUE),
    (5, 1, 'Идентификация личности', 'Подтверждение личности через кодовую фразу и biometric scan.', 'IDENTITY', 'PASSED', TRUE),
    (6, 2, 'Когнитивный тест #1', 'Базовая ориентация: имя, место, дата.', 'COGNITIVE', 'PENDING', TRUE),
    (7, 2, 'Проверка Stack Shock', 'Оценка по шкале Stack Shock Index (0-10).', 'STACK', 'PENDING', TRUE),
    (8, 2, 'Физический осмотр', 'Рефлексы и подвижность конечностей.', 'PHYSICAL', 'PENDING', TRUE),
    (9, 3, 'Когнитивный тест #1', 'Базовая ориентация: имя, место, дата.', 'COGNITIVE', 'FAILED', TRUE),
    (10, 3, 'Проверка Stack Shock', 'Обнаружен уровень 3.', 'STACK', 'FAILED', TRUE),
    (11, 3, 'Физический осмотр', 'Обнаружен тремор рук.', 'PHYSICAL', 'FAILED', TRUE),
    (12, 4, 'Когнитивный тест #1', 'Базовая ориентация: имя, место, дата.', 'COGNITIVE', 'PASSED', TRUE),
    (13, 4, 'Проверка Stack Shock', 'Оценка по шкале Stack Shock Index (0-10).', 'STACK', 'PENDING', TRUE);

-- Инциденты
INSERT INTO incidents (id, case_id, type, description, resolved) VALUES
    (1, 3, 'STACK_SHOCK', 'Сильный stack shock уровня 3, требуется наблюдение', FALSE);

-- Сертификаты
INSERT INTO certificates (id, case_id, meth_user_id, code, status, verification_code) VALUES
    (1, 1, 5, 'CERT-CS-101', 'READY', 'QR-4F2A9C1B');

-- Аудит-журнал
INSERT INTO audit_logs (id, user_id, action, entity_type, entity_id, details) VALUES
    (1, 5, 'LOGIN', 'USER', 5, 'Вход через Google OAuth'),
    (2, 5, 'CREATE', 'ORDER', 1, 'Создан заказ ORD-1001 на тело SLV-203'),
    (3, 1, 'RESERVE', 'SLEEVE', 3, 'Тело SLV-203 зарезервировано за M. Kovacs'),
    (4, 1, 'NEEDLECAST_COMPLETE', 'CASE', 1, 'Процедура CS-101 завершена успешно'),
    (5, 4, 'INCIDENT', 'CASE', 3, 'Зафиксирован stack shock');

-- Синхронизация последовательностей
SELECT setval(pg_get_serial_sequence('users', 'id'), (SELECT MAX(id) FROM users));
SELECT setval(pg_get_serial_sequence('user_identities', 'id'), (SELECT MAX(id) FROM user_identities));
SELECT setval(pg_get_serial_sequence('genetic_archives', 'id'), (SELECT MAX(id) FROM genetic_archives));
SELECT setval(pg_get_serial_sequence('sleeves', 'id'), (SELECT MAX(id) FROM sleeves));
SELECT setval(pg_get_serial_sequence('stacks', 'id'), (SELECT MAX(id) FROM stacks));
SELECT setval(pg_get_serial_sequence('sleeve_orders', 'id'), (SELECT MAX(id) FROM sleeve_orders));
SELECT setval(pg_get_serial_sequence('needlecast_cases', 'id'), (SELECT MAX(id) FROM needlecast_cases));
SELECT setval(pg_get_serial_sequence('checkpoints', 'id'), (SELECT MAX(id) FROM checkpoints));
SELECT setval(pg_get_serial_sequence('incidents', 'id'), (SELECT MAX(id) FROM incidents));
SELECT setval(pg_get_serial_sequence('certificates', 'id'), (SELECT MAX(id) FROM certificates));
SELECT setval(pg_get_serial_sequence('audit_logs', 'id'), (SELECT MAX(id) FROM audit_logs));
