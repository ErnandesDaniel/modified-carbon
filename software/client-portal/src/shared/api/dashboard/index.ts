import type { AxiosRequestConfig } from "axios";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/shared/api/axiosInstance";
import type { ClientDashboardDto } from "@/shared/api/dto";

export const getClientDashboard = async (options?: AxiosRequestConfig): Promise<ClientDashboardDto> => {
  const { data } = await axiosInstance.get<ClientDashboardDto>("/dashboard/client", options);
  return data;
};

export const getClientDashboardQueryKey = () => ["dashboard", "client"] as const;

export const getClientDashboardQueryOptions = () => ({
  queryKey: getClientDashboardQueryKey(),
  queryFn: ({ signal }: { signal: AbortSignal }) => getClientDashboard({ signal }),
});

export const useClientDashboard = () => useQuery(getClientDashboardQueryOptions());
