import { createContext } from "react";
import type { UserDto } from "@/shared/api";

export interface AuthContextValue {
  user: UserDto | undefined;
  isLoading: boolean;
  isAuthenticated: boolean;
  loginWithGoogle: () => void;
  demoLogin: () => Promise<UserDto>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);
