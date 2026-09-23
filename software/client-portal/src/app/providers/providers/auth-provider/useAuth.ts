import { useContext } from "react";
import { AuthContext } from "@/app/providers/providers/auth-provider/context";
import type { AuthContextValue } from "@/app/providers/providers/auth-provider/context";

export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
};
