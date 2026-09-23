import type { QueryClient } from "@tanstack/react-query";
import { redirect } from "@tanstack/react-router";
import { getAuthMeQueryOptions } from "@/shared/api";
import type { UserDto } from "@/shared/api/dto";

type AuthRedirect = "/login" | "/dashboard";

interface CheckAuthOptions {
  redirectToIfNotAuth?: AuthRedirect;
  redirectToIfAuth?: AuthRedirect;
}

export const checkAuth = async (
  queryClient: QueryClient,
  options?: CheckAuthOptions,
): Promise<UserDto | undefined> => {
  let user = queryClient.getQueryData<UserDto>(getAuthMeQueryOptions().queryKey);

  if (!user) {
    try {
      user = await queryClient.fetchQuery(getAuthMeQueryOptions());
    } catch {
      user = undefined;
    }
  }

  const isAuthenticated = Boolean(user);

  if (!isAuthenticated) {
    if (options?.redirectToIfNotAuth) {
      throw redirect({ to: options.redirectToIfNotAuth });
    }
    return undefined;
  }

  if (options?.redirectToIfAuth) {
    throw redirect({ to: options.redirectToIfAuth });
  }

  return user;
};
