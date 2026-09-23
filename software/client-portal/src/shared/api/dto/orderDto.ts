import type { OrderStatus, SleeveGender } from "./enums";

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
