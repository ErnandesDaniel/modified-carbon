'use client';

import { notification } from 'antd';
import type { NotificationInstance } from 'antd/es/notification/interface';
import isNil from 'lodash-es/isNil';
import { createContext, type PropsWithChildren, useEffect, useState } from 'react';

export const NotificationContext = createContext<NotificationInstance | undefined>(undefined);

const NotificationProvider = ({ children }: PropsWithChildren) => {
  const [notificationApi, contextHolder] = notification.useNotification();
  const [notificationInstance, setNotificationInstance] = useState<NotificationInstance>();

  useEffect(() => {
    if (!isNil(notificationApi)) {
      setNotificationInstance(notificationApi);
    }
  }, [notificationApi, setNotificationInstance]);

  return (
    <NotificationContext.Provider value={notificationInstance}>
      {children}
      {contextHolder}
    </NotificationContext.Provider>
  );
};

export default NotificationProvider;
