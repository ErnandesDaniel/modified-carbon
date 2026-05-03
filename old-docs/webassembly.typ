// src/webassembly.typ

#import "templates.typ": *

#show: conf

#title-slide(
  title: [WebAssembly: Тяжелые вычисления и новая жизнь нативных языков в вебе],
  author: [Эрнандес Гарсия Даниэль Дельевич],
  job: [Веб-разработчик]
)

#pagebreak()

#content-slide(title: "Исторический контекст: Почему появился WebAssembly")[
  Веб развивался от простых документов к сложным приложениям, но JavaScript оставался единственным языком выполнения в браузере.

  *Эволюция производительности в вебе:*
  - *1995:* JavaScript создан за 10 дней — простой скриптовый язык для валидации форм
  - *2008:* V8 Engine (Google) — JIT-компиляция, производительность выросла в 10-100x
  - *2013:* asm.js (Mozilla) — подмножество JS, компилируемое в нативный код

  *Проблемы, которые привели к Wasm:*
  - asm.js был хаком — парсинг JS-текста медленный, размер файлов огромный
  - Отсутствие типов в JS мешало оптимизации
  - Нужен был *нативный* формат, а не обходной путь через JS

  *2015:* Четыре крупнейших браузера (Chrome, Firefox, Safari, Edge) начинают совместную работу над новым стандартом.
]

#pagebreak()

#content-slide(title: "Рождение WebAssembly (2015-2017)")[
  WebAssembly родился как открытый стандарт, разрабатываемый консорциумом W3C.

  *Ключевые этапы:*
  - *Июнь 2015:* Анонсирован как совместный проект Google, Mozilla, Microsoft, Apple
  - *Март 2016:* MVP (Minimum Viable Product) — запускаем в Chrome и Firefox
  - *Март 2017:* WebAssembly 1.0 — официальный релиз, поддержка всех мажорных браузеров
  - *Декабрь 2019:* WebAssembly становится официальной рекомендацией W3C

  *Цели разработчиков:*
  - Безопасность: выполнение в песочнице браузера
  - Портативность: один байткод на всех платформах
  - Эффективность: близкая к нативной скорость выполнения
  - Компактность: бинарный формат вместо текстового
]

#pagebreak()

#content-slide(title: "Что такое WebAssembly?")[
  WebAssembly — это бинарный формат инструкций для стековой виртуальной машины, выполняемый в браузере с производительностью, близкой к нативной.

  *Ключевые особенности:*
  - *Бинарный формат:* Компактный, быстро парсится (~20x быстрее, чем JS)
  - *Статическая типизация:* Типы известны на этапе компиляции, нет runtime-проверок
  - *Линейная память:* Плоское адресное пространство, управляемое модулем
  - *Стековая машина:* Инструкции работают со стеком значений

  *Wasm — это НЕ:*
  - Не замена JavaScript, а его компаньон
  - Не язык программирования, а целевая платформа
  - Не новая ОС, а portable runtime

  *Модульная структура:*
  Каждый Wasm-модуль содержит секции: типы, импорты, функции, память, глобальные переменные, экспорты, код, данные.
]

#pagebreak()

#content-slide(title: "Компиляция из разных языков")[
  WebAssembly стал общей целевой платформой для множества языков программирования.

  *C / C++ — самая зрелая поддержка:*
  - *Emscripten:* Полноценный toolchain с libc, SDL, OpenGL → WebGL трансляцией
  - Крупные портированные проекты: ffmpeg, sqlite, AutoCAD, Unity
  - Прямой доступ к linear memory через указатели

  *Rust — лучший developer experience:*
  - Нативная поддержка через `wasm32-unknown-unknown` target
  - *wasm-pack:* Сборка, тестирование, публикация в npm
  - *wasm-bindgen:* Автогенерация JS-врапперов для типобезопасного взаимодействия

  *Go — два подхода:*
  - *TinyGo:* Компактные модули (~10KB), подходит для embedded
  - *Go 1.21+:* Экспериментальная поддержка WASI и браузера

  *AssemblyScript:*
  - TypeScript-подобный синтаксис, компилируется прямо в Wasm
  - Идеален для JS-разработчиков, не хотящих учить новый язык
]

