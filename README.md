# Проект: Модифицированный Углерод — Клиника Sleeving

## Концепция

Элитная клиника в Бей-Сити 2384 года, специализирующаяся на переносе кортикальных стеков в новые тела (sleeves). Услуга доступна только Meths — сверхбогатым клиентам с неограниченным бюджетом.

## 4 Роли

### 1. Meth (Клиент)
Миллиардер, заказывающий новое тело. Примеры: Лоренс Банкрофт, персонажи вроде тех, кто живёт 300+ лет, меняя тела как костюмы. Ожидает: клонированное тело с нужными параметрами, сохранение всех воспоминаний, отсутствие stack shock.

### 2. Sleeve Broker
Специалист по подбору и подготовке тел. Работает с клонированными телами из генетических архивов. Проверяет: генетическую чистоту, отсутствие болезней, совместимость с конкретным стеком клиента.

### 3. Needlecaster
Техник по работе со стеками. Извлекает кортикальный стек, выполняет needlecast (перенос сознания), следит за целостностью данных. Использует квантовое шифрование для защиты сознания в процессе.

### 4. Psychosurgeon
Врач, проверяющий психосоматическую совместимость после переноса. Диагностирует: stack shock, фрагментацию личности, несовместимость с новой физиологией. Сертифицирует готовность клиента к выходу.

## Стейкхолдеры

### Внутренние
- **Sleeve Broker** — отвечает за качество тела, несёт ответственность при несовместимости с стеком
- **Needlecaster** — гарантирует целостность DHF (Digital Human Freight), рискует лицензией при повреждении стека
- **Psychosurgeon** — сертифицирует готовность, защищает клинику от юридических претензий Meth

### Внешние
- **Meths (Клиенты)** — платят 2-50 миллионов кредитов за процедуру, требуют абсолютной безопасности и приватности. Имеют связи с сенаторами Бей-Сити и могут закрыть клинику одним звонком.
- **Генетические архивы** — поставщики клонированных тел, работают по контрактам с клиникой, требуют предоплату 30% за культивирование
- **Сенаторы и законодатели Бей-Сити** — клиника работает в серой зоне закона (манипуляции с DHF запрещены, но Meths имеют неприкосновенность). Требуют "взносов" за игнорирование нарушений.
- **Католическая церковь** — осуждает использование стеков как грех, организует пикеты у клиники, давит через СМИ на владельцев здания
- **Охранные корпорации** — поставщики систем безопасности и квантового шифрования для хранилищ DHF, завышают цены на 300% для клиник уровня Meth
- **Конкуренты (другие клиники sleeving)** — в Бей-Сити работают 12 подобных клиник, конкурируют за клиентов Meths ценой и сроками
- **Чёрный рынок тел** — нелегальные поставщики тел преступников и бедняков, Sleeve Broker должен доказывать юридическую чистоту каждого sleeve

### Косвенные
- **Экологический корпус ООН (Envoy Corps)** — бывшие солдаты с уникальной адаптацией к любым телам, работают консультантами при сложных кейсах, берут 5000 кредитов/час
- **Семьи Meths** — жёны, дети, наследники, могут подать иск если трансформация изменит завещание или деловые качества Meth
- **СМИ Бей-Сити** — сенсации о "смерти Лоренса Банкрофта" или скандалы в клиниках = рейтинги, клиника платит за молчание

## 4 Процесса

### Процесс 1: Подбор Sleeve
Клиент выбирает параметры тела (рост, вес, пол, возраст, физические характеристики). Sleeve Broker находит подходящий клон в архивах или инициирует культивирование нового тела. Длительность: 2-6 недель если клон есть в наличии, 4-8 месяцев если требуется культивирование.

### Процесс 2: Извлечение и Подготовка Стека
Needlecaster извлекает кортикальный стек из текущего тела клиента, проверяет квантовую целостность данных, создаёт резервную копию. Подготавливает стек к needlecast — настройка частот, синхронизация с целевым телом.

