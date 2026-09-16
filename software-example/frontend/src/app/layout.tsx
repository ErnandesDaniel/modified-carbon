import '@/app/reset.scss';
import '@/app/globals.css';

import { AntdRegistry } from '@ant-design/nextjs-registry';
import type { Metadata } from 'next';
import type { PropsWithChildren } from 'react';

import { auth } from '@/auth';
import AuthProvider from '@/components/providers/auth-provider';
import MockProvider from '@/components/providers/mock-provider';
import NotificationProvider from '@/components/providers/notification-provider';
import RestProvider from '@/components/providers/rest-provider';

export const metadata: Metadata = {
  description: 'Заметки"',
  title: 'Заметки'
};

export default async function RootLayout({ children }: PropsWithChildren) {
  const session = await auth();

  return (
    <html lang="ru">
      <head>
        <meta content="width=device-width, initial-scale=1.0" name="viewport" />
        <link href="icon.ico" rel="icon" />
      </head>
      <body>
        <AuthProvider session={session}>
          <AntdRegistry>
            <NotificationProvider>
              <RestProvider>
                <MockProvider>{children}</MockProvider>
              </RestProvider>
            </NotificationProvider>
          </AntdRegistry>
        </AuthProvider>
      </body>
    </html>
  );
}
