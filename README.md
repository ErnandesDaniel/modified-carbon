# Проект: Модифицированный Углерод — Клиника Sleeving

## Концепция

Элитная клиника в Бей-Сити 2384 года, специализирующаяся на переносе кортикальных стеков в новые тела (sleeves). Услуга доступна только Meths — сверхбогатым клиентам с неограниченным бюджетом.

## Роли

### 1. Meth (Клиент)
Миллиардер, заказывающий новое тело. Примеры: Лоренс Банкрофт, персонажи вроде тех, кто живёт 300+ лет, меняя тела как костюмы. Ожидает: клонированное тело с нужными параметрами, сохранение всех воспоминаний, отсутствие stack shock.

### 2. Sleeve Broker
Специалист по подбору и подготовке тел. Работает с клонированными телами из генетических архивов. Проверяет: генетическую чистоту, отсутствие болезней, совместимость с конкретным стеком клиента.

### 3. Needlecaster
Техник по работе со стеками. Извлекает кортикальный стек, выполняет needlecast (перенос сознания), следит за целостностью данных. Использует квантовое шифрование для защиты сознания в процессе.

### 4. Psychosurgeon
Врач, проверяющий психосоматическую совместимость после переноса. Диагностирует: stack shock, фрагментацию личности, несовместимость с новой физиологией. Сертифицирует готовность клиента к выходу.

---

## Структура проекта

```
├── README.md                          # Этот файл
├── diagrams/                          # Диаграммы бизнес-процессов
│   ├── 01-sleeve-selection/           # Подбор тела
│   ├── 02-stack-extraction/           # Извлечение стека
│   ├── 03-consciousness-transfer/     # Перенос сознания
│   └── 04-post-transfer-validation/   # Пост-трансферная валидация
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

### Установка Pandoc и wkhtmltopdf

```powershell
# Установка Pandoc
winget install --id JohnMacFarlane.Pandoc

# Установка wkhtmltopdf (для HTML-рендеринга)
winget install --id wkhtmltopdf.wkhtmltopdf
```

### Конвертация одного файла

```powershell
# Способ 1: Через Pandoc (рекомендуется)
pandoc markdown-docs/Vision.md -o pdf/Vision.pdf --pdf-engine=wkhtmltopdf

# Способ 2: Простой рендеринг (без стилей)
pandoc markdown-docs/Vision.md -o pdf/Vision.pdf
```

### Конвертация всех файлов

**PowerShell:**
```powershell
Get-ChildItem markdown-docs/*.md | ForEach-Object {
    $output = "pdf/$($_.BaseName).pdf"
    pandoc $_.FullName -o $output --pdf-engine=wkhtmltopdf
    Write-Host "Converted: $($_.Name) -> $output"
}
```

**Компактная команда:**
```powershell
gci markdown-docs/*.md | % { pandoc $_.FullName "pdf/$($_.BaseName).pdf" --pdf-engine=wkhtmltopdf }
```

### Конвертация шаблонов

```powershell
Get-ChildItem markdown-docs-templates/*.md | ForEach-Object {
    $output = "pdf/$($_.BaseName).pdf"
    pandoc $_.FullName -o $output --pdf-engine=wkhtmltopdf
    Write-Host "Converted: $($_.Name) -> $output"
}
```

---

## Инструментарий

### Pandoc
Универсальный конвертер документов. Поддерживает Markdown → PDF, HTML, DOCX и другие форматы.

```powershell
# Проверка установки
pandoc --version
```

### wkhtmltopdf
Движок для рендеринга HTML в PDF. Используется Pandoc как backend для генерации PDF.

```powershell
# Проверка установки
wkhtmltopdf --version
```

### Live Preview (Markdown)

Для просмотра Markdown в реальном времени используйте расширение **Markdown Preview** в VS Code / WebStorm:

1. Откройте `.md` файл
2. Нажмите `Ctrl+Shift+V` (Preview)
3. Редактируйте — превью обновляется автоматически

---

## Заметки

- Термины и роли описаны в контексте мира "Видоизменённый углерод" Ричарда Моргана
- Используйте глоссарий (`markdown-docs/Glossary.md`) для справок по терминологии
