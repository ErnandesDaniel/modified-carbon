import type {
  AppRole,
  CaseStatus,
  CertificateStatus,
  CheckpointCategory,
  CheckpointStatus,
  IncidentType,
  OrderStatus,
  SleeveGender,
  SleeveStatus,
  StackStatus
} from './types';

type Meta = { label: string; color: string };

export const roleMeta: Record<AppRole, Meta> = {
  METH: { label: 'Meth (клиент)', color: 'default' },
  SLEEVE_BROKER: { label: 'Sleeve Broker', color: 'purple' },
  NEEDLECASTER: { label: 'Needlecaster', color: 'blue' },
  PSYCHOSURGEON: { label: 'Psychosurgeon', color: 'geekblue' },
  ADMIN: { label: 'Администратор', color: 'gold' }
};

export const staffRoles: AppRole[] = ['SLEEVE_BROKER', 'NEEDLECASTER', 'PSYCHOSURGEON', 'ADMIN'];

export const genderMeta: Record<SleeveGender, Meta> = {
  MALE: { label: 'М', color: 'blue' },
  FEMALE: { label: 'Ж', color: 'magenta' }
};

export const sleeveStatusMeta: Record<SleeveStatus, Meta> = {
  CULTIVATING: { label: 'В культивации', color: 'processing' },
  INTAKE: { label: 'В приёмке', color: 'warning' },
  AVAILABLE: { label: 'Доступно', color: 'success' },
  RESERVED: { label: 'Зарезервировано', color: 'purple' },
  IN_USE: { label: 'Используется', color: 'error' },
  WRITTEN_OFF: { label: 'Списано', color: 'default' }
};

export const orderStatusMeta: Record<OrderStatus, Meta> = {
  NEW: { label: 'Новый', color: 'blue' },
  AWAITING_BODY: { label: 'Ожидает тело', color: 'warning' },
  CONFIRMED: { label: 'Подтверждён', color: 'success' },
  CANCELLED: { label: 'Отменён', color: 'default' }
};

export const caseStatusMeta: Record<CaseStatus, Meta> = {
  PENDING: { label: 'Ожидает', color: 'default' },
  IN_PROGRESS: { label: 'Перенос в процессе', color: 'processing' },
  COMPLETED: { label: 'Завершён', color: 'success' },
  INCIDENT: { label: 'Инцидент', color: 'error' },
  CORRECTIVE: { label: 'Корректирующие процедуры', color: 'warning' }
};

export const stackStatusMeta: Record<StackStatus, Meta> = {
  STORED: { label: 'На хранении', color: 'default' },
  IN_USE: { label: 'Используется', color: 'processing' },
  AVAILABLE: { label: 'Доступен', color: 'success' }
};

export const incidentTypeMeta: Record<IncidentType, Meta> = {
  STACK_SHOCK: { label: 'Stack Shock', color: 'red' },
  REJECTION: { label: 'Отторжение тела', color: 'volcano' },
  STACK_DAMAGE: { label: 'Повреждение стека', color: 'magenta' },
  IDENTITY_FRAGMENTATION: { label: 'Фрагментация личности', color: 'orange' }
};

export const checkpointCategoryMeta: Record<CheckpointCategory, Meta> = {
  COGNITIVE: { label: 'Когнитивный', color: 'blue' },
  PHYSICAL: { label: 'Физический', color: 'green' },
  STACK: { label: 'Стек', color: 'purple' },
  IDENTITY: { label: 'Идентификация', color: 'orange' }
};

export const checkpointStatusMeta: Record<CheckpointStatus, Meta> = {
  PENDING: { label: 'Ожидает', color: 'default' },
  PASSED: { label: 'Пройден', color: 'success' },
  FAILED: { label: 'Не пройден', color: 'error' }
};

export const certificateStatusMeta: Record<CertificateStatus, Meta> = {
  PENDING: { label: 'Готовится', color: 'default' },
  READY: { label: 'Готов', color: 'success' }
};

export const stageLabels: Record<string, string> = {
  NO_ORDER: 'Заказ не оформлен',
  ORDER_CREATED: 'Заказ создан',
  CULTIVATION: 'Культивирование тела',
  RESERVED: 'Тело зарезервировано',
  SCHEDULED: 'Процедура назначена',
  NEEDLECAST: 'Перенос сознания',
  COMPLETED: 'Завершено',
  INCIDENT: 'Инцидент',
  CORRECTIVE: 'Корректирующие процедуры'
};
