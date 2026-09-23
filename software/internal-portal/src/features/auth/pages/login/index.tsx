import { LoginOutlined, SafetyCertificateOutlined } from "@ant-design/icons";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { App, Button, Card, Form, Input, Tag, Typography } from "antd";
import { devLogin, queryKeys } from "@/shared/api";
import type { UserDto } from "@/shared/api/dto";

const { Title, Paragraph, Text } = Typography;

interface LoginFormValues {
  name: string;
}

const LoginPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { message } = App.useApp();

  const loginMutation = useMutation({
    mutationFn: (name: string) => devLogin(name),
    onSuccess: async (user: UserDto) => {
      queryClient.setQueryData(queryKeys.authMe, user);
      message.success(`Добро пожаловать, ${user.displayName ?? "сотрудник"}`);
      await navigate({ to: "/dashboard" });
    },
    onError: () => {
      message.error("Не удалось войти. Проверьте, что backend запущен на :3001.");
    },
  });

  const onFinish = (values: LoginFormValues) => {
    loginMutation.mutate(values.name);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #f9f0ff 0%, #f0f2f5 60%)",
      }}
    >
      <Card style={{ width: 440 }} styles={{ body: { padding: 32 } }}>
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <SafetyCertificateOutlined style={{ fontSize: 40, color: "#722ed1" }} />
          <Title level={3} style={{ marginTop: 12, marginBottom: 4 }}>
            Внутренний портал SCMS
          </Title>
          <Paragraph type="secondary" style={{ margin: 0 }}>
            Sleeving Clinic Management System · Бей-Сити, 2384
          </Paragraph>
        </div>

        <Form<LoginFormValues> layout="vertical" initialValues={{ name: "Demo Staff" }} onFinish={onFinish}>
          <Form.Item
            name="name"
            label="Имя сотрудника"
            rules={[{ required: true, message: "Введите имя сотрудника" }]}
          >
            <Input size="large" placeholder="Введите имя" autoComplete="off" />
          </Form.Item>
          <Button
            type="primary"
            size="large"
            block
            icon={<LoginOutlined />}
            htmlType="submit"
            loading={loginMutation.isPending}
          >
            Войти как сотрудник
          </Button>
        </Form>

        <div style={{ marginTop: 20, textAlign: "center" }}>
          <Text type="secondary" style={{ fontSize: 12 }}>
            Демо-вход под дефолтным сотрудником. Роль выбирается в настройках после входа.
          </Text>
          <div style={{ marginTop: 8 }}>
            <Tag color="purple">Dev-режим</Tag>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default LoginPage;
