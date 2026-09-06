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

## Инструментарий

### md-to-pdf

```powershell
# Проверка установки
md-to-pdf --version
```
---
