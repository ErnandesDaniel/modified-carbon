export type SleeveStatus = 'available' | 'cultivating' | 'reserved' | 'in_use'

export interface Sleeve {
  id: string
  name: string
  gender: 'М' | 'Ж'
  height: number       // cm
  weight: number       // kg
  age: number          // biological age
  dnaSource: string    // genetic archive
  status: SleeveStatus
  compatibleStacks: string[]
  notes: string
}

export interface Case {
  id: string
  clientId: string
  clientName: string
  sleeveId: string
  sleeveName: string
  stackId: string
  status: 'pending' | 'in_progress' | 'completed' | 'incident'
  startTime?: string
  endTime?: string
  result?: 'success' | 'failed'
  incidentType?: 'stack_shock' | 'rejection' | 'stack_damage'
  incidentNote?: string
  needlecaster: string
}

export interface Checkpoint {
  id: string
  caseId: string
  clientName: string
  label: string
  description: string
  status: 'pending' | 'passed' | 'failed'
  required: boolean
  category: 'cognitive' | 'physical' | 'stack' | 'identity'
}

export const sleeves: Sleeve[] = [
  { id: 'S-001', name: 'Athletic Male A1', gender: 'М', height: 185, weight: 82, age: 28, dnaSource: 'BioGen Alpha', status: 'available', compatibleStacks: ['STK-001', 'STK-003'], notes: 'Оптимальная физическая форма, высокая выносливость' },
  { id: 'S-002', name: 'Elegant Female B2', gender: 'Ж', height: 172, weight: 58, age: 30, dnaSource: 'BioGen Alpha', status: 'reserved', compatibleStacks: ['STK-002'], notes: 'Повышенная нейропластичность, идеальна для интеллектуальных стеков' },
  { id: 'S-003', name: 'Sturdy Male C3', gender: 'М', height: 192, weight: 95, age: 35, dnaSource: 'Nexus Genetics', status: 'available', compatibleStacks: ['STK-001', 'STK-002', 'STK-003'], notes: 'Универсальная совместимость, крепкое телосложение' },
  { id: 'S-004', name: 'Agile Female D4', gender: 'Ж', height: 165, weight: 52, age: 24, dnaSource: 'Nexus Genetics', status: 'cultivating', compatibleStacks: [], notes: 'В процессе культивирования, завершение через 14 дней' },
  { id: 'S-005', name: 'Distinguished Male E5', gender: 'М', height: 180, weight: 78, age: 45, dnaSource: 'BioGen Alpha', status: 'in_use', compatibleStacks: ['STK-005'], notes: 'Активен — Meth Банкрофт' },
  { id: 'S-006', name: 'Youthful Male F6', gender: 'М', height: 178, weight: 72, age: 22, dnaSource: 'SynthCore', status: 'available', compatibleStacks: ['STK-006', 'STK-007'], notes: 'Максимальная нейропластичность, рекомендован для молодых стеков' },
  { id: 'S-007', name: 'Resilient Female G7', gender: 'Ж', height: 170, weight: 60, age: 32, dnaSource: 'SynthCore', status: 'available', compatibleStacks: ['STK-008'], notes: 'Повышенная устойчивость к stack shock' },
  { id: 'S-008', name: 'Premium Male H8', gender: 'М', height: 188, weight: 85, age: 26, dnaSource: 'BioGen Alpha', status: 'cultivating', compatibleStacks: [], notes: 'Премиум-заказ, культивация до 20.09.2384' },
  { id: 'S-009', name: 'Graceful Female I9', gender: 'Ж', height: 175, weight: 55, age: 29, dnaSource: 'Nexus Genetics', status: 'available', compatibleStacks: ['STK-009', 'STK-010'], notes: 'Идеальная совместимость с женскими стеками' },
  { id: 'S-010', name: 'Command Male J10', gender: 'М', height: 190, weight: 90, age: 40, dnaSource: 'SynthCore', status: 'reserved', compatibleStacks: ['STK-011'], notes: 'Зарезервирован для Meth Ковачского, процедура 15.09' },
]

export const cases: Case[] = [
  {
    id: 'CASE-2384-001',
    clientId: 'MTH-001',
    clientName: 'Лоренс Банкрофт',
    sleeveId: 'S-005',
    sleeveName: 'Distinguished Male E5',
    stackId: 'STK-005',
    status: 'completed',
    startTime: '2384-09-01T10:00:00',
    endTime: '2384-09-01T11:45:00',
    result: 'success',
    needlecaster: 'Иванов К.А.',
  },
  {
    id: 'CASE-2384-002',
    clientId: 'MTH-002',
    clientName: 'Рэйчел Ковачски',
    sleeveId: 'S-010',
    sleeveName: 'Command Male J10',
    stackId: 'STK-011',
    status: 'pending',
    needlecaster: 'Петров Д.С.',
  },
  {
    id: 'CASE-2384-003',
    clientId: 'MTH-003',
    clientName: 'Такеши Кавахара',
    sleeveId: 'S-003',
    sleeveName: 'Sturdy Male C3',
    stackId: 'STK-001',
    status: 'in_progress',
    startTime: '2384-09-09T14:30:00',
    needlecaster: 'Сидоров А.М.',
  },
  {
    id: 'CASE-2384-004',
    clientId: 'MTH-004',
    clientName: 'Виктория Лэнг',
    sleeveId: 'S-002',
    sleeveName: 'Elegant Female B2',
    stackId: 'STK-002',
    status: 'incident',
    startTime: '2384-09-08T09:00:00',
    endTime: '2384-09-08T09:32:00',
    result: 'failed',
    incidentType: 'stack_shock',
    incidentNote: 'Сильный stack shock уровня 3, требуется наблюдение',
    needlecaster: 'Иванов К.А.',
  },
]