#pagebreak()

#content-slide(title: "Практический пример: Rust → WebAssembly")[
  Шаг-by-шаг создание и запуск Rust-кода в браузере.

  *1. Установка инструментов:*
  ```bash
  # Установка Rust
  curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
  # Установка wasm-pack
  curl https://rustwasm.github.io/wasm-pack/installer/init.sh -sSf | sh
  ```

  *2. Создание проекта:*
  ```bash
  cargo new --lib wasm-hello
  cd wasm-hello
  ```

  *3. Настройка Cargo.toml:*
  ```toml
  [lib]
  crate-type = ["cdylib"]
  
  [dependencies]
  wasm-bindgen = "0.2"
  ```

  *4. Код в src/lib.rs:*
  ```rust
  use wasm_bindgen::prelude::*;
  
  #[wasm_bindgen]
  pub fn add(a: i32, b: i32) -> i32 {
      a + b
  }
  
  #[wasm_bindgen]
  pub fn factorial(n: u64) -> u64 {
      (1..=n).product()
  }
  ```
]

#pagebreak()

#content-slide(title: "Практический пример: сборка и запуск")[
  *5. Сборка:*
  ```bash
  wasm-pack build --target web --out-dir pkg
  ```

  *6. Создание HTML (index.html):*
  ```html
  <!DOCTYPE html>
  <html>
  <head>
    <script type="module">
      import init, { add, factorial } from './pkg/wasm_hello.js';
      
      async function run() {
        await init();
        console.log('2 + 3 =', add(2, 3));
        console.log('5! =', factorial(5));
      }
      run();
    </script>
  </head>
  <body>
    <h1>Откройте консоль (F12)</h1>
  </body>
  </html>
  ```

  *7. Запуск:*
  ```bash
  # Локальный сервер
  npx serve .
  # Открыть http://localhost:3000
  ```

  *Результат:*
  Функции Rust работают в браузере с нативной производительностью, вызываемые как обычный JavaScript.
]

#pagebreak()

#content-slide(title: "Запуск Python в WebAssembly")[
  Python не компилируется в Wasm напрямую, но может выполняться *внутри* Wasm-рантайма.

  *Pyodide — Python в браузере:*
  - Порт CPython, скомпилированный в Wasm через Emscripten
  - Включает научный стек: NumPy, SciPy, Pandas, Matplotlib
  - Размер: ~10MB (базовый интерпретатор), загружается при первом запуске
  - Интеграция с JS через FFI слой

  *MicroPython:*
  - Легковесный вариант (~200KB) для embedded и браузера
  - Поддержка Wasm32 target
  - Ограниченная стандартная библиотека

  *RustPython:*
  - Интерпретатор Python, написанный на Rust
  - Может компилироваться в Wasm через wasm-bindgen
  - Экспериментальный, но перспективный проект

  *Применение:*
  - Data science в браузере (JupyterLite)
  - Образовательные платформы
  - Прототипирование без установки Python
]

#pagebreak()

#content-slide(title: "GPU и параллельные вычисления через Wasm")[
  Хотя Wasm сам по себе однопоточный, есть способы использовать GPU и многопоточность.

  *WebGPU + WebAssembly:*
  - *WebGPU:* Современный API для доступа к GPU (преемник WebGL)
  - Wasm-модули могут вызывать WebGPU для вычислений на GPU (GPGPU)
  - Языки: Rust (wgpu), C++ (Dawn)

  *SIMD в WebAssembly:*
  - *128-bit SIMD инструкции:* Параллельная обработка данных
  - Поддержка в Chrome 91+, Firefox 89+
  - Ускорение до 4x для векторных операций

  *Threads (многопоточность):*
  - SharedArrayBuffer + Web Workers
  - Wasm-модуль запускается в Worker, общается через shared memory
  - Пример: ffmpeg.wasm использует потоки для кодирования видео

  *Компиляция CUDA/OpenCL:*
  - Проекты вроде gpu.js и WebGPU Compute Shaders
  - Перенос научных вычислений из CUDA в браузер
]

