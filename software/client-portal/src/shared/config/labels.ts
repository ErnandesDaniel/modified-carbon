import type {
  CaseStatus,
  CertificateStatus,
  IncidentType,
  OrderStatus,
  SleeveGender,
  SleeveStatus,
  StackStatus,
} from "@/shared/api/dto";

export type Meta = { label: string; color: string };

export const genderMeta: Record<SleeveGender, Meta> = {
  MALE: { label: "М", color: "blue" },
  FEMALE: { label: "Ж", color: "magenta" },
};

export const genderOptions: { value: SleeveGender; label: string }[] = [
  { value: "MALE", label: "Мужской" },
  { value: "FEMALE", label: "Женский" },
];

export const sleeveStatusMeta: Record<SleeveStatus, Meta> = {
  CULTIVATING: { label: "В культивации", color: "processing" },
  INTAKE: { label: "В приёмке", color: "warning" },
  AVAILABLE: { label: "Доступно", color: "success" },
  RESERVED: { label: "Зарезервировано", color: "purple" },
  IN_USE: { label: "Используется", color: "error" },
  WRITTEN_OFF: { label: "Списано", color: "default" },
};

export const orderStatusMeta: Record<OrderStatus, Meta> = {
  NEW: { label: "Новый", color: "blue" },
  AWAITING_BODY: { label: "Ожидает тело", color: "warning" },
  CONFIRMED: { label: "Подтверждён", color: "success" },
  CANCELLED: { label: "Отменён", color: "default" },
};

export const caseStatusMeta: Record<CaseStatus, Meta> = {
  PENDING: { label: "Ожидает", color: "default" },
  IN_PROGRESS: { label: "Перенос в процессе", color: "processing" },
  COMPLETED: { label: "Завершён", color: "success" },
  INCIDENT: { label: "Инцидент", color: "error" },
  CORRECTIVE: { label: "Корректирующие процедуры", color: "warning" },
};

export const stackStatusMeta: Record<StackStatus, Meta> = {
  STORED: { label: "На хранении", color: "default" },
  IN_USE: { label: "Используется", color: "processing" },
  AVAILABLE: { label: "Доступен", color: "success" },
};

export const incidentTypeMeta: Record<IncidentType, Meta> = {
  STACK_SHOCK: { label: "Stack Shock", color: "red" },
  REJECTION: { label: "Отторжение тела", color: "volcano" },
  STACK_DAMAGE: { label: "Повреждение стека", color: "magenta" },
  IDENTITY_FRAGMENTATION: { label: "Фрагментация личности", color: "orange" },
};

export const certificateStatusMeta: Record<CertificateStatus, Meta> = {
  PENDING: { label: "Готовится", color: "default" },
  READY: { label: "Готов", color: "success" },
};

export const stageOrder = [
  "NO_ORDER",
  "ORDER_CREATED",
  "CULTIVATION",
  "RESERVED",
  "SCHEDULED",
  "NEEDLECAST",
  "COMPLETED",
] as const;

export const stageLabels: Record<string, string> = {
  NO_ORDER: "Заказ не оформлен",
  ORDER_CREATED: "Заказ создан",
  CULTIVATION: "Культивирование тела",
  RESERVED: "Тело зарезервировано",
  SCHEDULED: "Процедура назначена",
  NEEDLECAST: "Перенос сознания",
  COMPLETED: "Завершено",
  INCIDENT: "Инцидент",
  CORRECTIVE: "Корректирующие процедуры",
};

export const brand = {
  name: "SCMS",
  fullName: "SCMS · Sleeving Clinic",
  tagline: "Sleeving Clinic Management System",
  location: "Бей-Сити · 2384",
};
