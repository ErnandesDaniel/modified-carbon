import type { QueryClient } from "@tanstack/react-query";
import type { PropsWithChildren } from "react";

export type RestProviderProps = PropsWithChildren<{
  queryClient: QueryClient;
}>;
