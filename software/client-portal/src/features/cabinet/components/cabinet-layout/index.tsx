import {
  CloudServerOutlined,
  FileDoneOutlined,
  HomeOutlined,
  LogoutOutlined,
  ProfileOutlined,
} from "@ant-design/icons";
import { Avatar, Button, Layout, Menu, Space, Tag, Typography } from "antd";
import { Outlet, useLocation, useNavigate } from "@tanstack/react-router";
import { useAuth } from "@/app/providers/providers/auth-provider/useAuth";

const { Header, Content } = Layout;
const { Title, Text } = Typography;

const menuItems = [
  { key: "/cabinet", icon: <HomeOutlined />, label: "Кабинет" },
  { key: "/cabinet/catalog", icon: <CloudServerOutlined />, label: "Каталог тел" },
  { key: "/cabinet/orders", icon: <ProfileOutlined />, label: "Мои заказы" },
  { key: "/cabinet/certificates", icon: <FileDoneOutlined />, label: "Сертификаты" },
];

const CabinetLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const pathname = location.pathname;
  const selectedKey =
    menuItems
      .map((item) => item.key)
      .filter((key) => pathname === key || pathname.startsWith(`${key}/`))
      .sort((a, b) => b.length - a.length)[0] ?? "/cabinet";

  const onLogout = async () => {
    await logout();
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Header
        style={{
          background: "#fff",
          borderBottom: "1px solid #f0f0f0",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 32px",
          gap: 24,
        }}
      >
        <Space size={32}>
          <div>
            <Title level={5} style={{ margin: 0, color: "#722ed1" }}>
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
            onClick={({ key }) => void navigate({ to: key })}
            style={{ borderBottom: "none", minWidth: 520 }}
          />
        </Space>

        <Space size={12}>
          <Space size={8}>
            <Avatar style={{ background: "#722ed1" }}>{(user?.displayName ?? "M").charAt(0)}</Avatar>
            <Text>{user?.displayName ?? "Клиент"}</Text>
            <Tag color="purple">Meth</Tag>
          </Space>
          <Button icon={<LogoutOutlined />} onClick={onLogout}>
            Выйти
          </Button>
        </Space>
      </Header>

      <Content style={{ maxWidth: 1160, width: "100%", margin: "0 auto", padding: 24 }}>
        <Outlet />
      </Content>
    </Layout>
  );
};

export default CabinetLayout;
