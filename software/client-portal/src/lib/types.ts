export type AppRole = 'METH' | 'SLEEVE_BROKER' | 'NEEDLECASTER' | 'PSYCHOSURGEON' | 'ADMIN';
export type SleeveGender = 'MALE' | 'FEMALE';
export type SleeveStatus = 'CULTIVATING' | 'INTAKE' | 'AVAILABLE' | 'RESERVED' | 'IN_USE' | 'WRITTEN_OFF';
export type OrderStatus = 'NEW' | 'AWAITING_BODY' | 'CONFIRMED' | 'CANCELLED';
export type CaseStatus = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'INCIDENT' | 'CORRECTIVE';
export type StackStatus = 'STORED' | 'IN_USE' | 'AVAILABLE';
export type IncidentType = 'STACK_SHOCK' | 'REJECTION' | 'STACK_DAMAGE' | 'IDENTITY_FRAGMENTATION';
export type CertificateStatus = 'PENDING' | 'READY';

export interface CurrentUser {
  userId: number;
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

export interface ClientDashboardDto {
  user: CurrentUser;
  currentStage: string;
  orders: OrderDto[];
  cases: CaseDto[];
  certificates: CertificateDto[];
  stacks: StackDto[];
}
