'use client';

import {
  ApartmentOutlined,
  AuditOutlined,
  CloudServerOutlined,
  DashboardOutlined,
  ExperimentOutlined,
  FileDoneOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  SafetyCertificateOutlined,
  SettingOutlined,
  TeamOutlined
} from '@ant-design/icons';
import { Avatar, Button, Layout, Menu, Space, Tag, Typography } from 'antd';
import { usePathname, useRouter } from 'next/navigation';
import { useState, type ReactNode } from 'react';
import { useSession } from '@/components/session-provider';
import { roleMeta } from '@/lib/labels';
import type { AppRole, CurrentUser } from '@/lib/types';

const { Header, Sider, Content } = Layout;
const { Title, Text } = Typography;

interface MenuItemDef {
  key: string;
  icon: ReactNode;
  label: string;
  roles: AppRole[];
}

const ALL_STAFF: AppRole[] = ['SLEEVE_BROKER', 'NEEDLECASTER', 'PSYCHOSURGEON', 'ADMIN'];

const menuDefinition: MenuItemDef[] = [
  { key: '/dashboard', icon: <DashboardOutlined />, label: 'Дашборд', roles: ALL_STAFF },
  { key: '/sleeves', icon: <CloudServerOutlined />, label: 'Каталог тел', roles: ['SLEEVE_BROKER', 'ADMIN'] },
  { key: '/orders', icon: <ApartmentOutlined />, label: 'Заказы', roles: ['SLEEVE_BROKER', 'ADMIN'] },
  { key: '/needlecast', icon: <ExperimentOutlined />, label: 'Needlecast', roles: ['NEEDLECASTER', 'ADMIN'] },
  { key: '/validation', icon: <SafetyCertificateOutlined />, label: 'Валидация', roles: ['PSYCHOSURGEON', 'ADMIN'] },
  { key: '/certificates', icon: <FileDoneOutlined />, label: 'Сертификаты', roles: ALL_STAFF },
  { key: '/users', icon: <TeamOutlined />, label: 'Пользователи', roles: ['ADMIN'] },
  { key: '/audit', icon: <AuditOutlined />, label: 'Аудит', roles: ['ADMIN'] },
  { key: '/settings', icon: <SettingOutlined />, label: 'Настройки', roles: ALL_STAFF }
];

export function PortalShell({ user, children }: { user: CurrentUser; children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { logout } = useSession();
  const [collapsed, setCollapsed] = useState(false);

  const items = menuDefinition
    .filter((item) => item.roles.includes(user.role))
    .map(({ key, icon, label }) => ({ key, icon, label }));

  const selectedKey =
    menuDefinition
      .filter((item) => item.roles.includes(user.role))
      .map((item) => item.key)
      .filter((key) => pathname.startsWith(key))
      .sort((a, b) => b.length - a.length)[0] ?? '/dashboard';

  const onLogout = async () => {
    await logout();
    router.replace('/login');
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        width={230}
        style={{ background: '#fff', borderRight: '1px solid #f0f0f0' }}
      >
        <div style={{ padding: '18px 16px', textAlign: collapsed ? 'center' : 'left' }}>
          <Title level={4} style={{ margin: 0, color: '#722ed1' }}>
            {collapsed ? 'S' : 'SCMS'}
          </Title>
          {!collapsed && (
            <Text type="secondary" style={{ fontSize: 11 }}>
              Внутренний портал
            </Text>
          )}
        </div>
        <Menu
          mode="inline"
          selectedKeys={[selectedKey]}
          items={items}
          onClick={({ key }) => router.push(key)}
          style={{ borderInlineEnd: 'none' }}
        />
      </Sider>

      <Layout>
        <Header
          style={{
            background: '#fff',
            padding: '0 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid #f0f0f0'
          }}
        >
          <Space size={16}>
            {collapsed ? (
              <MenuUnfoldOutlined onClick={() => setCollapsed(false)} style={{ cursor: 'pointer', color: '#722ed1' }} />
            ) : (
              <MenuFoldOutlined onClick={() => setCollapsed(true)} style={{ cursor: 'pointer', color: '#722ed1' }} />
            )}
            <Title level={5} style={{ margin: 0, fontWeight: 500 }}>
              Bay City Sleeving Clinic — 2384
            </Title>
          </Space>

          <Space size={12}>
            <Tag color={roleMeta[user.role].color}>{roleMeta[user.role].label}</Tag>
            <Space size={8}>
              <Avatar style={{ background: '#722ed1' }}>{(user.displayName ?? 'S').charAt(0)}</Avatar>
              <Text>{user.displayName}</Text>
            </Space>
            <Button icon={<LogoutOutlined />} onClick={onLogout}>
              Выйти
            </Button>
          </Space>
        </Header>

        <Content style={{ margin: 24, overflow: 'auto' }}>{children}</Content>
      </Layout>
    </Layout>
  );
}
