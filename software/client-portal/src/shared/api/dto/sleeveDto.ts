import type { SleeveGender, SleeveStatus } from "./enums";

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
