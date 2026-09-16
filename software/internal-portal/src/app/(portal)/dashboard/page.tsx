'use client';

import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloudServerOutlined,
  ExperimentOutlined,
  SafetyCertificateOutlined,
  WarningOutlined
} from '@ant-design/icons';
import { Button, Card, Col, List, Row, Space, Statistic, Table, Tag, Typography } from 'antd';
import { useRouter } from 'next/navigation';
import { useSession } from '@/components/session-provider';
import { useApiData } from '@/lib/use-async';
import { caseStatusMeta, orderStatusMeta, sleeveStatusMeta } from '@/lib/labels';
import { formatDateTime } from '@/lib/format';
import type { AdminDashboardDto, CaseDto, CaseStatus, OrderDto, OrderStatus, SleeveDto, SleeveStatus } from '@/lib/types';

const { Title, Paragraph, Text } = Typography;

export default function DashboardPage() {
  const { user } = useSession();
  const router = useRouter();

  const admin = useApiData<AdminDashboardDto>('/dashboard/admin');
  const intake = useApiData<SleeveDto[]>('/sleeves?status=INTAKE');
  const newOrders = useApiData<OrderDto[]>('/orders?status=NEW');
  const pendingCases = useApiData<CaseDto[]>('/cases?status=PENDING');
  const activeCases = useApiData<CaseDto[]>('/cases?status=IN_PROGRESS');
  const validation = useApiData<CaseDto[]>('/cases/validation');

  if (!user) {
    return null;
  }

  const role = user.role;
  const stats = admin.data;

  return (
    <div>
      <Title level={3} className="page-title">
        Здравствуйте, {user.displayName}
      </Title>
      <Paragraph className="page-subtitle">
        Сводка по клинике и рабочая очередь для роли «{role}».
      </Paragraph>

      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={12} sm={6}>
          <Card>
            <Statistic
              title="Тел в резерве"
              value={stats?.availableSleeves ?? 0}
              prefix={<CloudServerOutlined style={{ color: '#52c41a' }} />}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card>
            <Statistic
              title="Активных процедур"
              value={stats?.inProgressCases ?? 0}
              prefix={<ExperimentOutlined style={{ color: '#722ed1' }} />}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card>
            <Statistic
              title="Ожидают валидации"
              value={stats?.pendingValidation ?? 0}
              prefix={<SafetyCertificateOutlined style={{ color: '#faad14' }} />}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card>
            <Statistic
              title="Открытых инцидентов"
              value={stats?.openIncidents ?? 0}
              valueStyle={{ color: (stats?.openIncidents ?? 0) > 0 ? '#ff4d4f' : undefined }}
              prefix={<WarningOutlined style={{ color: '#ff4d4f' }} />}
            />
          </Card>
        </Col>
      </Row>

      {(role === 'SLEEVE_BROKER' || role === 'ADMIN') && (
        <Row gutter={[16, 16]}>
          <Col xs={24} lg={12}>
            <Card
              title="Приёмка тел"
              extra={<Button size="small" onClick={() => router.push('/sleeves')}>Открыть каталог</Button>}
            >
              <Table
                rowKey="id"
                size="small"
                pagination={false}
                loading={intake.loading}
                dataSource={intake.data ?? []}
                locale={{ emptyText: 'Нет тел на приёмке' }}
                columns={[
                  { title: 'ID', dataIndex: 'code', render: (v: string) => <Tag color="purple">{v}</Tag> },
                  { title: 'Пол', dataIndex: 'gender', render: (v: string) => (v === 'MALE' ? 'М' : 'Ж') },
                  { title: 'Рост', dataIndex: 'height' },
                  { title: 'Статус', dataIndex: 'status', render: (v: string) => <Tag color={sleeveStatusMeta[v as SleeveStatus].color}>{sleeveStatusMeta[v as SleeveStatus].label}</Tag> }
                ]}
              />
            </Card>
          </Col>
          <Col xs={24} lg={12}>
            <Card
              title="Новые заказы клиентов"
              extra={<Button size="small" onClick={() => router.push('/orders')}>Открыть заказы</Button>}
            >
              <Table
                rowKey="id"
                size="small"
                pagination={false}
                loading={newOrders.loading}
                dataSource={newOrders.data ?? []}
                locale={{ emptyText: 'Нет новых заказов' }}
                columns={[
                  { title: 'Заказ', dataIndex: 'code', render: (v: string) => <Tag color="blue">{v}</Tag> },
                  { title: 'Клиент', dataIndex: 'methUserName' },
                  { title: 'Тело', dataIndex: 'sleeveCode', render: (v: string | null) => v ?? '—' },
                  { title: 'Статус', dataIndex: 'status', render: (v: string) => <Tag color={orderStatusMeta[v as OrderStatus].color}>{orderStatusMeta[v as OrderStatus].label}</Tag> }
                ]}
              />
            </Card>
          </Col>
        </Row>
      )}

      {(role === 'NEEDLECASTER' || role === 'ADMIN') && (
        <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
          <Col xs={24} lg={12}>
            <Card
              title="Ожидают процедуры"
              extra={<Button size="small" onClick={() => router.push('/needlecast')}>Открыть</Button>}
            >
              <Table
                rowKey="id"
                size="small"
                pagination={false}
                loading={pendingCases.loading}
                dataSource={pendingCases.data ?? []}
                locale={{ emptyText: 'Нет кейсов' }}
                columns={[
                  { title: 'Кейс', dataIndex: 'code', render: (v: string) => <Tag color="purple">{v}</Tag> },
                  { title: 'Клиент', dataIndex: 'methUserName' },
                  { title: 'Стек', dataIndex: 'stackCode' },
                  {
                    title: '',
                    key: 'action',
                    render: (_: unknown, record: CaseDto) => (
                      <Button size="small" type="primary" onClick={() => router.push(`/needlecast/${record.id}`)}>
                        Открыть
                      </Button>
                    )
                  }
                ]}
              />
            </Card>
          </Col>
          <Col xs={24} lg={12}>
            <Card title="Перенос в процессе">
              <List
                loading={activeCases.loading}
                dataSource={activeCases.data ?? []}
                locale={{ emptyText: 'Нет активных процедур' }}
                renderItem={(item) => (
                  <List.Item
                    actions={[
                      <Button key="open" size="small" onClick={() => router.push(`/needlecast/${item.id}`)}>
                        Открыть
                      </Button>
                    ]}
                  >
                    <List.Item.Meta
                      title={
                        <Space>
                          <Tag color="processing">{item.code}</Tag>
                          <Text>{item.methUserName}</Text>
                        </Space>
                      }
                      description={`Начало: ${formatDateTime(item.startTime)} · Needlecaster: ${item.needlecasterName ?? '—'}`}
                    />
                  </List.Item>
                )}
              />
            </Card>
          </Col>
        </Row>
      )}

      {(role === 'PSYCHOSURGEON' || role === 'ADMIN') && (
        <Card
          title="Кейсы на валидации"
          style={{ marginTop: 16 }}
          extra={<Button size="small" onClick={() => router.push('/validation')}>Открыть валидацию</Button>}
        >
          <Table
            rowKey="id"
            size="small"
            loading={validation.loading}
            dataSource={validation.data ?? []}
            pagination={false}
            locale={{ emptyText: 'Нет кейсов на валидации' }}
            columns={[
              { title: 'Кейс', dataIndex: 'code', render: (v: string) => <Tag color="purple">{v}</Tag> },
              { title: 'Клиент', dataIndex: 'methUserName' },
              { title: 'Тело', dataIndex: 'sleeveCode' },
              { title: 'Статус', dataIndex: 'status', render: (v: string) => <Tag color={caseStatusMeta[v as CaseStatus].color}>{caseStatusMeta[v as CaseStatus].label}</Tag> },
              {
                title: '',
                key: 'action',
                render: (_: unknown, record: CaseDto) => (
                  <Button size="small" type="primary" onClick={() => router.push(`/validation/${record.id}`)}>
                    Осмотр
                  </Button>
                )
              }
            ]}
          />
        </Card>
      )}

      <Card title="Последние события" style={{ marginTop: 16 }}>
        <List
          loading={admin.loading}
          dataSource={stats?.recentAudit ?? []}
          locale={{ emptyText: 'Событий пока нет' }}
          renderItem={(log) => (
            <List.Item>
              <List.Item.Meta
                avatar={
                  log.action === 'INCIDENT' ? (
                    <WarningOutlined style={{ color: '#ff4d4f' }} />
                  ) : log.action === 'CERTIFY' ? (
                    <CheckCircleOutlined style={{ color: '#52c41a' }} />
                  ) : (
                    <ClockCircleOutlined style={{ color: '#722ed1' }} />
                  )
                }
                title={<Text>{log.details}</Text>}
                description={`${log.userName ?? 'Система'} · ${formatDateTime(log.createdAt)}`}
              />
            </List.Item>
          )}
        />
      </Card>
    </div>
  );
}