#pagebreak()

#content-slide(title: "WASI — WebAssembly System Interface")[
  WASI — стандартизированный интерфейс для взаимодействия Wasm-модулей с операционной системой вне браузера.

  *Зачем нужен WASI:*
  - Wasm изначально был "браузерным", но нужен был путь "наружу"
  - Песочница безопасности: модуль получает только явно разрешённые возможности
  - Портативность: один модуль работает на Linux, macOS, Windows

  *Что предоставляет WASI:*
  - Файловая система (sandboxed, capability-based)
  - Сетевые сокеты
  - Стандартные потоки (stdin, stdout, stderr)
  - Часы и таймеры
  - Рандомизация (криптографически безопасный random)

  *Версии WASI:*
  - *WASI Preview 1 (2020):* Базовый набор syscall, стабильный
  - *WASI Preview 2 (2023):* На основе Component Model, modular design
  - *WASI Preview 3 (2024+):* Async/await, threads, сокеты

  *Рантаймы с WASI:* Wasmtime, Wasmer, WAMR (Wasm Micro Runtime)
]

#pagebreak()

#content-slide(title: "Рантаймы WebAssembly")[
  Вне браузера Wasm выполняется в специальных рантаймах — легковесных виртуальных машинах.

  *Wasmtime (Bytecode Alliance):*
  - Написан на Rust, основной reference implementation
  - Поддержка WASI Preview 1 и 2
  - Компиляция ahead-of-time (AOT) и just-in-time (Cranelift)
  - Встраивание в другие приложения как библиотека

  *Wasmer:*
  - Поддержка множества бэкендов: LLVM, Cranelift, Singlepass
  - Headless-режим: компиляция в нативный код без зависимостей
  - Облачная платформа Wasmer Edge

  *WAMR (Wasm Micro Runtime):*
  - Размер ~100KB, предназначен для embedded и IoT
  - Поддержка интерпретации, AOT, JIT
  - Работает на микроконтроллерах с менее 100KB RAM

  *WasmEdge (CNCF):*
  - Фокус на облачных сценариях и edge computing
  - Поддержка plug-in системы, Tensorflow, networking
  - Интеграция с containerd (запуск Wasm в Kubernetes)
]

#pagebreak()

#content-slide(title: "Сборщики мусора в WebAssembly")[
  WebAssembly изначально не имеет GC — память linear, ручное управление. Но для высокоуровневых языков нужен сборщик.

  *Подходы к GC в Wasm:*
  - *GC внутри модуля:* Язык (Go, C Sharp) компилирует свой GC в Wasm-код
    - Увеличивает размер модуля
    - Снижает производительность
    - Работает уже сегодня

  - *Внешний GC:* Рантайм (JS engine) управляет памятью
    - Экспериментальный подход
    - Сложности с циклическими ссылками между JS и Wasm

  *WebAssembly GC Proposal (2023+):*
  - Нативная поддержка GC в спецификации Wasm
  - Типизированные ссылки, структуры, массивы
  - Языки могут компилироваться без включения GC runtime
  - Поддержка: Chrome 119+, Firefox 120+, Safari 17+

  *Выгоды:*
  - Меньший размер модулей для managed языков
  - Лучшая интеграция с JS объектами
  - Производительность, близкая к нативной
]

#pagebreak()

#content-slide(title: "WebAssembly Component Model")[
  Component Model — современный стандарт, позволяющий модулям на разных языках взаимодействовать как одна библиотека.

  *Ключевая идея:*
  - Модули — это строительные блоки (components)
  - Язык WIT (WebAssembly Interface Types) описывает контракты
  - Компоненты компонуются в приложения независимо от языка реализации

  *Язык WIT (WebAssembly Interface Types):*
  - Описывает интерфейсы, типы, функции
  - Поддерживает сложные типы: records, variants, enums, lists, options, results
  - Пример: `record point { x: float64, y: float64 }`

  *wit-bindgen:*
  - Генератор привязок (bindings) для множества языков
  - Поддерживает: Rust, Go, C/C++, Python, Java, C Sharp
  - Генерирует типобезопасные врапперы для вызовов между компонентами

  *Wasmtime:*
  - Рантайм, исполняющий компоненты
  - Поддержка динамической линковки компонентов
  - Composition host — связывает компоненты во время выполнения
]

