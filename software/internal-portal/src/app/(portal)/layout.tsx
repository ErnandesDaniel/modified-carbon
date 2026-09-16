'use client';

import { Spin } from 'antd';
import { useRouter } from 'next/navigation';
import { useEffect, type ReactNode } from 'react';
import { PortalShell } from '@/components/portal-shell';
import { useSession } from '@/components/session-provider';

export default function PortalLayout({ children }: { children: ReactNode }) {
  const { user, loading } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/login');
    }
  }, [loading, user, router]);

  if (loading || !user) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Spin size="large" />
      </div>
    );
  }

  return <PortalShell user={user}>{children}</PortalShell>;
}
