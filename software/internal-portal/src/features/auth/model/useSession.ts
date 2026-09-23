import { useQuery } from "@tanstack/react-query";
import { getAuthMeQueryOptions } from "@/shared/api";
import type { UserDto } from "@/shared/api/dto";

interface SessionState {
  user: UserDto | undefined;
  loading: boolean;
  refetch: () => Promise<unknown>;
}

export const useSession = (): SessionState => {
  const query = useQuery(getAuthMeQueryOptions());

  return {
    user: query.data,
    loading: query.isPending,
    refetch: query.refetch,
  };
};
