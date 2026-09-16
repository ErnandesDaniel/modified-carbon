'use client';

import { App, Button, Card, Select, Space, Table, Tag, Typography } from 'antd';
import type { TableProps } from 'antd';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { formatDateTime } from '@/lib/format';
import { caseStatusMeta } from '@/lib/labels';
import { useApiData } from '@/lib/use-async';
import type { CaseDto, CaseStatus } from '@/lib/types';

const { Title, Paragraph } = Typography;

export default function NeedlecastPage() {
  const router = useRouter();
  const [status, setStatus] = useState<CaseStatus | undefined>();
  const cases = useApiData<CaseDto[]>(`/cases${status ? `?status=${status}` : ''}`);

  const columns: TableProps<CaseDto>['columns'] = [
    { title: 'Кейс', dataIndex: 'code', width: 100, render: (v: string) => <Tag color="purple">{v}</Tag> },
    { title: 'Клиент', dataIndex: 'methUserName', render: (v: string | null) => v ?? '—' },
    { title: 'Тело', dataIndex: 'sleeveCode', render: (v: string | null) => v ?? '—' },
    { title: 'Стек', dataIndex: 'stackCode', width: 100 },
    {
      title: 'Статус',
      dataIndex: 'status',
      width: 200,
      render: (v: CaseStatus) => <Tag color={caseStatusMeta[v].color}>{caseStatusMeta[v].label}</Tag>
    },
    { title: 'Начало', dataIndex: 'startTime', width: 160, render: (v: string | null) => formatDateTime(v) },
    { title: 'Needlecaster', dataIndex: 'needlecasterName', render: (v: string | null) => v ?? '—' },
    {
      title: '',
      key: 'action',
      width: 120,
      render: (_: unknown, record) => (
        <Button size="small" type="primary" onClick={() => router.push(`/needlecast/${record.id}`)}>
          Открыть
        </Button>
      )
    }
  ];

  return (
    <div>
      <Title level={3} className="page-title">
        Процедура Needlecast
      </Title>
      <Paragraph className="page-subtitle">UC-03: проведение переноса сознания и фиксация результата.</Paragraph>

      <Card>
        <Space style={{ marginBottom: 16 }}>
          <Select
            placeholder="Все статусы"
            allowClear
            style={{ width: 240 }}
            value={status}
            onChange={(value) => setStatus(value)}
            options={Object.entries(caseStatusMeta).map(([value, meta]) => ({ value, label: meta.label }))}
          />
          <Button onClick={() => cases.reload()}>Обновить</Button>
        </Space>

        <Table
          rowKey="id"
          size="middle"
          loading={cases.loading}
          dataSource={cases.data ?? []}
          columns={columns}
          pagination={{ pageSize: 8, showSizeChanger: false }}
          scroll={{ x: 1050 }}
        />
      </Card>
    </div>
  );
}
