#import "styles.typ": *

#doc-title("Software Development Plan", subtitle: "План разработки ПО")

#chapter("1.")[Introduction (Введение)]

#placeholder[Введение представляет собой обзор на весь документ в целом и включает в себя следующие разделы - назначение, область применения, определения и аббревиатуры, ссылки и обзор.]

#section("1.1")[Purpose (Назначение)]

#placeholder[Укажите назначение данного документа.]

#section("1.2")[Scope (Область применения)]

#placeholder[Приведите краткое описание области применения.]

#section("1.3")[Definitions, Acronyms and Abbreviations (Определения)]

#placeholder[Укажите значение терминов и аббревиатур.]

#section("1.4")[References (Ссылки)]

#placeholder[Перечислите документы, на которые ссылаетесь.]

#section("1.5")[Overview (Обзор)]

#placeholder[Приведите краткое описание остальных разделов.]

#chapter("2.")[Project Overview (Обзор проекта)]

#section("2.1")[Project Purpose, Scope, and Objectives (Цели и задачи проекта)]

#placeholder[Опишите цели проекта, для чего разрабатывается, какие задачи решает.]

#section("2.2")[Assumptions and Constraints (Допущения и ограничения)]

#placeholder[Опишите предположения: бюджет, сроки, риски и т.д.]

#section("2.3")[Project Deliverables (Результаты проекта)]

#placeholder[Перечислите артефакты, которые будут созданы.]

#section("2.4")[Evolution of the Software Development Plan (Развитие плана)]

#placeholder[Опишите как будет обновляться данный план.]

#chapter("3.")[Project Organization (Организация проекта)]

#section("3.1")[Organizational Structure (Организационная структура)]

#placeholder[Опишите структуру проекта - команда руководителей и подчиненных.]

#doctable(
  (1fr, 2fr, 2fr),
  table-header[Роль], table-header[Имя], table-header[Обязанности],
  [], [], [],
)

#section("3.2")[External Interfaces (Внешние интерфейсы)]

#placeholder[Связи с внешними организациями.]

#section("3.3")[Roles and Responsibilities (Роли и обязанности)]

#placeholder[Роли в проекте.]

#doctable(
  (1fr, 2fr, 2fr),
  table-header[Роль], table-header[Обязанности], table-header[Назначено],
  [Project Manager], [Управление проектом], [],
  [Architect], [Проектирование архитектуры], [],
  [Developer], [Разработка], [],
  [Tester], [Тестирование], [],
)

#chapter("4.")[Management Process (Процесс управления)]

#section("4.1")[Project Estimates (Оценка проекта)]

#placeholder[Оценка сроков и ресурсов.]

#subsection("4.1.1")[Estimation Results (Результаты оценки)]

#placeholder[Конкретные цифры.]

#section("4.2")[Project Plan (План проекта)]

#placeholder[Детальный план проекта.]

#subsection("4.2.1")[Phase Plan (План по фазам)]

#placeholder[Описание фаз.]

#doctable(
  (1fr, 2fr, 1fr, 1fr),
  table-header[Фаза], table-header[Активности], table-header[Начало], table-header[Окончание],
  [Inception], [Начальная фаза], [], [],
  [Elaboration], [Фаза уточнения], [], [],
  [Construction], [Фаза построения], [], [],
  [Transition], [Фаза внедрения], [], [],
)

#subsection("4.2.2")[Iteration Objectives (Цели итераций)]

#placeholder[Цели каждой итерации.]

#doctable(
  (1fr, 2fr, 1fr, 1fr),
  table-header[Итерация], table-header[Цели], table-header[Начало], table-header[Окончание],
  [], [], [], [],
)

#subsection("4.2.3")[Project Schedule (Расписание проекта)]

#placeholder[Детальное расписание.]

#section("4.3")[Iteration Plans (Планы итераций)]

#placeholder[Планы для каждой итерации.]

#subsection("4.3.1")[#placeholder[Название итерации]]

#placeholder[Детали итерации.]

#section("4.4")[Budget (Бюджет)]

#placeholder[Финансовый план.]

#chapter("5.")[Technical Process (Технический процесс)]

#section("5.1")[Tools (Инструменты)]

#placeholder[Используемые инструменты.]

#doctable(
  (1fr, 2fr, 2fr),
  table-header[Инструмент], table-header[Версия], table-header[Назначение],
  [], [], [],
)

#chapter("6.")[Work Packages (Рабочие пакеты)]

#section("6.1")[Work Package 1 (Рабочий пакет 1)]

#placeholder[Описание работы.]

#chapter("7.")[Risk Management (Управление рисками)]

#section("7.1")[Risk List (Список рисков)]

#placeholder[Перечень рисков.]

#doctable(
  (1fr, 2fr, 1fr, 1fr),
  table-header[Риск], table-header[Описание], table-header[Вероятность], table-header[Влияние],
  [], [], [], [],
)
