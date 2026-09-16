'use client';

import { CloudServerOutlined, FileDoneOutlined, HomeOutlined, LogoutOutlined, ProfileOutlined } from '@ant-design/icons';
import { Avatar, Button, Layout, Menu, Space, Typography } from 'antd';
import { usePathname, useRouter } from 'next/navigation';
import type { ReactNode } from 'react';
import { useSession } from '@/components/session-provider';
import type { CurrentUser } from '@/lib/types';

const { Header, Content } = Layout;
const { Title, Text } = Typography;

const menuItems = [
  { key: '/cabinet', icon: <HomeOutlined />, label: 'Обзор' },
  { key: '/cabinet/catalog', icon: <CloudServerOutlined />, label: 'Каталог тел' },
  { key: '/cabinet/orders', icon: <ProfileOutlined />, label: 'Мои заказы' },
  { key: '/cabinet/certificates', icon: <FileDoneOutlined />, label: 'Сертификаты' }
];

export function CabinetShell({ user, children }: { user: CurrentUser; children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { logout } = useSession();

  const selectedKey = menuItems
    .map((item) => item.key)
    .filter((key) => pathname === key || pathname.startsWith(`${key}/`))
    .sort((a, b) => b.length - a.length)[0] ?? '/cabinet';

  const onLogout = async () => {
    await logout();
    router.replace('/');
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header
        style={{
          background: '#fff',
          borderBottom: '1px solid #f0f0f0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 32px'
        }}
      >
        <Space size={32}>
          <div>
            <Title level={5} style={{ margin: 0, color: '#722ed1' }}>
              SCMS
            </Title>
            <Text type="secondary" style={{ fontSize: 11 }}>
              Личный кабинет
            </Text>
          </div>
          <Menu
            mode="horizontal"
            selectedKeys={[selectedKey]}
            items={menuItems}
            onClick={({ key }) => router.push(key)}
            style={{ borderBottom: 'none', minWidth: 520 }}
          />
        </Space>

        <Space size={12}>
          <Space size={8}>
            <Avatar style={{ background: '#722ed1' }}>{(user.displayName ?? 'M').charAt(0)}</Avatar>
            <Text>{user.displayName}</Text>
          </Space>
          <Button icon={<LogoutOutlined />} onClick={onLogout}>
            Выйти
          </Button>
        </Space>
      </Header>

      <Content style={{ maxWidth: 1160, width: '100%', margin: '0 auto', padding: 24 }}>{children}</Content>
    </Layout>
  );
}