export const checkpoints: Checkpoint[] = [
  // CASE-2384-001 (completed — all passed)
  { id: 'CP-001', caseId: 'CASE-2384-001', clientName: 'Лоренс Банкрофт', label: 'Когнитивный тест #1', description: 'Базовая ориентация: имя, место, дата. Пациент должен назвать своё имя и текущее местоположение.', status: 'passed', required: true, category: 'cognitive' },
  { id: 'CP-002', caseId: 'CASE-2384-001', clientName: 'Лоренс Банкрофт', label: 'Когнитивный тест #2', description: 'Память: вспомнить события за последние 48 часов до переноса.', status: 'passed', required: true, category: 'cognitive' },
  { id: 'CP-003', caseId: 'CASE-2384-001', clientName: 'Лоренс Банкрофт', label: 'Проверка Stack Shock', description: 'Оценка по шкале Stack Shock Index (0-10). Допустимо ≤ 2 для выписки.', status: 'passed', required: true, category: 'stack' },
  { id: 'CP-004', caseId: 'CASE-2384-001', clientName: 'Лоренс Банкрофт', label: 'Физический осмотр', description: 'Проверка базовых рефлексов, подвижности конечностей, реакции зрачков.', status: 'passed', required: true, category: 'physical' },
  { id: 'CP-005', caseId: 'CASE-2384-001', clientName: 'Лоренс Банкрофт', label: 'Идентификация личности', description: 'Подтверждение личности через ответы на личные вопросы (кодовая фраза + biometric scan).', status: 'passed', required: true, category: 'identity' },
  { id: 'CP-006', caseId: 'CASE-2384-001', clientName: 'Лоренс Банкрофт', label: 'Нейронная совместимость', description: 'Сканирование нейронных связей на соответствие протоколу DHF-7.', status: 'passed', required: true, category: 'stack' },

  // CASE-2384-003 (in_progress — some done)
  { id: 'CP-010', caseId: 'CASE-2384-003', clientName: 'Такеши Кавахара', label: 'Когнитивный тест #1', description: 'Базовая ориентация: имя, место, дата.', status: 'passed', required: true, category: 'cognitive' },
  { id: 'CP-011', caseId: 'CASE-2384-003', clientName: 'Такеши Кавахара', label: 'Когнитивный тест #2', description: 'Память: вспомнить события за последние 48 часов до переноса.', status: 'pending', required: true, category: 'cognitive' },
  { id: 'CP-012', caseId: 'CASE-2384-003', clientName: 'Такеши Кавахара', label: 'Проверка Stack Shock', description: 'Оценка по шкале Stack Shock Index (0-10).', status: 'pending', required: true, category: 'stack' },
  { id: 'CP-013', caseId: 'CASE-2384-003', clientName: 'Такеши Кавахара', label: 'Физический осмотр', description: 'Проверка базовых рефлексов, подвижности конечностей.', status: 'pending', required: true, category: 'physical' },
  { id: 'CP-014', caseId: 'CASE-2384-003', clientName: 'Такеши Кавахара', label: 'Идентификация личности', description: 'Подтверждение личности через biometric scan.', status: 'pending', required: true, category: 'identity' },

  // CASE-2384-004 (incident — stack shock detected)
  { id: 'CP-020', caseId: 'CASE-2384-004', clientName: 'Виктория Лэнг', label: 'Когнитивный тест #1', description: 'Базовая ориентация: имя, место, дата.', status: 'failed', required: true, category: 'cognitive' },
  { id: 'CP-021', caseId: 'CASE-2384-004', clientName: 'Виктория Лэнг', label: 'Проверка Stack Shock', description: 'Оценка по шкале Stack Shock Index (0-10). Обнаружен уровень 3.', status: 'failed', required: true, category: 'stack' },
  { id: 'CP-022', caseId: 'CASE-2384-004', clientName: 'Виктория Лэнг', label: 'Физический осмотр', description: 'Проверка базовых рефлексов. Обнаружена тремор рук.', status: 'failed', required: true, category: 'physical' },
]

export const stackShockScale = [
  { level: 0, label: 'Нет шока', description: 'Полная адаптация, все когнитивные функции в норме', color: '#52c41a' },
  { level: 1, label: 'Лёгкий', description: 'Лёгкая дезориентация до 5 минут, самостоятельная регрессия', color: '#73d13d' },
  { level: 2, label: 'Умеренный', description: 'Дезориентация 5-30 минут, лёгкая головная боль, requires monitoring', color: '#faad14' },
  { level: 3, label: 'Тяжёлый', description: 'Потеря памяти 1-24 часа, агрессия,Requires extended observation', color: '#ff7a45' },
  { level: 4, label: 'Критический', description: 'Длительная амнезия, фрагментация личности,Requires immediate intervention', color: '#ff4d4f' },
  { level: 5, label: 'Необратимый', description: 'Полная деградация личности, потеря сознания', color: '#a61d24' },
]
