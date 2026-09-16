'use client';

import { LoginOutlined, SafetyCertificateOutlined } from '@ant-design/icons';
import { App, Button, Card, Divider, Space, Typography } from 'antd';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useSession } from '@/components/session-provider';

const { Title, Paragraph, Text } = Typography;

export default function LoginPage() {
  const { user, loading, demoLogin } = useSession();
  const router = useRouter();
  const { message } = App.useApp();
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && user) {
      router.replace('/cabinet');
    }
  }, [loading, user, router]);

  const onDemo = async () => {
    setSubmitting(true);
    try {
      await demoLogin();
      router.replace('/cabinet');
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
            Личный кабинет
          </Title>
          <Paragraph type="secondary" style={{ margin: 0 }}>
            Войдите, чтобы оформить заказ тела и отслеживать статус
          </Paragraph>
        </div>

        <Button
          type="primary"
          size="large"
          block
          icon={<LoginOutlined />}
          onClick={() => signIn('google', { callbackUrl: '/cabinet' })}
        >
          Войти через Google
        </Button>

        <Divider plain>
          <Text type="secondary" style={{ fontSize: 12 }}>
            или
          </Text>
        </Divider>

        <Button size="large" block onClick={onDemo} loading={submitting}>
          Демо-вход (M. Kovacs)
        </Button>

        <div style={{ marginTop: 20, textAlign: 'center' }}>
          <Space direction="vertical" size={2}>
            <Text type="secondary" style={{ fontSize: 12 }}>
              Демо-вход под тестовым клиентом без Google OAuth.
            </Text>
          </Space>
        </div>
      </Card>
    </div>
  );
}
