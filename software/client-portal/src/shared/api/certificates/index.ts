import type { AxiosRequestConfig } from "axios";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/shared/api/axiosInstance";
import type { CertificateDto } from "@/shared/api/dto";

export const getMyCertificates = async (options?: AxiosRequestConfig): Promise<CertificateDto[]> => {
  const { data } = await axiosInstance.get<CertificateDto[]>("/certificates/mine", options);
  return data;
};

export const getMyCertificatesQueryKey = () => ["certificates", "mine"] as const;

export const getMyCertificatesQueryOptions = () => ({
  queryKey: getMyCertificatesQueryKey(),
  queryFn: ({ signal }: { signal: AbortSignal }) => getMyCertificates({ signal }),
});

export const useMyCertificates = () => useQuery(getMyCertificatesQueryOptions());
