import { App as AntApp, ConfigProvider } from "antd";
import ruRU from "antd/locale/ru_RU";
import type { PropsWithChildren } from "react";

const AntdProvider = ({ children }: PropsWithChildren) => (
  <ConfigProvider
    locale={ruRU}
    theme={{
      token: {
        colorPrimary: "#722ed1",
        borderRadius: 8,
      },
    }}
  >
    <AntApp>{children}</AntApp>
  </ConfigProvider>
);

export default AntdProvider;
