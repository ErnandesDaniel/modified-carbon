# Проект: Модифицированный Углерод — Клиника Sleeving

## Концепция

Элитная клиника в Бей-Сити 2384 года, специализирующаяся на переносе кортикальных стеков в новые тела (sleeves). Услуга доступна только Meths — сверхбогатым клиентам с неограниченным бюджетом.

## Роли

### 1. Meth (Клиент)
Миллиардер, заказывающий новое тело. Ожидает: клонированное тело с нужными параметрами, сохранение всех воспоминаний, отсутствие stack shock.

### 2. Sleeve Broker
Специалист по подбору и подготовке тел. Проверяет: генетическую чистоту, отсутствие болезней, совместимость с конкретным стеком клиента.

### 3. Needlecaster
Техник по работе со стеками. Извлекает кортикальный стек, выполняет needlecast (перенос сознания), следит за целостностью данных.

### 4. Psychosurgeon
Врач, проверяющий психосоматическую совместимость после переноса. Диагностирует: stack shock, фрагментацию личности. Сертифицирует готовность клиента к выходу.

---

## Структура проекта

```
├── README.md
├── markdown-docs/                     # Документы проекта (Markdown)
├── markdown-docs-templates/           # Шаблоны документов (Markdown)
├── use-case-diagrams/                 # Диаграммы вариантов использования и макеты интерфейсов (HTML + PNG)
├── diagrams/                          # Диаграмма Ганта и графики окупаемости (PNG)
├── word-docs/                         # Документы Word
├── word-docs-templates/               # Шаблоны Word
└── software/                          # Рабочее приложение (backend + два портала)
```

---

## Генерация PDF из Markdown

Используется npm-пакет `md-to-pdf` (установлен глобально).

> Папка `pdf/` не хранится в репозитории (см. `.gitignore`) — она создаётся при конвертации.

### Конвертация одного файла

```powershell
New-Item -ItemType Directory -Force pdf | Out-Null
md-to-pdf markdown-docs/Vision.md
Move-Item markdown-docs/Vision.pdf pdf/
```

### Конвертация всех файлов

**PowerShell:**
```powershell
Get-ChildItem markdown-docs/*.md | ForEach-Object {
    md-to-pdf $_.FullName
    Move-Item $_.FullName.Replace('.md', '.pdf') pdf/
    Write-Host "Converted: $($_.Name) -> pdf/"
}
```

**Компактная команда:**
```powershell
New-Item -ItemType Directory -Force pdf | Out-Null
gci markdown-docs/*.md | % { md-to-pdf $_.FullName; Move-Item $_.FullName.Replace('.md', '.pdf') pdf/ }
```

### Конвертация шаблонов

```powershell
New-Item -ItemType Directory -Force pdf | Out-Null
gci markdown-docs-templates/*.md | % { md-to-pdf $_.FullName; Move-Item $_.FullName.Replace('.md', '.pdf') pdf/ }
```

---

## Генерация диаграмм Use Case (PlantUML)

Диаграммы вариантов использования хранятся в формате PlantUML (`.puml`) в папке `use-case-diagrams/`. PNG-файлы генерируются из них.

### Генерация одной диаграммы

```powershell
plantuml use-case-diagrams\uc01-OrderSleeve.puml
```

### Генерация всех диаграмм

```powershell
plantuml use-case-diagrams/*.puml
```

### Генерация с explicit output path

```powershell
plantuml -o "../use-case-diagrams" use-case-diagrams/*.puml
```

### Проверка установки

```powershell
plantuml -version
```

### Структура папки

```
use-case-diagrams/
├── uc01-OrderSleeve.puml          # UC-01: Заказ тела клиентом
├── uc01-OrderSleeve.png
├── uc02-ManageSleeveReserve.puml  # UC-02: Пополнение резерва тел
├── uc02-ManageSleeveReserve.png
├── uc03-ConductNeedlecast.puml    # UC-03: Проведение переноса
├── uc03-ConductNeedlecast.png
├── uc04-ExamineAndCertify.puml    # UC-04: Осмотр и сертификация
├── uc04-ExamineAndCertify.png
├── uc05-RegisterMeth.puml         # UC-05: Регистрация клиента
└── uc05-RegisterMeth.png
```

