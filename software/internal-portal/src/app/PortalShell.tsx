import { LogoutOutlined, MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import { useQueryClient } from "@tanstack/react-query";
import { Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
import { App, Avatar, Button, Layout, Menu, Space, Spin, Tag, Typography } from "antd";
import { useState } from "react";
import { menuDefinition } from "@/shared/config";
import type { MenuKey } from "@/shared/config";
import { useSession } from "@/features/auth/model/useSession";
import { logout as logoutRequest } from "@/shared/api";
import { roleMeta } from "@/shared/lib/labels";

const { Header, Sider, Content } = Layout;
const { Title, Text } = Typography;

const PortalShell = () => {
  const { user } = useSession();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { message } = App.useApp();
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const [collapsed, setCollapsed] = useState(false);

  if (!user) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Spin size="large" />
      </div>
    );
  }

  const allowedItems = menuDefinition.filter((item) => item.roles.includes(user.role));

  const items = allowedItems.map(({ key, icon, label }) => ({ key, icon, label }));

  const selectedKey =
    allowedItems
      .map((item) => item.key)
      .filter((key) => pathname === key || pathname.startsWith(`${key}/`))
      .sort((a, b) => b.length - a.length)[0] ?? "/dashboard";

  const onLogout = async () => {
    try {
      await logoutRequest();
    } catch {
      message.warning("Сессия завершена локально: backend недоступен.");
    }
    queryClient.clear();
    await navigate({ to: "/login" });
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        width={230}
        style={{ background: "#fff", borderRight: "1px solid #f0f0f0" }}
      >
        <div style={{ padding: "18px 16px", textAlign: collapsed ? "center" : "left" }}>
          <Title level={4} style={{ margin: 0, color: "#722ed1" }}>
            {collapsed ? "S" : "SCMS"}
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
          onClick={({ key }) => void navigate({ to: key as MenuKey })}
          style={{ borderInlineEnd: "none" }}
        />
      </Sider>

      <Layout>
        <Header
          style={{
            background: "#fff",
            padding: "0 24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderBottom: "1px solid #f0f0f0",
          }}
        >
          <Space size={16}>
            {collapsed ? (
              <MenuUnfoldOutlined
                onClick={() => setCollapsed(false)}
                style={{ cursor: "pointer", color: "#722ed1" }}
              />
            ) : (
              <MenuFoldOutlined
                onClick={() => setCollapsed(true)}
                style={{ cursor: "pointer", color: "#722ed1" }}
              />
            )}
            <Title level={5} style={{ margin: 0, fontWeight: 500 }}>
              Bay City Sleeving Clinic — 2384
            </Title>
          </Space>

          <Space size={12}>
            <Tag color={roleMeta[user.role].color}>{roleMeta[user.role].label}</Tag>
            <Space size={8}>
              <Avatar style={{ background: "#722ed1" }}>{(user.displayName ?? "S").charAt(0)}</Avatar>
              <Text>{user.displayName}</Text>
            </Space>
            <Button icon={<LogoutOutlined />} onClick={onLogout}>
              Выйти
            </Button>
          </Space>
        </Header>

        <Content style={{ margin: 24, overflow: "auto" }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default PortalShell;
