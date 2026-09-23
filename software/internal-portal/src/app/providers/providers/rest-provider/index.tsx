import { QueryClientProvider } from "@tanstack/react-query";
import { useContext, useEffect } from "react";
import type { ArgsProps } from "antd/es/notification/interface";
import { NotificationContext } from "@/app/providers/providers/notification-provider/context";
import { REQUEST_ERROR } from "@/app/providers/providers/rest-provider/templates";
import type { RestProviderProps } from "@/app/providers/providers/rest-provider/types";

const isNil = (value: unknown): value is null | undefined => value === null || value === undefined;

const RestProvider = ({ children, queryClient }: RestProviderProps) => {
  const providedNotificationApi = useContext(NotificationContext);

  useEffect(
    () =>
      queryClient.getQueryCache().subscribe((event) => {
        if (
          event?.type === "updated" &&
          event.action.type === "error" &&
          event.query.meta?.isShowErrorNotification !== false
        ) {
          if (isNil(event.query.meta?.errorTemplate)) {
            providedNotificationApi?.error(REQUEST_ERROR);
          } else {
            providedNotificationApi?.error(event.query.meta?.errorTemplate as ArgsProps);
          }
        }
      }),
    [queryClient, providedNotificationApi],
  );

  useEffect(
    () =>
      queryClient.getMutationCache().subscribe((event) => {
        if (
          event?.type === "updated" &&
          event.action.type === "error" &&
          event.mutation.meta?.isShowErrorNotification !== false
        ) {
          if (isNil(event.mutation.meta?.errorTemplate)) {
            providedNotificationApi?.error(REQUEST_ERROR);
          } else {
            providedNotificationApi?.error(event.mutation.meta?.errorTemplate as ArgsProps);
          }
        }
      }),
    [queryClient, providedNotificationApi],
  );

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
};

export default RestProvider;