### Процесс 3: Перенос Сознания
Needlecaster устанавливает стек в нейральный разъём нового тела. Выполняет последовательную активацию: моторика → сенсорика → вегетативные функции → сознание. Длительность: 4-6 часов. Риск: stack shock, фрагментация личности, отторжение.

### Процесс 4: Пост-Трансферная Валидация
Psychosurgeon проводит 72-часовое наблюдение. Проверяет: стабильность мозговой активности (ЭЭГ), сохранность личности, работу новых нейронных связей. При успехе — выдаёт сертификат совместимости. При отказе — возврат к корректировке стека или смене тела.

## Технологии

- **Кортикальные стеки** — устройства размером с монету, имплантируемые в затылок. Хранят сознание на квантовом уровне.
- **Needlecast** — передача сознания из стека в нейроны нового тела.
- **Клонированные sleeves** — тела, выращенные из сохранённого ДНК или подобранные по параметрам.
- **Stack shock** — психологический шок от смены тела, диагностируемый Psychosurgeon.

## Архитектура проекта

```
├── README.md                          # Этот файл
├── diagrams/                          # Диаграммы бизнес-процессов
│   ├── 01-sleeve-selection/           # Подбор тела
│   │   ├── description.md             # Описание процесса
│   │   └── diagram.mmd                # Mermaid диаграмма
│   ├── 02-stack-extraction/             # Извлечение стека
│   │   ├── description.md
│   │   └── diagram.mmd
│   ├── 03-consciousness-transfer/     # Перенос сознания
│   │   ├── description.md
│   │   └── diagram.mmd
│   └── 04-post-transfer-validation/     # Пост-трансферная валидация
│       ├── description.md
│       └── diagram.mmd
├── шаблоны/                           # Шаблоны документов Word (.doc)
│   ├── Vision_template.doc
│   ├── SRS_template.doc
│   ├── TestPlan_template.doc
│   ├── SDP_template.doc
│   ├── SAD_template.doc
│   ├── RiskList_template.doc
│   ├── Glossary_template.doc
│   ├── BusinessCase_template.doc
│   └── Usecase_template.doc
├── styles.typ                         # Общие стили для всех документов
├── typst-docs/                        # Исходники документов в Typst (рабочие файлы)
│   ├── Vision.typ
│   ├── SRS.typ
│   ├── TestPlan.typ
│   ├── SDP.typ
│   ├── SAD.typ
│   ├── RiskList.typ
│   ├── Glossary.typ
│   ├── BusinessCase.typ
│   └── Usecase.typ
├── typst-docs-templates/              # Шаблоны Typst (неизменные образцы)
│   ├── styles_template.typ
│   ├── Vision_template.typ
│   ├── SRS_template.typ
│   ├── TestPlan_template.typ
│   ├── SDP_template.typ
│   ├── SAD_template.typ
│   ├── RiskList_template.typ
│   ├── Glossary_template.typ
│   ├── BusinessCase_template.typ
│   └── Usecase_template.typ
├── src/                               # Исходный код (опционально)
│   ├── backend/                       # API
│   └── frontend/                      # Формы
└── docs/                              # Дополнительная документация
```

---
*Проект создан для учебных целей на основе литературного произведения "Видоизменённый углерод" Ричарда Моргана*

---

## 📄 Работа с DOC файлами

### Чтение содержимого .doc файлов

Для извлечения текста из .doc файлов используется Python с библиотекой `pywin32`:

```python
import win32com.client

word = win32com.client.Dispatch('Word.Application')
word.Visible = False

doc = word.Documents.Open('path/to/file.doc')
text = doc.Content.Text
print(text)

doc.Close(False)
word.Quit()
```

**Требования:**
- Windows с установленным Microsoft Word
- Python с библиотекой `pywin32`

### Запуск Python кода через командную строку

