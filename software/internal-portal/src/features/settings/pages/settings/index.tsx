import { useMutation, useQueryClient } from "@tanstack/react-query";
import { App, Button, Card, Form, Input, Select, Space, Typography } from "antd";
import { useEffect } from "react";
import { useSession } from "@/features/auth/model/useSession";
import { queryKeys, updateMe } from "@/shared/api";
import type { AppRole, UpdateUserRequestDto } from "@/shared/api/dto";
import { roleMeta, staffRoles } from "@/shared/lib/labels";
import { PageHeader, StatusTag } from "@/shared/ui";

const { Paragraph, Text } = Typography;

interface SettingsFormValues {
  displayName: string;
  email: string | null;
  role: AppRole;
}

const SettingsPage = () => {
  const { user } = useSession();
  const queryClient = useQueryClient();
  const { message } = App.useApp();
  const [form] = Form.useForm<SettingsFormValues>();

  useEffect(() => {
    if (user) {
      form.setFieldsValue({
        displayName: user.displayName ?? "",
        email: user.email,
        role: user.role,
      });
    }
  }, [user, form]);

  const saveMutation = useMutation({
    mutationFn: (values: UpdateUserRequestDto) => updateMe(values),
    onSuccess: (updated) => {
      queryClient.setQueryData(queryKeys.authMe, updated);
      message.success("Настройки сохранены. Интерфейс обновлён под выбранную роль.");
    },
    onError: () => message.error("Не удалось сохранить настройки"),
  });

  if (!user) {
    return null;
  }

  return (
    <div>
      <PageHeader
        title="Настройки профиля"
        subtitle="Выберите свою роль — внутренний портал покажет соответствующие разделы."
      />

      <Card style={{ maxWidth: 560 }}>
        <Space style={{ marginBottom: 16 }}>
          <Text>Текущая роль:</Text>
          <StatusTag meta={roleMeta[user.role]} />
        </Space>

        <Form<SettingsFormValues>
          form={form}
          layout="vertical"
          onFinish={(values) =>
            saveMutation.mutate({
              displayName: values.displayName,
              email: values.email ?? null,
              role: values.role,
            })
          }
        >
          <Form.Item name="displayName" label="Отображаемое имя" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="email" label="Email">
            <Input placeholder="staff@clinic.local" />
          </Form.Item>
          <Form.Item name="role" label="Роль" rules={[{ required: true }]}>
            <Select
              options={staffRoles.map((role) => ({ value: role, label: roleMeta[role].label }))}
            />
          </Form.Item>
          <Button type="primary" htmlType="submit" loading={saveMutation.isPending}>
            Сохранить
          </Button>
        </Form>

        <Paragraph type="secondary" style={{ marginTop: 16, marginBottom: 0, fontSize: 12 }}>
          Смена роли выполняется через PATCH /api/user/me и мгновенно перестраивает меню RBAC.
        </Paragraph>
      </Card>
    </div>
  );
};

export default SettingsPage;
