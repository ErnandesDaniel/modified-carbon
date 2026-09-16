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
└── pdf/                               # Готовые PDF файлы
```

---

## Генерация PDF из Markdown

Используется npm-пакет `md-to-pdf` (установлен глобально).

### Конвертация одного файла

```powershell
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
gci markdown-docs/*.md | % { md-to-pdf $_.FullName; Move-Item $_.FullName.Replace('.md', '.pdf') pdf/ }
```

### Конвертация шаблонов

```powershell
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

### Структура файлов

Макеты лежат в `use-case-diagrams/` рядом с UC-диаграммами: `.html` — исходник,
`-mockup.png` — скриншот для документа.

```
use-case-diagrams/
├── uc01-OrderSleeve.puml              # UC-01: диаграмма прецедента
├── uc01-OrderSleeve.png
├── uc01-OrderSleeve.html              # Исходник макета интерфейса
├── uc01-OrderSleeve-mockup.png        # Скриншот макета для документа
├── uc02-ManageSleeveReserve.puml
├── uc02-ManageSleeveReserve.png
├── uc02-ManageSleeveReserve.html
├── uc02-ManageSleeveReserve-mockup.png
├── uc03-ConductNeedlecast.puml
├── uc03-ConductNeedlecast.png
├── uc03-ConductNeedlecast.html
├── uc03-ConductNeedlecast-mockup.png
├── uc04-ExamineAndCertify.puml
├── uc04-ExamineAndCertify.png
├── uc04-ExamineAndCertify.html
├── uc04-ExamineAndCertify-mockup.png
├── uc05-RegisterMeth.puml
├── uc05-RegisterMeth.png
├── uc05-RegisterMeth.html
└── uc05-RegisterMeth-mockup.png
```

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

### Как получить PNG из HTML

Открыть `.html` в браузере и сделать скриншот блока макета (элемент `.app`).
Или через headless-браузер, например Playwright:

```js
await page.setViewportSize({ width: 1300, height: 900 });
await page.goto('use-case-diagrams/uc01-OrderSleeve.html');
await page.locator('.app').screenshot({ path: 'use-case-diagrams/uc01-OrderSleeve-mockup.png' });
```

Макет (`.app`) центрируется по горизонтали, а скриншот снимается с самого блока —
поэтому на изображении нет смещения контента.

---

## Инструментарий

### md-to-pdf

```powershell
# Проверка установки
md-to-pdf --version
```

### PlantUML

```powershell
# Проверка установки
plantuml -version
```
---
