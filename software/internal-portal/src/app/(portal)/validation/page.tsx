'use client';

import { Button, Card, Table, Tag, Typography } from 'antd';
import type { TableProps } from 'antd';
import { useRouter } from 'next/navigation';
import { formatDateTime } from '@/lib/format';
import { caseStatusMeta } from '@/lib/labels';
import { useApiData } from '@/lib/use-async';
import type { CaseDto, CaseStatus } from '@/lib/types';

const { Title, Paragraph } = Typography;

export default function ValidationPage() {
  const router = useRouter();
  const cases = useApiData<CaseDto[]>('/cases/validation');

  const columns: TableProps<CaseDto>['columns'] = [
    { title: 'Кейс', dataIndex: 'code', width: 100, render: (v: string) => <Tag color="purple">{v}</Tag> },
    { title: 'Клиент', dataIndex: 'methUserName', render: (v: string | null) => v ?? '—' },
    { title: 'Тело', dataIndex: 'sleeveCode', render: (v: string | null) => v ?? '—' },
    { title: 'Стек', dataIndex: 'stackCode', width: 100 },
    {
      title: 'Статус',
      dataIndex: 'status',
      width: 210,
      render: (v: CaseStatus) => <Tag color={caseStatusMeta[v].color}>{caseStatusMeta[v].label}</Tag>
    },
    { title: 'Завершение', dataIndex: 'endTime', width: 160, render: (v: string | null) => formatDateTime(v) },
    {
      title: '',
      key: 'action',
      width: 140,
      render: (_: unknown, record) => (
        <Button size="small" type="primary" onClick={() => router.push(`/validation/${record.id}`)}>
          Осмотр
        </Button>
      )
    }
  ];

  return (
    <div>
      <Title level={3} className="page-title">
        Валидация и сертификация
      </Title>
      <Paragraph className="page-subtitle">UC-04: осмотр клиента, чекпоинты и выдача сертификата.</Paragraph>

      <Card>
        <Button onClick={() => cases.reload()} style={{ marginBottom: 16 }}>
          Обновить
        </Button>
        <Table
          rowKey="id"
          size="middle"
          loading={cases.loading}
          dataSource={cases.data ?? []}
          columns={columns}
          pagination={{ pageSize: 8, showSizeChanger: false }}
          scroll={{ x: 1000 }}
        />
      </Card>
    </div>
  );
}
