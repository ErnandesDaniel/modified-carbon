import type { AxiosRequestConfig } from "axios";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/shared/api/axiosInstance";
import type { SleeveDto, SleeveGender, SleeveStatus } from "@/shared/api/dto";

export interface SleevesSearchParams {
  availableOnly?: boolean;
  status?: SleeveStatus;
  gender?: SleeveGender;
  heightMin?: number;
  heightMax?: number;
  weightMin?: number;
  weightMax?: number;
  ageMin?: number;
  ageMax?: number;
  search?: string;
}

export const searchSleeves = async (
  params: SleevesSearchParams = {},
  options?: AxiosRequestConfig,
): Promise<SleeveDto[]> => {
  const { data } = await axiosInstance.get<SleeveDto[]>("/sleeves", { params, ...options });
  return data;
};

export const getSleevesQueryKey = (params: SleevesSearchParams) => ["sleeves", params] as const;

export const getSleevesQueryOptions = (params: SleevesSearchParams) => ({
  queryKey: getSleevesQueryKey(params),
  queryFn: ({ signal }: { signal: AbortSignal }) => searchSleeves(params, { signal }),
});

export const useSleeves = (params: SleevesSearchParams) => useQuery(getSleevesQueryOptions(params));
