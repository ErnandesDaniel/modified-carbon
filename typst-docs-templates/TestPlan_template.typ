#import "styles.typ": *

#doc-title("Test Plan", subtitle: "План тестирования")

#chapter("1.")[Introduction (Введение)]

#placeholder[Введение представляет собой обзор на весь документ в целом и включает в себя следующие разделы - назначение, область применения, определения и аббревиатуры, ссылки и обзор.]

#section("1.1")[Purpose (Назначение)]

#placeholder[Укажите назначение данного документа.]

#section("1.2")[Scope (Область применения)]

#placeholder[Приведите краткое описание области применения.]

#section("1.3")[Intended Audience (Целевая аудитория)]

#placeholder[Укажите, кто будет читать данный документ и в каких целях.]

#section("1.4")[Document Terminology and Acronyms (Терминология)]

#placeholder[Укажите значение терминов и аббревиатур.]

#section("1.5")[References (Ссылки)]

#placeholder[Перечислите документы, на которые ссылаетесь.]

#section("1.6")[Document Structure (Структура документа)]

#placeholder[Приведите краткое описание структуры документа.]

#chapter("2.")[Evaluation Mission and Test Motivation (Цели и мотивация тестирования)]

#section("2.1")[Background (Контекст)]

#placeholder[В каком контексте создается продукт, какие задачи он решает, кто будет пользоваться.]

#section("2.2")[Evaluation Mission (Цели оценки)]

#placeholder[В чем состоит цель тестирования данного продукта.]

#section("2.3")[Test Motivators (Мотиваторы тестирования)]

#placeholder[Опишите, какие факторы заставляют уделить особое внимание тестированию.]

#chapter("3.")[Target Test Items (Объекты тестирования)]

#placeholder[Перечислите объекты тестирования, т.е. что именно будет тестироваться.]

#chapter("4.")[Outline of Planned Tests (План тестирования)]

#section("4.1")[Outline of Test Inclusions (Включенные тесты)]

#placeholder[Опишите, какие тесты будут проводиться.]

#section("4.2")[Outline of Other Candidates for Potential Inclusion (Возможные дополнительные тесты)]

#placeholder[Опишите тесты, которые могут быть проведены при наличии ресурсов.]

#section("4.3")[Outline of Test Exclusions (Исключенные тесты)]

#placeholder[Опишите, что тестироваться не будет и почему.]

#chapter("5.")[Test Approach (Подход к тестированию)]

#section("5.1")[Testing Types and Techniques (Типы и техники тестирования)]

#placeholder[Опишите типы тестирования: функциональное, нагрузочное, usability и т.д.]

#section("5.2")[Test Completeness (Полнота тестирования)]

#placeholder[Критерии завершения тестирования.]

#chapter("6.")[Entry and Exit Criteria (Критерии начала и завершения)]

#section("6.1")[Test Plan (План тестирования)]

#placeholder[Критерии для начала и завершения этапа планирования.]

#section("6.2")[Test Design (Проектирование тестов)]

#placeholder[Критерии для начала и завершения этапа проектирования тестов.]

#section("6.3")[Test Implementation (Реализация тестов)]

#placeholder[Критерии для начала и завершения этапа реализации тестов.]

#section("6.4")[Test Execution (Выполнение тестов)]

#placeholder[Критерии для начала и завершения этапа выполнения тестов.]

#chapter("7.")[Deliverables (Результаты)]

#section("7.1")[Test Evaluation Summaries (Сводки оценки тестирования)]

#placeholder[Какие отчеты будут созданы.]

#section("7.2")[Reporting on Test Coverage (Отчет о покрытии тестами)]

#placeholder[Как будет отслеживаться покрытие.]

#section("7.3")[Perceived Quality Reports (Отчеты о воспринимаемом качестве)]

#placeholder[Метрики качества.]

#section("7.4")[Incident Reports and RCRs (Отчеты об инцидентах)]

#placeholder[Как фиксироваться будут найденные дефекты.]

#chapter("8.")[Testing Workflow (Рабочий процесс тестирования)]

#placeholder[Опишите последовательность шагов тестирования.]

#chapter("9.")[Environmental Needs (Требования к окружению)]

#section("9.1")[Base System Hardware (Базовое аппаратное обеспечение)]

#placeholder[Требования к оборудованию.]

#doctable(
  (2fr, 1fr, 1fr, 2fr),
  table-header[Ресурс], table-header[Количество], table-header[Тип], table-header[Примечания],
  [], [], [], [],
)

#section("9.2")[Base Software Elements (Базовое программное обеспечение)]

#placeholder[Требования к ПО.]

#doctable(
  (2fr, 1fr, 1fr, 2fr),
  table-header[ПО], table-header[Количество], table-header[Тип], table-header[Примечания],
  [], [], [], [],
)

#section("9.3")[Productivity and Support Tools (Инструменты)]

#placeholder[Инструменты для тестирования.]

#section("9.4")[Test Environment Configurations (Конфигурации тестового окружения)]

#placeholder[Различные конфигурации для тестирования.]

#chapter("10.")[Responsibilities, Staffing, and Training Needs (Обязанности и обучение)]

#section("10.1")[People and Roles (Люди и роли)]

#placeholder[Кто будет выполнять тестирование.]

#doctable(
  (1fr, 2fr, 2fr),
  table-header[Роль], table-header[Ответственный], table-header[Обязанности],
  [], [], [],
)

#section("10.2")[Staffing and Training Needs (Потребности в персонале и обучении)]

#placeholder[Какое обучение требуется персоналу.]

#chapter("11.")[Iteration Milestones (Вехи итераций)]

#section("11.1")[Milestone 1: #placeholder[Название вехи]]

#placeholder[Описание вехи и критерии завершения.]

#chapter("12.")[Risks, Dependencies, Assumptions, and Constraints (Риски и ограничения)]

#section("12.1")[Risks (Риски)]

#placeholder[Опишите риски, связанные с тестированием.]

#section("12.2")[Dependencies (Зависимости)]

#placeholder[От чего зависит тестирование.]

#section("12.3")[Assumptions (Предположения)]

#placeholder[Какие предположения сделаны.]

#section("12.4")[Constraints (Ограничения)]

#placeholder[Какие ограничения существуют.]

#chapter("13.")[Management Process and Procedures (Процессы управления)]

#section("13.1")[Measuring and Assessing the Extent of Testing (Измерение объема тестирования)]

#placeholder[Как измерять прогресс тестирования.]

#section("13.2")[Assessing the Results of Testing (Оценка результатов)]

#placeholder[Как оценивать результаты.]

#section("13.3")[Problem Reporting and Corrective Action (Отчетность о проблемах)]

#placeholder[Процесс работы с дефектами.]

#section("13.4")[Managing Test Assets (Управление тестовыми активами)]

#placeholder[Как управляются тестовые артефакты.]
