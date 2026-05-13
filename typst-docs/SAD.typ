#import "../styles.typ": *

#doc-title("Software Architecture Document", subtitle: "Документ архитектуры ПО")

#chapter("1.")[Introduction (Введение)]

#placeholder[Данный документ описывает архитектуру системы.]

#section("1.1")[Purpose (Назначение)]

#placeholder[Опишите какие представления архитектуры описаны в документе.]

#section("1.2")[Scope (Область применения)]

#placeholder[Приведите краткое описание области применения.]

#section("1.3")[Definitions, Acronyms and Abbreviations (Определения)]

#placeholder[Укажите значение терминов и аббревиатур.]

#section("1.4")[References (Ссылки)]

#placeholder[Перечислите документы, на которые ссылаетесь.]

#section("1.5")[Overview (Обзор)]

#placeholder[Приведите краткое описание остальных разделов.]

#chapter("2.")[Architectural Representation (Представление архитектуры)]

#placeholder[Данный раздел описывает в общем архитектуру системы.]

#doctable(
  align: (center, center, center, center, center, center),
  (table-header[Diagram/View], table-header[Use Case], table-header[Logical], table-header[Implementation], table-header[Process], table-header[Deployment]),
  ([Use Case Diagram], [+], [-], [-], [-], [-]),
  ([Class Diagram], [+], [+], [+], [-], [-]),
  ([Activity Diagram], [+], [+], [-], [-], [-]),
  ([Sequence Diagram], [-], [+], [-], [+], [-]),
  ([State Machine], [-], [+], [-], [-], [-]),
  ([Package Diagram], [-], [-], [+], [-], [-]),
  ([Deployment Diagram], [-], [-], [-], [-], [+]),
)

#chapter("3.")[Architectural Goals and Constraints (Цели и ограничения)]

#placeholder[Перечислите архитектурно-значимые факторы.]

#chapter("4.")[Use-Case View (Прецеденты)]

#section("4.1")[Use-Case Realizations (Реализации прецедентов)]

#placeholder[Описание ключевых прецедентов.]

#chapter("5.")[Logical View (Логическое представление)]

#section("5.1")[Overview (Обзор)]

#placeholder[Общее описание логической архитектуры.]

#section("5.2")[Architecturally Significant Design Packages (Значимые пакеты)]

#placeholder[Описание основных пакетов/модулей системы.]

#chapter("6.")[Process View (Процессное представление)]

#placeholder[Описание процессов и потоков выполнения.]

#chapter("7.")[Deployment View (Развертывание)]

#placeholder[Описание физического размещения компонентов.]

#chapter("8.")[Implementation View (Реализация)]

#placeholder[Описание структуры кода.]

#chapter("9.")[Size and Performance (Размер и производительность)]

#placeholder[Основные характеристики производительности и их границы.]

#chapter("10.")[Quality (Качество)]

#placeholder[Каким образом архитектура удовлетворяет показателям качества - масштабируемости, надежности, безопасности.]
