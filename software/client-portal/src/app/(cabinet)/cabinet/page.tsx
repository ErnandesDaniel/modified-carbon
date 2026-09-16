'use client';

import {
  CheckCircleOutlined,
  CloudServerOutlined,
  ExperimentOutlined,
  ProfileOutlined,
  SafetyCertificateOutlined,
  WarningOutlined
} from '@ant-design/icons';
import { Alert, Card, Col, Descriptions, List, Row, Space, Statistic, Steps, Table, Tag, Typography } from 'antd';
import type { TableProps } from 'antd';
import { useRouter } from 'next/navigation';
import { formatDate, formatDateTime } from '@/lib/format';
import { caseStatusMeta, certificateStatusMeta, orderStatusMeta, stageLabels, stageOrder } from '@/lib/labels';
import { useApiData } from '@/lib/use-async';
import { useSession } from '@/components/session-provider';
import type { CaseDto, CertificateDto, ClientDashboardDto, OrderDto } from '@/lib/types';

const { Title, Paragraph, Text } = Typography;

export default function CabinetPage() {
  const { user } = useSession();
  const router = useRouter();
  const { data, loading } = useApiData<ClientDashboardDto>('/dashboard/client');

  if (!user) {
    return null;
  }

  const stage = data?.currentStage ?? 'NO_ORDER';
  const isProblem = stage === 'INCIDENT' || stage === 'CORRECTIVE';
  const currentIndex = isProblem ? stageOrder.length - 1 : stageOrder.indexOf(stage);

  const certificateColumns: TableProps<CertificateDto>['columns'] = [
    { title: 'Сертификат', dataIndex: 'code', render: (v: string) => <Tag color="purple">{v}</Tag> },
    { title: 'Кейс', dataIndex: 'caseCode' },
    { title: 'Код проверки', dataIndex: 'verificationCode', render: (v: string) => <Tag>{v}</Tag> },
    {
      title: 'Статус',
      dataIndex: 'status',
      render: (v: CertificateDto['status']) => (
        <Tag color={certificateStatusMeta[v].color}>{certificateStatusMeta[v].label}</Tag>
      )
    },
    { title: 'Выдан', dataIndex: 'issuedAt', render: (v: string) => formatDateTime(v) }
  ];

  return (
    <div>
      <Title level={3} style={{ marginBottom: 4 }}>
        Здравствуйте, {user.displayName}
      </Title>
      <Paragraph type="secondary">Персональный таймлайн вашего кейса и документы.</Paragraph>

      {isProblem && (
        <Alert
          style={{ marginBottom: 16 }}
          type="error"
          showIcon
          icon={<WarningOutlined />}
          message="Требуется корректирующая процедура"
          description="Специалист клиники свяжется с вами. Выпуск временно заблокирован."
        />
      )}

      <Card title="Этап кейса" loading={loading} style={{ marginBottom: 16 }}>
        <Steps
          current={currentIndex < 0 ? 0 : currentIndex}
          status={isProblem ? 'error' : stage === 'COMPLETED' ? 'finish' : 'process'}
          size="small"
          items={stageOrder.map((key) => ({ title: stageLabels[key] }))}
        />
      </Card>

      <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
        <Col xs={12} sm={6}>
          <Card>
            <Statistic
              title="Мои заказы"
              value={data?.orders.length ?? 0}
              prefix={<ProfileOutlined />}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card>
            <Statistic
              title="Мои стеки"
              value={data?.stacks.length ?? 0}
              prefix={<CloudServerOutlined style={{ color: '#722ed1' }} />}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card>
            <Statistic
              title="Кейсы"
              value={data?.cases.length ?? 0}
              prefix={<ExperimentOutlined style={{ color: '#1677ff' }} />}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card>
            <Statistic
              title="Сертификаты"
              value={data?.certificates.length ?? 0}
              prefix={<SafetyCertificateOutlined style={{ color: '#52c41a' }} />}
            />
          </Card>
        </Col>
      </Row>

      <Card title="Мои заказы" style={{ marginBottom: 16 }}>
        <Table
          rowKey="id"
          size="small"
          loading={loading}
          pagination={false}
          dataSource={data?.orders ?? []}
          locale={{ emptyText: 'Заказов пока нет — оформите в каталоге тел' }}
          columns={[
            { title: 'Заказ', dataIndex: 'code', render: (v: string) => <Tag color="blue">{v}</Tag> },
            { title: 'Тело', dataIndex: 'sleeveCode', render: (v: string | null) => v ?? '—' },
            {
              title: 'Параметры',
              key: 'params',
              render: (_: unknown, r: OrderDto) => `${r.height ?? '—'} см, ${r.weight ?? '—'} кг, ${r.age ?? '—'} лет`
            },
            {
              title: 'Статус',
              dataIndex: 'status',
              render: (v: OrderDto['status']) => <Tag color={orderStatusMeta[v].color}>{orderStatusMeta[v].label}</Tag>
            },
            { title: 'Создан', dataIndex: 'createdAt', render: (v: string) => formatDateTime(v) }
          ]}
        />
      </Card>

      <Card title="История переносов" style={{ marginBottom: 16 }}>
        <List
          loading={loading}
          dataSource={data?.cases ?? []}
          locale={{ emptyText: 'Кейсов пока нет' }}
          renderItem={(item: CaseDto) => (
            <List.Item>
              <List.Item.Meta
                title={
                  <Space>
                    <Tag color="purple">{item.code}</Tag>
                    <Tag color={caseStatusMeta[item.status].color}>{caseStatusMeta[item.status].label}</Tag>
                    <Text>Тело: {item.sleeveCode ?? '—'}</Text>
                  </Space>
                }
                description={`Стек: ${item.stackCode ?? '—'} · Needlecaster: ${item.needlecasterName ?? '—'} · Начало: ${formatDateTime(item.startTime)}`}
              />
            </List.Item>
          )}
        />
      </Card>

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={14}>
          <Card
            title="Сертификаты"
            extra={<a onClick={() => router.push('/cabinet/certificates')}>Все сертификаты</a>}
          >
            <Table
              rowKey="id"
              size="small"
              loading={loading}
              pagination={false}
              dataSource={data?.certificates ?? []}
              columns={certificateColumns}
              locale={{ emptyText: 'Сертификатов пока нет' }}
            />
          </Card>
        </Col>
        <Col xs={24} lg={10}>
          <Card title="Мои стеки">
            <List
              loading={loading}
              dataSource={data?.stacks ?? []}
              locale={{ emptyText: 'Стеки не найдены' }}
              renderItem={(stack) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={<CloudServerOutlined style={{ color: '#722ed1' }} />}
                    title={<Text>{stack.code}</Text>}
                    description={`Локация: ${stack.location ?? '—'} · Последнее извлечение: ${formatDate(stack.lastExtractedAt)}`}
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
}