#pagebreak()

#content-slide(title: "Spin — Serverless WebAssembly")[
  *Spin от Fermyon* — самый популярный фреймворк для создания бессерверных (serverless) приложений на WebAssembly.

  *Концепция:*
  - Функции как обработчики HTTP-запросов, Redis-событий, таймеров
  - Каждая функция — отдельный Wasm-модуль
  - Мгновенный cold start (менее 1мс против 100-500мс у container-based serverless)

  *Архитектура:*
  - *Trigger:* Источник событий (HTTP, Redis, scheduled)
  - *Component:* Wasm-модуль, обрабатывающий событие
  - *Runtime:* Wasmtime под капотом
  - *SDK:* Поддержка Rust, Go, Python, JavaScript (via QuickJS)

  *Возможности:*
  - Key-value хранилище (встроенное)
  - SQL базы данных (SQLite, PostgreSQL)
  - outbound HTTP (вызовы внешних API)
  - Pub/Sub через Redis

  *Размещение:*
  - Fermyon Cloud (managed)
  - Self-hosted (Kubernetes через SpinKube)
  - Локальная разработка через `spin up`
]

#pagebreak()

#content-slide(title: "Другие инструменты и платформы")[
  *Компиляторы и оптимизаторы:*
  - *Binaryen:* Компиляторная инфраструктура для Wasm (wasm-opt, wasm2js)
  - *wasm-pack:* Сборка Rust→Wasm и публикация в npm
  - *cargo-wasi:* Сборка Rust с WASI target

  *Отладка:*
  - DWARF-информация для source-level debugging
  - Chrome DevTools, Firefox DevTools поддерживают breakpoints в исходном коде
  - wasm-debug-utils для анализа

  *Облачные платформы:*
  - *Fastly Compute Edge:* Wasmtime-based edge computing
  - *Cloudflare Workers:* Поддержка Wasm-модулей
  - *Vercel Edge Functions:* Wasm в serverless functions

  *Базы данных:*
  - *libSQL (Turso):* SQLite fork с Wasm-расширениями
  - *DuckDB-Wasm:* Аналитическая БД в браузере
  - *SQLite-Wasm:* Классический SQLite, скомпилированный в Wasm

  *Фреймворки:*
  - *Extism:* Универсальный плагин систем на базе Wasm
  - *Suborbital (Reactr):* Serverless Wasm фреймворк
]

#pagebreak()

#content-slide(title: "Сравнение производительности")[
  *Типичный benchmark: подсчет простых чисел до 10 000 000*

  - *JavaScript (V8):* ~420 мс
  - *WebAssembly (Rust/C++):* ~42-45 мс
  - *Ускорение:* 10x

  *Другие сценарии:*
  - *Криптография (SHA-256):* Wasm быстрее в 5-15x
  - *Обработка изображений:* Wasm быстрее в 3-10x
  - *Аудио DSP:* Wasm позволяет real-time обработку, где JS лагает

  *Размер файлов:*
  - *JS-библиотека (lodash):* ~24 KB
  - *Wasm-модуль (аналог):* ~8 KB (сжатый)

  *Cold start:*
  - *Node.js функция:* ~50-200 мс
  - *Spin Wasm функция:* ~1-5 мс
  - *V8 JS isolate:* ~5-10 мс
  - *Wasm isolate:* ~0.5-2 мс

  *Память:*
  - Wasm-модули более предсказуемы по потреблению памяти
  - Нет JS heap fragmentation
  - Linear memory даёт контроль над размером
]

#pagebreak()

