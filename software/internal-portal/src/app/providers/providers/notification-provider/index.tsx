import { notification } from "antd";
import type { PropsWithChildren } from "react";
import { NotificationContext } from "@/app/providers/providers/notification-provider/context";

const NotificationProvider = ({ children }: PropsWithChildren) => {
  const [notificationApi, contextHolder] = notification.useNotification();

  return (
    <NotificationContext.Provider value={notificationApi}>
      {children}
      {contextHolder}
    </NotificationContext.Provider>
  );
};

export default NotificationProvider;
