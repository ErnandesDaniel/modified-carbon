import type { CertificateStatus } from "./enums";

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
