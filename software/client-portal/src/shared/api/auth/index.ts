import type { AxiosRequestConfig } from "axios";
import { useMutation, useQuery } from "@tanstack/react-query";
import axiosInstance from "@/shared/api/axiosInstance";
import type { UserDto } from "@/shared/api/dto";

export const authGetMe = async (options?: AxiosRequestConfig): Promise<UserDto> => {
  const { data } = await axiosInstance.get<UserDto>("/auth/me", options);
  return data;
};

export const getAuthGetMeQueryKey = () => ["auth", "me"] as const;

export const getAuthGetMeQueryOptions = () => ({
  queryKey: getAuthGetMeQueryKey(),
  queryFn: ({ signal }: { signal: AbortSignal }) => authGetMe({ signal }),
});

export const useAuthGetMe = () => useQuery(getAuthGetMeQueryOptions());

export const authClientDevLogin = async (): Promise<UserDto> => {
  const { data } = await axiosInstance.post<UserDto>("/auth/client-dev-login");
  return data;
};

export const useAuthClientDevLogin = () => useMutation({ mutationFn: authClientDevLogin });

export const authLogout = async (): Promise<void> => {
  await axiosInstance.post("/auth/logout");
};

export const useAuthLogout = () => useMutation({ mutationFn: authLogout });
