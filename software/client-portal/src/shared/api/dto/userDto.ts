import type { AppRole } from "./enums";

export interface UserDto {
  id: number;
  displayName: string | null;
  email: string | null;
  role: AppRole;
}