Можно выполнить Python скрипт без создания файла, используя `python -c`:

**PowerShell / CMD:**
```powershell
python -c "
import win32com.client

word = win32com.client.Dispatch('Word.Application')
word.Visible = False

doc = word.Documents.Open('шаблоны/Vision_template.doc')
text = doc.Content.Text
print(text[:2000])  # Первые 2000 символов

doc.Close(False)
word.Quit()
"
```

**Преимущества:**
- Не нужно создавать отдельный .py файл
- Можно выполнить прямо в терминале
- Быстрая проверка кода

### Конвертация DOC в Typst

```python
import win32com.client
import os

templates_dir = r'шаблоны'
typst_dir = r'typst-docs'

word = win32com.client.Dispatch('Word.Application')
word.Visible = False

for doc_name in os.listdir(templates_dir):
    if doc_name.endswith('.doc'):
        doc_path = os.path.join(templates_dir, doc_name)
        doc = word.Documents.Open(doc_path)
        text = doc.Content.Text
        doc.Close(False)
        
        # Сохраняем в .typ файл
        typ_name = doc_name.replace('_template.doc', '.typ')
        typ_path = os.path.join(typst_dir, typ_name)
        
        with open(typ_path, 'w', encoding='utf-8') as f:
            f.write('#set page(margin: 2cm)\n')
            f.write('#set text(size: 18pt, fill: black)\n\n')
            f.write(text)

word.Quit()
```

## 🛠 Инструментарий

### 1. Базовый компилятор (Typst CLI)
Необходим для финальной сборки PDF.
```powershell
winget install --id Typst.Typst
```
*Если путь не добавился автоматически, используйте скрипт из секции "Настройка PATH".*

### 2. Живое превью (Tinymist)
Для разработки используется `tinymist` — он обеспечивает мгновенное обновление в браузере без ручного перезапуска PDF-ридера.

**Запуск превью:**
В корне проекта уже находится бинарник `tinymist-win32-x64.exe`. Выполните:
```powershell
.\tinymist-win32-x64.exe preview src/presentation.typ --root .
```
> **Преимущества:**
> * Обновление «на лету» при вводе текста.
> * Двусторонняя связь: наведение на элемент в браузере подсвечивает код в IDE.
> * Автоматическое открытие локального сервера по адресу `http://127.0.0.1:23627`.

---

## 📂 Структура проекта

```text
├── img/               # Логотипы и изображения (Рисунок1, 2, 3)
├── src/               # Исходные файлы Typst
│   ├── presentation.typ    # Основной файл презентации
│   └── templates.typ       # Общие стили и макеты слайдов
├── pdf/               # Готовые отчеты
├── tinymist-win32-x64.exe  # Инструмент для превью
└── README.md
```

---

## 🚀 Команды терминала

### Разработка (Live Preview)
Рекомендуемый способ. Виден результат сразу в браузере:
```powershell
.\tinymist-win32-x64.exe preview src/presentation.typ --root .
```

### Финальная сборка PDF
Если нужно просто сгенерировать файл:
```powershell
typst compile src/presentation.typ pdf/presentation.pdf --root .
```

### Режим отслеживания (Стандартный)
Если не используете Tinymist:
```powershell
typst watch src/presentation.typ pdf/presentation.pdf --root .
```

### Конвертация всех Typst файлов в PDF

Для конвертации всех .typ файлов из папки `typst-docs` в PDF:

**PowerShell:**
```powershell
Get-ChildItem typst-docs/*.typ | ForEach-Object {
    $output = "pdf/$($_.BaseName).pdf"
    typst compile $_.FullName $output
    Write-Host "Converted: $($_.Name) -> $output"
}
```

**Bash/Linux/Mac:**
```bash
for file in typst-docs/*.typ; do
    filename=$(basename "$file" .typ)
    typst compile "$file" "pdf/${filename}.pdf"
    echo "Converted: $file -> pdf/${filename}.pdf"
done
```

