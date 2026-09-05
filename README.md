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
├── diagrams/                          # Диаграммы бизнес-процессов
│   ├── 01-sleeve-selection/
│   ├── 02-stack-extraction/
│   ├── 03-consciousness-transfer/
│   └── 04-post-transfer-validation/
├── markdown-docs/                     # Документы проекта (Markdown)
│   ├── Vision.md
│   ├── SRS.md
│   ├── TestPlan.md
│   ├── SDP.md
│   ├── SAD.md
│   ├── RiskList.md
│   ├── Glossary.md
│   ├── BusinessCase.md
│   └── Usecase.md
├── markdown-docs-templates/           # Шаблоны документов (Markdown)
│   ├── styles_template.md
│   ├── Vision_template.md
│   ├── SRS_template.md
│   ├── TestPlan_template.md
│   ├── SDP_template.md
│   ├── SAD_template.md
│   ├── RiskList_template.md
│   ├── Glossary_template.md
│   ├── BusinessCase_template.md
│   └── Usecase_template.md
├── use-case-diagrams/                 # Диаграммы вариантов использования
└── pdf/                               # Готовые PDF файлы
```

---

## Генерация PDF из Markdown

Используется npm-пакет `md-to-pdf` (установлен глобально).

### Конвертация одного файла

```powershell
md-to-pdf markdown-docs/Vision.md
```

PDF будет создан в той же папке рядом с `.md` файлом.

### Конвертация всех файлов

**PowerShell:**
```powershell
Get-ChildItem markdown-docs/*.md | ForEach-Object {
    md-to-pdf $_.FullName
    Write-Host "Converted: $($_.Name)"
}
```

**Компактная команда:**
```powershell
gci markdown-docs/*.md | % { md-to-pdf $_.FullName }
```

### Конвертация шаблонов

```powershell
gci markdown-docs-templates/*.md | % { md-to-pdf $_.FullName }
```

---

## Инструментарий

### md-to-pdf

```powershell
# Проверка установки
md-to-pdf --version
```

### Live Preview (Markdown)

Для просмотра Markdown в реальном времени — расширение **Markdown Preview** в редакторе:

1. Откройте `.md` файл
2. Нажмите `Ctrl+Shift+V` (Preview)
3. Редактируйте — превью обновляется автоматически

---

*Термины и роли описаны в контексте мира "Видоизменённый углерод" Ричарда Моргана*
