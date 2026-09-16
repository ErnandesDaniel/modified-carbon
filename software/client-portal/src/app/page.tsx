'use client';

import { ExperimentOutlined, SafetyCertificateOutlined, ThunderboltOutlined } from '@ant-design/icons';
import { Button, Card, Col, Row, Space, Tag, Typography } from 'antd';
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

      <div style={{ maxWidth: 1080, margin: '0 auto', padding: '64px 24px' }}>
        <Tag color="purple" style={{ marginBottom: 16 }}>
          Бей-Сити · 2384
        </Tag>
        <Title style={{ marginBottom: 12 }}>Клиника переноса сознания</Title>
        <Paragraph style={{ fontSize: 16, maxWidth: 720 }}>
          Элитная клиника sleeve-терапии. Мы подбираем и выращиваем тела, проводим процедуру needlecast и
          сопровождаем вас до полной сертификации совместимости.
        </Paragraph>

        <Space style={{ marginTop: 8, marginBottom: 48 }}>
          <Button type="primary" size="large" onClick={() => router.push(user ? '/cabinet' : '/login')}>
            {user ? 'Перейти в кабинет' : 'Войти через Google'}
          </Button>
        </Space>

        <Row gutter={[16, 16]}>
          <Col xs={24} md={8}>
            <Card>
              <ExperimentOutlined style={{ fontSize: 28, color: '#722ed1' }} />
              <Title level={5} style={{ marginTop: 12 }}>
                Подбор тела
              </Title>
              <Paragraph type="secondary" style={{ margin: 0 }}>
                Каталог клонированных тел с фильтрами по росту, весу, полу и возрасту.
              </Paragraph>
            </Card>
          </Col>
          <Col xs={24} md={8}>
            <Card>
              <ThunderboltOutlined style={{ fontSize: 28, color: '#722ed1' }} />
              <Title level={5} style={{ marginTop: 12 }}>
                Needlecast
              </Title>
              <Paragraph type="secondary" style={{ margin: 0 }}>
                Перенос сознания из кортикального стека в новое тело под контролем специалистов.
              </Paragraph>
            </Card>
          </Col>
          <Col xs={24} md={8}>
            <Card>
              <SafetyCertificateOutlined style={{ fontSize: 28, color: '#722ed1' }} />
              <Title level={5} style={{ marginTop: 12 }}>
                Сертификация
              </Title>
              <Paragraph type="secondary" style={{ margin: 0 }}>
                Постпроцедурная валидация и PDF-сертификат совместимости с QR-кодом проверки.
              </Paragraph>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
}
