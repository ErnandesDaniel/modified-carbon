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
├── use-case-diagrams/                 # Диаграммы вариантов использования
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

Диаграммыvariants использования хранятся в формате PlantUML (`.puml`) в папке `use-case-diagrams/`. PNG-файлы генерируются из них.

### Генерация одной диаграммы

```powershell
plantuml use-case-diagrams\uc01-meth-portal.puml
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
├── uc01-meth-portal.puml          # UC-01: Заказ sleeve клиентом
├── uc01-meth-portal.png
├── uc02-sleeve-catalog.puml       # UC-02: Управление жизненным циклом sleeve
├── uc02-sleeve-catalog.png
├── uc03-needlecast-procedure.puml # UC-03: Проведение needlecast
├── uc03-needlecast-procedure.png
├── uc04-validation.puml           # UC-04: Валидация и сертификация
├── uc04-validation.png
├── uc05-register-meth.puml        # UC-05: Регистрация Meth
└── uc05-register-meth.png
```

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