#content-slide(title: "Ограничения и компромиссы")[
  Wasm — мощная технология, но не универсальное решение.

  *Технические ограничения:*
  - *DOM access:* Нет прямого доступа — только через JS мост
  - *Web APIs:* fetch, WebSocket, File API требуют JS-прослойку
  - *Потоки:* Многопоточность через Workers, не shared-memory threads
  - *Размер стека:* Ограничен (~1-5 MB по умолчанию)
  - *Дебаг:* Сложнее, чем нативный код или JS

  *Разработческие ограничения:*
  - Toolchain сложнее настройки, чем чистый JS
  - Сборка требует дополнительных шагов
  - FFI (взаимодействие с JS) имеет накладные расходы

  *Когда НЕ использовать Wasm:*
  - UI-логика и манипуляции с DOM
  - Простой ввод/вывод
  - Логика, часто меняющаяся (бизнес-правила)
  - Функции с временем выполнения < 1 мс (накладные расходы на FFI)

  *Золотое правило:*
  Если JS справляется за 16 мс (60fps) — не используйте Wasm.
]

#pagebreak()

#content-slide(title: "Когда использовать WebAssembly?")[
  *Идеальные сценарии:*
  - *Криптография:* SHA-256, AES, RSA, key derivation
  - *Обработка медиа:* ffmpeg, OpenCV, аудио DSP
  - *Базы данных в браузере:* SQLite, DuckDB, IndexedDB-ускорители
  - *Физика и 3D:* Игровые движки, CAD, симуляции
  - *Data science:* NumPy, Pandas в браузере через Pyodide
  - *Портирование legacy кода:* C/C++ библиотеки в веб
  - *Edge computing:* Serverless функции с нулевым cold start

  *Истории успеха:*
  - *Figma:* Рендеринг в Wasm в 3x быстрее, чем в JS
  - *AutoCAD:* Полноценный CAD в браузере
  - *Adobe Photoshop:* Web-версия на базе Wasm
  - *Unity WebGL:* Игровой движок через Wasm
  - *1Password:* Криптография в Wasm для безопасности

  *Новые возможности:*
  - Микросервисы с Wasm модулями (замена containers)
  - Плагин системы для безопасного выполнения стороннего кода
  - "Bring your own code" в SaaS продуктах
]

#pagebreak()

#content-slide(title: "Будущее WebAssembly")[
  *Ближайшие стандарты (2024-2025):*
  - *Exception Handling:* Нативная поддержка исключений в Wasm
  - *Tail Call:* Оптимизация для функциональных языков
  - *Branch Hinting:* Подсказки процессору для branch prediction
  - *Memory64:* 64-битная адресация памяти

  *Долгосрочные направления:*
  - *WebAssembly System Interface (WASI) полной зрелости:*
    Полная совместимость с POSIX, сетевые сокеты, процессы
  - *Component Model:* Стандартизированная композиция модулей
  - *Garbage Collection:* Нативная поддержка для managed языков
  - *Threads:* Shared-everything threading в спецификации

  *Расширение за пределы браузера:*
  - *WASM в облаке:* Замена containers в serverless
  - *WASM в IoT:* Микроконтроллеры с WAMR
  - *WASM в blockchain:* Smart contracts (Ethereum, Polkadot)
  - *WASM в desktop:* Плагины для приложений (Photoshop, VS Code)

  *Консорциум W3C продолжает развитие:*
  Рабочие группы по безопасности, инструментам, стандартизации.
]

#pagebreak()

#content-slide(title: "Заключение")[
  WebAssembly — это фундаментальная трансформация возможностей веба и вычислений.

  *Историческая перспектива:*
  От asm.js-хака (2013) к полноценной W3C рекомендации (2019) и экосистеме с WASI, Component Model, облачными платформами (2024).

  *Ключевые выводы:*
  - Wasm — *не замена* JS, а *дополнение* для compute-intensive задач
  - Rust + wasm-bindgen — лучший developer experience сегодня
  - WASI открывает Wasm за пределы браузера (edge, cloud, IoT)
  - Component Model делает Wasm универсальным форматом компонентов
  - Инструменты (Wasmtime, Spin, wit-bindgen) создают зрелую экосистему

  *Что пробовать:*
  - Ускорение вычислений в веб-приложениях
  - Serverless функции на Spin/Fermyon
  - Pyodide для data science в браузере
  - Портирование C/C++ библиотек через Emscripten

  WebAssembly уже здесь — и это будущее портативных, безопасных, высокопроизводительных вычислений.
]
