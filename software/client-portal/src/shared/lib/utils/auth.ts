import type { QueryClient } from "@tanstack/react-query";
import { redirect } from "@tanstack/react-router";
import { getAuthGetMeQueryOptions } from "@/shared/api";
import type { UserDto } from "@/shared/api";

interface CheckAuthOptions {
  redirectToIfNotAuth?: string;
  redirectToIfAuth?: string;
}

export const checkAuth = async (queryClient: QueryClient, options?: CheckAuthOptions): Promise<UserDto | undefined> => {
  const queryOptions = getAuthGetMeQueryOptions();

  let user = queryClient.getQueryData<UserDto>(queryOptions.queryKey);

  if (user === undefined) {
    try {
      user = await queryClient.fetchQuery(queryOptions);
    } catch {
      user = undefined;
    }
  }

  const isAuthenticated = user != null;

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
