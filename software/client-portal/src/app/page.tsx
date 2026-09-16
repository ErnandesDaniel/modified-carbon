'use client';

import { Button, Space, Tag, Typography } from 'antd';
import { useRouter } from 'next/navigation';
import { useSession } from '@/components/session-provider';

const { Title, Paragraph, Text } = Typography;

export default function LandingPage() {
  const router = useRouter();
  const { user } = useSession();

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f9f0ff 0%, #f0f2f5 55%)' }}>
      <header
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '18px 48px',
          background: '#fff',
          borderBottom: '1px solid #f0f0f0'
        }}
      >
        <div>
          <Title level={4} style={{ margin: 0, color: '#722ed1' }}>
            SCMS
          </Title>
          <Text type="secondary" style={{ fontSize: 11 }}>
            Sleeving Clinic Management System
          </Text>
        </div>
        <Button type="primary" onClick={() => router.push(user ? '/cabinet' : '/login')}>
          {user ? 'Личный кабинет' : 'Войти'}
        </Button>
      </header>

      <div style={{ maxWidth: 720, margin: '0 auto', padding: '96px 24px' }}>
        <Tag color="purple" style={{ marginBottom: 16 }}>
          Бей-Сити · 2384
        </Tag>
        <Title style={{ marginBottom: 12 }}>Клиника переноса сознания</Title>
        <Paragraph style={{ fontSize: 16 }}>
          Элитная клиника sleeve-терапии: подбор и выращивание тела, процедура needlecast и
          постпроцедурная сертификация совместимости. Войдите, чтобы оформить заказ тела и
          отслеживать статус в личном кабинете.
        </Paragraph>
        <Space style={{ marginTop: 16 }}>
          <Button type="primary" size="large" onClick={() => router.push(user ? '/cabinet' : '/login')}>
            {user ? 'Перейти в кабинет' : 'Войти в личный кабинет'}
          </Button>
        </Space>
      </div>
    </div>
  );
}
