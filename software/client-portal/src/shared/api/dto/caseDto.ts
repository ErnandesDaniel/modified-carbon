import type { CaseStatus, IncidentType, SleeveGender } from "./enums";

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
