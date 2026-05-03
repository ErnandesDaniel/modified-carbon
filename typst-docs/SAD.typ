#import "styles.typ": *

#doc-title("Software Architecture Document", subtitle: "Документ архитектуры ПО")

= Introduction (Введение)

#placeholder[Данный документ описывает архитектуру системы.]

== Purpose (Назначение)

#placeholder[Опишите какие представления архитектуры описаны в документе.]

== Scope (Область применения)

#placeholder[Приведите краткое описание области применения.]

== Definitions, Acronyms and Abbreviations (Определения)

#placeholder[Укажите значение терминов и аббревиатур.]

== References (Ссылки)

#placeholder[Перечислите документы, на которые ссылаетесь.]

== Overview (Обзор)

#placeholder[Приведите краткое описание остальных разделов.]

= Architectural Representation (Представление архитектуры)

#placeholder[Данный раздел описывает в общем архитектуру системы.]

#doctable(
  (2fr, 1fr, 1fr, 1fr, 1fr, 1fr),
  align: (center, center, center, center, center, center),
  table-header[Diagram/View], table-header[Use Case], table-header[Logical], table-header[Implementation], table-header[Process], table-header[Deployment],
  [Use Case Diagram], [+], [-], [-], [-], [-],
  [Class Diagram], [+], [+], [+], [-], [-],
  [Activity Diagram], [+], [+], [-], [-], [-],
  [Sequence Diagram], [-], [+], [-], [+], [-],
  [State Machine], [-], [+], [-], [-], [-],
  [Package Diagram], [-], [-], [+], [-], [-],
  [Deployment Diagram], [-], [-], [-], [-], [+],
)

= Architectural Goals and Constraints (Цели и ограничения)

#placeholder[Перечислите архитектурно-значимые факторы.]

= Use-Case View (Прецеденты)

== Use-Case Realizations (Реализации прецедентов)

#placeholder[Описание ключевых прецедентов.]

= Logical View (Логическое представление)

== Overview (Обзор)

#placeholder[Общее описание логической архитектуры.]

== Architecturally Significant Design Packages (Значимые пакеты)

#placeholder[Описание основных пакетов/модулей системы.]

= Process View (Процессное представление)

#placeholder[Описание процессов и потоков выполнения.]

= Deployment View (Развертывание)

#placeholder[Описание физического размещения компонентов.]

= Implementation View (Реализация)

#placeholder[Описание структуры кода.]

= Size and Performance (Размер и производительность)

#placeholder[Основные характеристики производительности и их границы.]

= Quality (Качество)

#placeholder[Каким образом архитектура удовлетворяет показателям качества - масштабируемости, надежности, безопасности.]
