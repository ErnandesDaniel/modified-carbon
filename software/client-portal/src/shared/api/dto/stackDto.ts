import type { StackStatus } from "./enums";

export interface StackDto {
  id: number;
  code: string;
  ownerUserId: number | null;
  ownerName: string | null;
  status: StackStatus;
  location: string | null;
  lastExtractedAt: string | null;
}
