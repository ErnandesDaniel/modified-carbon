import type { AxiosRequestConfig } from "axios";
import { useMutation, useQuery } from "@tanstack/react-query";
import axiosInstance from "@/shared/api/axiosInstance";
import type { CreateOrderRequestDto, OrderDto } from "@/shared/api/dto";

export const getMyOrders = async (options?: AxiosRequestConfig): Promise<OrderDto[]> => {
  const { data } = await axiosInstance.get<OrderDto[]>("/orders/mine", options);
  return data;
};

export const getMyOrdersQueryKey = () => ["orders", "mine"] as const;

export const getMyOrdersQueryOptions = () => ({
  queryKey: getMyOrdersQueryKey(),
  queryFn: ({ signal }: { signal: AbortSignal }) => getMyOrders({ signal }),
});

export const useMyOrders = () => useQuery(getMyOrdersQueryOptions());

export const createOrder = async (payload: CreateOrderRequestDto): Promise<OrderDto> => {
  const { data } = await axiosInstance.post<OrderDto>("/orders", payload);
  return data;
};

export const useCreateOrder = () => useMutation({ mutationFn: createOrder });
