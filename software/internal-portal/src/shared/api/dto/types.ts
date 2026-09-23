export type AppRole = "METH" | "SLEEVE_BROKER" | "NEEDLECASTER" | "PSYCHOSURGEON" | "ADMIN";

export type SleeveGender = "MALE" | "FEMALE";

export type SleeveStatus =
  | "CULTIVATING"
  | "INTAKE"
  | "AVAILABLE"
  | "RESERVED"
  | "IN_USE"
  | "WRITTEN_OFF";

export type OrderStatus = "NEW" | "AWAITING_BODY" | "CONFIRMED" | "CANCELLED";

export type CaseStatus = "PENDING" | "IN_PROGRESS" | "COMPLETED" | "INCIDENT" | "CORRECTIVE";

export type StackStatus = "STORED" | "IN_USE" | "AVAILABLE";

export type IncidentType = "STACK_SHOCK" | "REJECTION" | "STACK_DAMAGE" | "IDENTITY_FRAGMENTATION";

export type CheckpointCategory = "COGNITIVE" | "PHYSICAL" | "STACK" | "IDENTITY";

export type CheckpointStatus = "PENDING" | "PASSED" | "FAILED";

export type CertificateStatus = "PENDING" | "READY";

export type AuditAction =
  | "LOGIN"
  | "VIEW"
  | "CREATE"
  | "UPDATE"
  | "DELETE"
  | "RESERVE"
  | "INTAKE_ACCEPT"
  | "INTAKE_REJECT"
  | "CULTIVATION_ORDER"
  | "ORDER_CONFIRM"
  | "NEEDLECAST_START"
  | "NEEDLECAST_COMPLETE"
  | "INCIDENT"
  | "CHECKPOINT"
  | "CERTIFY"
  | "ROLE_CHANGE";

export interface UserDto {
  id: number;
  displayName: string | null;
  email: string | null;
  role: AppRole;
}

export interface GeneticArchiveDto {
  id: number;
  code: string;
  name: string;
}

export interface SleeveDto {
  id: number;
  code: string;
  gender: SleeveGender;
  height: number;
  weight: number;
  age: number;
  geneticArchiveId: number | null;
  geneticArchiveName: string | null;
  status: SleeveStatus;
  dnaDonor: string | null;
  notes: string | null;
  cultivationStartedAt: string | null;
  plannedReadyAt: string | null;
  cultivationStagePercent: number;
  reservedForUserId: number | null;
  reservedForUserName: string | null;
  createdAt: string;
}

export interface OrderDto {
  id: number;
  code: string;
  methUserId: number;
  methUserName: string | null;
  sleeveId: number | null;
  sleeveCode: string | null;
  gender: SleeveGender | null;
  height: number | null;
  weight: number | null;
  age: number | null;
  geneticArchiveId: number | null;
  geneticArchiveName: string | null;
  status: OrderStatus;
  createdAt: string;
}

export interface StackDto {
  id: number;
  code: string;
  ownerUserId: number | null;
  ownerName: string | null;
  status: StackStatus;
  location: string | null;
  lastExtractedAt: string | null;
}

export interface CaseDto {
  id: number;
  code: string;
  orderId: number | null;
  methUserId: number;
  methUserName: string | null;
  sleeveId: number | null;
  sleeveCode: string | null;
  sleeveGender: SleeveGender | null;
  sleeveHeight: number | null;
  stackId: number | null;
  stackCode: string | null;
  status: CaseStatus;
  needlecasterName: string | null;
  startTime: string | null;
  endTime: string | null;
  result: string | null;
  incidentType: IncidentType | null;
  incidentNote: string | null;
  createdAt: string;
}

export interface CheckpointDto {
  id: number;
  caseId: number;
  label: string;
  description: string | null;
  category: CheckpointCategory;
  status: CheckpointStatus;
  required: boolean;
}

export interface IncidentDto {
  id: number;
  caseId: number;
  type: IncidentType;
  description: string | null;
  resolved: boolean;
  createdAt: string;
}

export interface CertificateDto {
  id: number;
  caseId: number;
  caseCode: string | null;
  methUserId: number;
  methUserName: string | null;
  code: string;
  status: CertificateStatus;
  verificationCode: string;
  issuedAt: string;
}

export interface AuditLogDto {
  id: number;
  userId: number | null;
  userName: string | null;
  action: AuditAction;
  entityType: string | null;
  entityId: number | null;
  details: string | null;
  createdAt: string;
}

export interface AdminDashboardDto {
  totalSleeves: number;
  availableSleeves: number;
  cultivatingSleeves: number;
  intakeSleeves: number;
  reservedSleeves: number;
  inUseSleeves: number;
  pendingCases: number;
  inProgressCases: number;
  completedCases: number;
  incidentCases: number;
  pendingValidation: number;
  openIncidents: number;
  newOrders: number;
  recentAudit: AuditLogDto[];
}

export interface DevLoginRequestDto {
  name: string;
}

export interface CultivationRequestDto {
  gender: SleeveGender;
  height: number;
  weight: number;
  age: number;
  geneticArchiveId: number;
  notes?: string | null;
}

export interface StartProcedureRequestDto {
  needlecasterName: string | null;
}

export interface CompleteProcedureRequestDto {
  result: string;
}

export interface IncidentRequestDto {
  type: IncidentType;
  description: string | null;
}

export interface CheckpointUpdateRequestDto {
  status: CheckpointStatus;
}

export interface UpdateUserRequestDto {
  displayName: string | null;
  email: string | null;
  role: AppRole;
}
