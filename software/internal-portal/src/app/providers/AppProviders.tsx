import { getRouteApi, Outlet } from "@tanstack/react-router";
import { App as AntApp, ConfigProvider } from "antd";
import ruRU from "antd/locale/ru_RU";
import NotificationProvider from "@/app/providers/providers/notification-provider";
import RestProvider from "@/app/providers/providers/rest-provider";

const rootRoute = getRouteApi("__root__");

export const AppProviders = () => {
  const { queryClient } = rootRoute.useRouteContext();

  return (
    <ConfigProvider
      locale={ruRU}
      theme={{
        token: {
          colorPrimary: "#722ed1",
          borderRadius: 8,
        },
      }}
    >
      <NotificationProvider>
        <RestProvider queryClient={queryClient}>
          <AntApp>
            <Outlet />
          </AntApp>
        </RestProvider>
      </NotificationProvider>
    </ConfigProvider>
  );
};
