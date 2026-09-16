'use client';

import '@ant-design/v5-patch-for-react-19';

import { SessionProvider as NextAuthSessionProvider } from 'next-auth/react';
import { App as AntApp, ConfigProvider } from 'antd';
import ruRU from 'antd/locale/ru_RU';
import type { ReactNode } from 'react';
import { SessionProvider } from '@/components/session-provider';

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <NextAuthSessionProvider>
      <ConfigProvider
        locale={ruRU}
        theme={{
          token: {
            colorPrimary: '#722ed1',
            borderRadius: 8
          }
        }}
      >
        <AntApp>
          <SessionProvider>{children}</SessionProvider>
        </AntApp>
      </ConfigProvider>
    </NextAuthSessionProvider>
  );
}
