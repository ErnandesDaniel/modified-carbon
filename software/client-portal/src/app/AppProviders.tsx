import { Outlet } from "@tanstack/react-router";
import AntdProvider from "@/app/providers/providers/antd-provider";
import AuthProvider from "@/app/providers/providers/auth-provider";
import QueryProvider from "@/app/providers/providers/query-provider";

export const AppProviders = () => (
  <QueryProvider>
    <AntdProvider>
      <AuthProvider>
        <Outlet />
      </AuthProvider>
    </AntdProvider>
  </QueryProvider>
);
