import type { SleeveGender } from "./enums";

export interface CreateOrderRequestDto {
  sleeveId: number | null;
  gender: SleeveGender | null;
  height: number | null;
  weight: number | null;
  age: number | null;
  geneticArchiveId?: number | null;
}