**Компактная команда PowerShell:**
```powershell
gci typst-docs/*.typ | % { typst compile $_.FullName "pdf/$($_.BaseName).pdf" }
```

### Live Preview для каждого документа

Для просмотра и редактирования каждого документа в реальном времени через браузер:

```powershell
# Vision (Концепция)
.\tinymist-win32-x64.exe preview typst-docs/Vision.typ --root .

# SRS (Спецификация требований)
.\tinymist-win32-x64.exe preview typst-docs/SRS.typ --root .

# TestPlan (План тестирования)
.\tinymist-win32-x64.exe preview typst-docs/TestPlan.typ --root .

# SDP (План разработки)
.\tinymist-win32-x64.exe preview typst-docs/SDP.typ --root .

# SAD (Архитектура ПО)
.\tinymist-win32-x64.exe preview typst-docs/SAD.typ --root .

# RiskList (Реестр рисков)
.\tinymist-win32-x64.exe preview typst-docs/RiskList.typ --root .

# Glossary (Глоссарий)
.\tinymist-win32-x64.exe preview typst-docs/Glossary.typ --root .

# BusinessCase (Бизнес-кейс)
.\tinymist-win32-x64.exe preview typst-docs/BusinessCase.typ --root .

# Usecase (Варианты использования)
.\tinymist-win32-x64.exe preview typst-docs/Usecase.typ --root .
```

**Что делает команда:**
- Запускает локальный сервер по адресу `http://127.0.0.1:23627`
- Открывает браузер с рендером документа
- Автоматически обновляет при сохранении файла
- Позволяет работать с документом в реальном времени

**Как пользоваться:**
1. Запустите нужную команду
2. Откроется браузер с PDF-просмотром
3. Откройте .typ файл в редакторе (VS Code, WebStorm и т.д.)
4. Редактируйте текст и сохраняйте — браузер обновится автоматически

### Live Preview для шаблонов (typst-docs-templates)

Для просмотра исходных шаблонов (неизменных образцов):

```powershell
# Vision Template (Концепция)
.\tinymist-win32-x64.exe preview typst-docs-templates/Vision_template.typ --root .

# SRS Template (Спецификация требований)
.\tinymist-win32-x64.exe preview typst-docs-templates/SRS_template.typ --root .

# TestPlan Template (План тестирования)
.\tinymist-win32-x64.exe preview typst-docs-templates/TestPlan_template.typ --root .

# SDP Template (План разработки)
.\tinymist-win32-x64.exe preview typst-docs-templates/SDP_template.typ --root .

# SAD Template (Архитектура ПО)
.\tinymist-win32-x64.exe preview typst-docs-templates/SAD_template.typ --root .

# RiskList Template (Реестр рисков)
.\tinymist-win32-x64.exe preview typst-docs-templates/RiskList_template.typ --root .

# Glossary Template (Глоссарий)
.\tinymist-win32-x64.exe preview typst-docs-templates/Glossary_template.typ --root .

# BusinessCase Template (Бизнес-кейс)
.\tinymist-win32-x64.exe preview typst-docs-templates/BusinessCase_template.typ --root .

# Usecase Template (Варианты использования)
.\tinymist-win32-x64.exe preview typst-docs-templates/Usecase_template.typ --root .
```

---

## ⚙️ Настройка PATH (для Typst CLI)

Если команда `typst --version` не работает после установки через WinGet:

```powershell
# 1. Поиск пути
$typstPath = (Get-ChildItem -Path "$env:LOCALAPPDATA\Microsoft\WinGet\Packages" -Recurse -Filter "typst.exe").FullName
$typstDir = Split-Path $typstPath -Parent

# 2. Добавление в PATH пользователя
[Environment]::SetEnvironmentVariable("PATH", $env:PATH + ";$typstDir", "User")

# 3. Обновите окружение или перезапустите WebStorm/Terminal
```











