import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { useCallback, useMemo } from "react";
import type { PropsWithChildren } from "react";
import {
  getAuthGetMeQueryKey,
  useAuthClientDevLogin,
  useAuthGetMe,
  useAuthLogout,
} from "@/shared/api";
import { GOOGLE_OAUTH_URL } from "@/shared/config";
import { AuthContext } from "@/app/providers/providers/auth-provider/context";
import type { AuthContextValue } from "@/app/providers/providers/auth-provider/context";

const AuthProvider = ({ children }: PropsWithChildren) => {
  const { data: user, isLoading } = useAuthGetMe();
  const demoMutation = useAuthClientDevLogin();
  const logoutMutation = useAuthLogout();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const loginWithGoogle = useCallback(() => {
    window.location.href = GOOGLE_OAUTH_URL;
  }, []);

  const demoLogin = useCallback(async () => {
    const loggedInUser = await demoMutation.mutateAsync();
    queryClient.setQueryData(getAuthGetMeQueryKey(), loggedInUser);
    return loggedInUser;
  }, [demoMutation, queryClient]);

  const logout = useCallback(async () => {
    try {
      await logoutMutation.mutateAsync();
    } catch {
      // даже если запрос не удался — сбрасываем локальное состояние
    } finally {
      queryClient.setQueryData(getAuthGetMeQueryKey(), null);
      queryClient.clear();
      await navigate({ to: "/login" });
    }
  }, [logoutMutation, queryClient, navigate]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isLoading,
      isAuthenticated: user != null,
      loginWithGoogle,
      demoLogin,
      logout,
    }),
    [user, isLoading, loginWithGoogle, demoLogin, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
