'use client';

import { App, Button, Card, Form, Input, Select, Space, Tag, Typography } from 'antd';
import { useEffect } from 'react';
import { useSession } from '@/components/session-provider';
import { apiSend } from '@/lib/api';
import { roleMeta, staffRoles } from '@/lib/labels';
import type { AppRole, UserDto } from '@/lib/types';

const { Title, Paragraph, Text } = Typography;

export default function SettingsPage() {
  const { user, refresh } = useSession();
  const { message } = App.useApp();
  const [form] = Form.useForm();

  useEffect(() => {
    if (user) {
      form.setFieldsValue({ displayName: user.displayName, role: user.role });
    }
  }, [user, form]);

  if (!user) {
    return null;
  }

  const save = async () => {
    const values = await form.validateFields();
    try {
      await apiSend<UserDto>('PATCH', '/user/me', values);
      await refresh();
      message.success('Настройки сохранены. Рабочий интерфейс обновлён под роль.');
    } catch {
      message.error('Не удалось сохранить настройки');
    }
  };

  return (
    <div>
      <Title level={3} className="page-title">
        Настройки профиля
      </Title>
      <Paragraph className="page-subtitle">
        Выберите свою роль — внутренний портал покажет соответствующие разделы.
      </Paragraph>

      <Card style={{ maxWidth: 560 }}>
        <Space style={{ marginBottom: 16 }}>
          <Text>Текущая роль:</Text>
          <Tag color={roleMeta[user.role].color}>{roleMeta[user.role].label}</Tag>
        </Space>

        <Form form={form} layout="vertical">
          <Form.Item name="displayName" label="Отображаемое имя" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="role" label="Роль" rules={[{ required: true }]}>
            <Select
              options={staffRoles.map((role: AppRole) => ({ value: role, label: roleMeta[role].label }))}
            />
          </Form.Item>
          <Button type="primary" onClick={save}>
            Сохранить
          </Button>
        </Form>
      </Card>
    </div>
  );
}
