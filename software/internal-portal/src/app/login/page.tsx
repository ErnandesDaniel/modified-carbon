'use client';

import { LoginOutlined, SafetyCertificateOutlined } from '@ant-design/icons';
import { App, Button, Card, Form, Input, Tag, Typography } from 'antd';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useSession } from '@/components/session-provider';

const { Title, Paragraph, Text } = Typography;

export default function LoginPage() {
  const { user, loading, login } = useSession();
  const router = useRouter();
  const { message } = App.useApp();
  const [name, setName] = useState('Demo Staff');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && user) {
      router.replace('/dashboard');
    }
  }, [loading, user, router]);

  const onLogin = async () => {
    setSubmitting(true);
    try {
      await login(name);
      router.replace('/dashboard');
    } catch {
      message.error('Не удалось войти. Проверьте, что backend запущен.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #f9f0ff 0%, #f0f2f5 60%)'
      }}
    >
      <Card style={{ width: 440 }} styles={{ body: { padding: 32 } }}>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <SafetyCertificateOutlined style={{ fontSize: 40, color: '#722ed1' }} />
          <Title level={3} style={{ marginTop: 12, marginBottom: 4 }}>
            Внутренний портал SCMS
          </Title>
          <Paragraph type="secondary" style={{ margin: 0 }}>
            Sleeving Clinic Management System · Бей-Сити, 2384
          </Paragraph>
        </div>

        <Form layout="vertical" onFinish={onLogin}>
          <Form.Item label="Имя сотрудника" required>
            <Input
              size="large"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Введите имя"
            />
          </Form.Item>
          <Button
            type="primary"
            size="large"
            block
            icon={<LoginOutlined />}
            htmlType="submit"
            loading={submitting}
          >
            Войти как сотрудник
          </Button>
        </Form>

        <div style={{ marginTop: 20, textAlign: 'center' }}>
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
}
