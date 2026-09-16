export interface UseCase {
  id: number
  code: string
  title: string
  titleEn: string
  summary: string
  actors: { name: string; type: 'main' | 'secondary' }[]
  preconditions: string
  mainFlow: string
  postconditions: string
  extensionPoints: { name: string; description: string }[]
  frIds: string[]
  diagramImage: string
}

export const useCases: UseCase[] = [
  {
    id: 1,
    code: 'UC-01',
    title: 'Заказ sleeve клиентом',
    titleEn: 'OrderSleeve',
    summary: 'Meth (клиент) просматривает каталог доступных тел, выбирает подходящее, оформляет заказ и скачивает сертификат совместимости после завершения процедуры.',
    actors: [
      { name: 'Meth (Клиент)', type: 'main' },
      { name: 'Sleeve Broker', type: 'secondary' },
    ],
    preconditions: 'Meth зарегистрирован в системе. Meth прошёл аутентификацию.',
    mainFlow: 'Прецедент начинается, когда Meth открывает личный кабинет. Система отображает каталог доступных тел с параметрами (рост, вес, пол, возраст). Meth применяет фильтры для поиска подходящего тела. Система фильтрует каталог и отображает результаты. Meth выбирает тело и нажимает «Заказать». Система резервирует тело и создаёт кейс. Meth отслеживает статус заказа в личном кабинете. После завершения процедуры система генерирует PDF-сертификат. Meth скачивает сертификат.',
    postconditions: 'Тело зарезервировано. Сертификат сохранён на устройстве Meth.',
    extensionPoints: [
      { name: 'NoAvailableSleeves', description: 'Свободных тел нет в каталоге — Meth оформляет предзаказ культивированного тела.' },
      { name: 'CertificateNotReady', description: 'Сертификат ещё не сгенерирован — кнопка скачивания неактивна.' },
    ],
    frIds: ['FR-013-01', 'FR-013-02'],
    diagramImage: '/use-case-diagrams/uc01-OrderSleeve.png',
  },
  {
    id: 2,
    code: 'UC-02',
    title: 'Управление жизненным циклом sleeve',
    titleEn: 'ManageSleeveLifecycle',
    summary: 'Sleeve Broker управляет жизненным циклом тела: заказ культивирования в генетическом архиве, приёмка поступившего тела, резервирование за клиентом.',
    actors: [
      { name: 'Sleeve Broker', type: 'main' },
      { name: 'Meth', type: 'secondary' },
    ],
    preconditions: 'Sleeve Broker авторизован в системе.',
    mainFlow: 'Прецедент начинается, когда Sleeve Broker открывает каталог sleeves. Система отображает список тел со статусами. Broker нажимает «Заказать культивирование». Система открывает форму заказа: выбор генетического архива, параметры тела. Broker заполняет параметры и подтверждает заказ. Система отправляет запрос в API генетического архива. Система создаёт запись со статусом «В культивации». По поступлении тела Broker открывает раздел «Приёмка». Broker проверяет параметры и нажимает «Принять» или «Отклонить». Если «Принять»: система переводит тело в статус «Доступно». Broker нажимает «Зарезервировать» для привязки тела к Meth. Система блокирует тело за клиентом.',
    postconditions: 'Тело заказано, принято и зарезервировано. Статус обновлён.',
    extensionPoints: [
      { name: 'CultivationFailed', description: 'Ошибка культивирования от генетического архива — заказ отменяется.' },
      { name: 'DuplicateCheck', description: 'Попытка добавить дубликат тела — система отображает ошибку.' },
    ],
    frIds: ['FR-001-01', 'FR-001-02', 'FR-001-03', 'FR-002-01', 'FR-002-02', 'FR-003-01'],
    diagramImage: '/use-case-diagrams/uc02-ManageSleeveReserve.png',
  },
  {
    id: 3,
    code: 'UC-03',
    title: 'Проведение процедуры needlecast',
    titleEn: 'ConductNeedlecast',
    summary: 'Needlecaster проводит процедуру переноса сознания: открывает кейс клиента, фиксирует начало переноса, отмечает результат. Система сохраняет протокол и уведомляет Psychosurgeon.',
    actors: [
      { name: 'Needlecaster', type: 'main' },
      { name: 'Psychosurgeon', type: 'secondary' },
      { name: 'Meth', type: 'secondary' },
    ],
    preconditions: 'Needlecaster авторизован в системе. Клиент Meth имеет зарезервированное тело. Стек клиента доступен.',
    mainFlow: 'Прецедент начинается, когда Needlecaster открывает список назначенных процедур. Система отображает список кейсов на сегодня. Needlecaster выбирает кейс. Система открывает страницу процедуры: клиент, стек, тело. Needlecaster нажимает «Начать перенос». Система фиксирует время начала и меняет статус на «Перенос в процессе». Needlecaster выполняет процедуру. По завершении Needlecaster нажимает «Отметить результат» и выбирает «Успешно». Система фиксирует время завершения и сохраняет протокол. Система уведомляет Psychosurgeon.',
    postconditions: 'Протокол сохранён. Psychosurgeon уведомлён. Статус кейса: «Перенос завершён».',
    extensionPoints: [
      { name: 'ProcedureFailed', description: 'Перенос не удался — фиксируется инцидент (stack shock / отторжение / повреждение стека).' },
    ],
    frIds: ['FR-007-01', 'FR-008-01', 'FR-008-02'],
    diagramImage: '/use-case-diagrams/uc03-ConductNeedlecast.png',
  },
  {
    id: 4,
    code: 'UC-04',
    title: 'Валидация и сертификация',
    titleEn: 'ValidateAndCertify',
    summary: 'Psychosurgeon осматривает клиента после переноса, подтверждает успех или фиксирует осложнение. При успехе система генерирует PDF-сертификат.',
    actors: [
      { name: 'Psychosurgeon', type: 'main' },
      { name: 'Meth', type: 'secondary' },
    ],
    preconditions: 'Psychosurgeon авторизован в системе. Процедура needlecast завершена.',
    mainFlow: 'Прецедент начинается, когда Psychosurgeon открывает список кейсов на валидации. Система отображает список кейсов, ожидающих валидации. Psychosurgeon выбирает кейс. Система открывает страницу: данные клиента, протокол переноса. Psychosurgeon проводит осмотр (контрольные вопросы, тесты). Psychosurgeon нажимает «Подтвердить». Система генерирует PDF-сертификат с QR-кодом. Система делает сертификат доступным Meth. Система меняет статус кейса на «Завершено».',
    postconditions: 'Сертификат сгенерирован и доступен Meth. Кейс в статусе «Завершено».',
    extensionPoints: [
      { name: 'Complications', description: 'Обнаружены осложнения после переноса — фиксируется диагноз, выпуск блокируется.' },
    ],
    frIds: ['FR-009-01', 'FR-010-01', 'FR-010-02', 'FR-011-01', 'FR-011-02'],
    diagramImage: '/use-case-diagrams/uc04-ExamineAndCertify.png',
  },
  {
    id: 5,
    code: 'UC-05',
    title: 'Регистрация Meth через Google OAuth',
    titleEn: 'RegisterMeth',
    summary: 'Новый клиент (Meth) регистрируется на внешнем портале через Google OAuth: система перенаправляет на страницу Google, клиент подтверждает доступ, система создаёт учётную запись.',
    actors: [
      { name: 'Meth (Новый клиент)', type: 'main' },
      { name: 'Sleeve Broker', type: 'secondary' },
    ],
    preconditions: 'Meth не зарегистрирован в системе. Meth имеет Google-аккаунт.',
    mainFlow: 'Прецедент начинается, когда Meth открывает публичную страницу клиники. Meth нажимает «Войти через Google». Система перенаправляет на страницу авторизации Google. Meth выбирает Google-аккаунт и подтверждает доступ. Google перенаправляет обратно в систему с токеном авторизации. Система получает данные из Google (имя, email, аватар). Система создаёт учётную запись Meth. Система создаёт личный кабинет. Meth получает доступ к личному кабинету с каталогом тел.',
    postconditions: 'Учётная запись создана через Google OAuth. Meth имеет доступ к личному кабинету.',
    extensionPoints: [
      { name: 'GoogleAuthDenied', description: 'Meth отклонил доступ в Google — регистрация прерывается.' },
      { name: 'AccountExists', description: 'Google-аккаунт уже привязан — Meth перенаправляется на вход.' },
    ],
    frIds: ['FR-014-01', 'FR-014-02'],
    diagramImage: '/use-case-diagrams/uc05-RegisterMeth.png',
  },
]

