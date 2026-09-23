import type { CaseDto } from "./caseDto";
import type { CertificateDto } from "./certificateDto";
import type { OrderDto } from "./orderDto";
import type { StackDto } from "./stackDto";
import type { UserDto } from "./userDto";

export interface ClientDashboardDto {
  user: UserDto;
  currentStage: string;
  orders: OrderDto[];
  cases: CaseDto[];
  certificates: CertificateDto[];
  stacks: StackDto[];
}