---

## Макеты интерфейсов (Interface example)

Макеты пользовательских интерфейсов для каждого use case сделаны на **HTML + CSS**
(самодостаточные файлы: стили внутри `<style>`, внешних зависимостей нет). Каждый макет
показывает, в каком экране выполняется соответствующий прецедент и как элементы
интерфейса связаны с шагами потока событий.

Из каждого `.html` делается скриншот `-mockup.png`, который встраивается в
`markdown-docs/Usecase.md` как **раздел 9 «Interface example»** после каждого прецедента.

### Почему в Markdown идёт PNG, а не HTML

Markdown (и превью в WebStorm, и `md-to-pdf`) умеет отображать только **растровые
изображения**. HTML-файл внутри Markdown не рендерится как интерфейс — он остаётся
обычной ссылкой и открывается отдельно в браузере. Поэтому:

| Файл | Роль | Как используется |
| :---- | :---- | :---- |
| `ucXX-....html` | исходник макета | лежит в `use-case-diagrams/`, указан ссылкой в `Usecase.md` |
| `ucXX-...-mockup.png` | скриншот макета | вставляется картинкой в `Usecase.md` |

Итог: в `.md` видна готовая картинка сразу и в превью WebStorm, и в PDF; HTML нужен
только как исходник, из которого картинка собирается.

### Как вставить макет в Markdown

В `Usecase.md` вставляется **PNG** (относительным путём), а **HTML** указывается
рядом ссылкой как исходник макета:

```markdown
![UC-01: Макет интерфейса](../use-case-diagrams/uc01-OrderSleeve-mockup.png)

Исходник макета: [`use-case-diagrams/uc01-OrderSleeve.html`](../use-case-diagrams/uc01-OrderSleeve.html)
```

### Рабочий цикл

1. Правишь макет — `use-case-diagrams/ucXX-....html`.
2. Переснимаешь PNG из HTML (способ ниже).
3. Картинка в `Usecase.md` обновляется сама — путь не меняется.
4. `.html` и `.png` коммитятся в git вместе.

## Инструментарий

### PlantUML

```powershell
# Проверка установки
plantuml -version
```

---

## Программная реализация (software/)

Рабочее приложение SCMS, реализующее прецеденты UC-01…UC-05: backend с реальной БД и
два раздельных веб-портала. Подробности — в [`software/README.md`](software/README.md).

```
software/
├── backend/          # Spring Boot 3.4 (Java 21) + PostgreSQL + Liquibase — API (:3001)
├── client-portal/    # Next.js 16 — внешний портал Meth (:3000)
└── internal-portal/  # Next.js 16 — внутренний портал персонала (:3002)
```

| Портал | Кто | Аутентификация | Возможности |
| :---- | :---- | :---- | :---- |
| client-portal | Meth (клиент) | Google OAuth (UC-05) / демо-вход | Каталог тел, заказ (UC-01), статус кейса, сертификаты |
| internal-portal | Персонал | Dev-вход + выбор роли | Резерв/культивация (UC-02), needlecast (UC-03), валидация и сертификация (UC-04), аудит, RBAC |

Backend покрывает все прецеденты: заказы и резерв тел, культивирование и приёмку,
процедуру needlecast с инцидентами, чекпоинты и генерацию сертификатов, дашборды,
аудит-журнал. Схема БД и сиды — в Liquibase (`software/backend/src/main/resources/db/changelog`).

Пошаговый план показа соответствия прецедентам — в [`software/DEMO.md`](software/DEMO.md).

### Быстрый старт

```powershell
# 1. Backend + PostgreSQL
cd software/backend; Copy-Item .env.example .env; docker compose up -d; mvn spring-boot:run

# 2. Внутренний портал
cd software/internal-portal; pnpm install; pnpm dev      # http://localhost:3002

# 3. Внешний портал
cd software/client-portal; pnpm install; pnpm dev        # http://localhost:3000
```

Swagger: http://localhost:3001/api/swagger-ui/index.html

---