export const glossary = [
  { term: 'SCMS', abbr: 'SCMS', definition: 'Sleeving Clinic Management System — разрабатываемая система.', docs: 'Все документы проекта' },
  { term: 'Stack / Кортикальный стек', abbr: 'Stack', definition: 'Устройство хранения сознания, имплантируемое в затылок.', docs: 'Vision, SRS, Glossary' },
  { term: 'Sleeve', abbr: 'Sleeve', definition: 'Клонированное или подобранное тело для переноса сознания.', docs: 'Vision, SRS, Glossary' },
  { term: 'Meth', abbr: 'Meth', definition: 'Сверхбогатый клиент клиники, владелец множества стеков.', docs: 'Vision, SRS, Glossary' },
  { term: 'Needlecast', abbr: 'Needlecast', definition: 'Процесс передачи сознания из стека в нейроны нового тела.', docs: 'Vision, SRS, Glossary' },
  { term: 'DHF', abbr: 'DHF', definition: 'Digital Human Freight — цифровые данные сознания.', docs: 'Vision, SRS, Glossary' },
  { term: 'Stack Shock', abbr: 'Stack Shock', definition: 'Психосоматический шок после переноса сознания.', docs: 'Vision, SRS, Glossary' },
  { term: 'FR', abbr: 'FR', definition: 'Functional Requirement — функциональное требование.', docs: 'SRS, SAD, TestPlan' },
  { term: 'RBAC', abbr: 'RBAC', definition: 'Role-Based Access Control — ролевая модель доступа.', docs: 'SRS, SAD' },
  { term: '2FA', abbr: '2FA', definition: 'Two-Factor Authentication — двухфакторная аутентификация.', docs: 'SRS, Glossary' },
  { term: 'MTTR', abbr: 'MTTR', definition: 'Mean Time To Recovery — среднее время восстановления системы.', docs: 'SRS, SDP, TestPlan' },
  { term: 'Audit Log', abbr: 'Audit Log', definition: 'Неизменяемый журнал всех операций в системе.', docs: 'SRS, SAD, Glossary' },
  { term: 'NDA', abbr: 'NDA', definition: 'Non-Disclosure Agreement — соглашение о неразглашении.', docs: 'Glossary' },
  { term: 'ROI', abbr: 'ROI', definition: 'Return on Investment — окупаемость инвестиций.', docs: 'BusinessCase' },
  { term: 'KPI', abbr: 'KPI', definition: 'Key Performance Indicator — ключевой показатель эффективности.', docs: 'BusinessCase' },
  { term: 'Sleeve Broker', abbr: '', definition: 'Специалист по подбору и подготовке тел. Проверяет генетическую чистоту, отсутствие болезней, совместимость с конкретным стеком клиента.', docs: 'SRS, Glossary' },
  { term: 'Needlecaster', abbr: '', definition: 'Техник по работе со стеками. Извлекает кортикальный стек, выполняет needlecast, следит за целостностью данных.', docs: 'SRS, Glossary' },
  { term: 'Psychosurgeon', abbr: '', definition: 'Врач, проверяющий психосоматическую совместимость после переноса. Диагностирует stack shock, фрагментацию личности. Сертифицирует готовность клиента.', docs: 'SRS, Glossary' },
]

export const projectRoles = [
  { role: 'Project Manager / System Analyst', who: 'Developer 1', responsibilities: 'Управление проектом, коммуникация с заказчиком, сбор требований, Vision, SRS, контроль сроков' },
  { role: 'Software Architect / Developer', who: 'Developer 2', responsibilities: 'Проектирование архитектуры, разработка backend и frontend, SAD, выбор технологий' },
  { role: 'QA Engineer (Tester)', who: 'Developer 1 (совмещено)', responsibilities: 'Тестирование, TestPlan, написание авто-тестов, баг-трекинг' },
  { role: 'DevOps Engineer', who: 'Developer 2 (совмещено)', responsibilities: 'Развёртывание, CI/CD, администрирование сервера' },
]
