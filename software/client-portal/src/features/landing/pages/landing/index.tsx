import { Button, Space, Tag, Typography } from "antd";
import { useNavigate } from "@tanstack/react-router";
import { useAuth } from "@/app/providers/providers/auth-provider/useAuth";
import { brand } from "@/shared/config";

const { Title, Paragraph, Text } = Typography;

const LandingPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading } = useAuth();

  const go = () => {
    void navigate({ to: isAuthenticated ? "/cabinet" : "/login" });
  };

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #f9f0ff 0%, #f0f2f5 55%)" }}>
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "18px 48px",
          background: "#fff",
          borderBottom: "1px solid #f0f0f0",
        }}
      >
        <div>
          <Title level={4} style={{ margin: 0, color: "#722ed1" }}>
            {brand.fullName}
          </Title>
          <Text type="secondary" style={{ fontSize: 11 }}>
            {brand.tagline}
          </Text>
        </div>
        <Button type="primary" loading={isLoading} onClick={go}>
          {isAuthenticated ? "Личный кабинет" : "Войти"}
        </Button>
      </header>

      <div style={{ maxWidth: 720, margin: "0 auto", padding: "96px 24px" }}>
        <Tag color="purple" style={{ marginBottom: 16 }}>
          {brand.location}
        </Tag>
        <Title style={{ marginBottom: 12 }}>Клиника переноса сознания</Title>
        <Paragraph style={{ fontSize: 16 }}>
          Элитная клиника sleeve-терапии: подбор и выращивание тела, процедура needlecast и
          постпроцедурная сертификация совместимости. Войдите, чтобы оформить заказ тела и
          отслеживать статус в личном кабинете.
        </Paragraph>
        <Space style={{ marginTop: 16 }}>
          <Button type="primary" size="large" loading={isLoading} onClick={go}>
            {isAuthenticated ? "Перейти в кабинет" : "Войти в личный кабинет"}
          </Button>
        </Space>
      </div>
    </div>
  );
};

export default LandingPage;
