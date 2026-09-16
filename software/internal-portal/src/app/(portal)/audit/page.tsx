'use client';

import { Button, Card, Table, Tag, Typography } from 'antd';
import type { TableProps } from 'antd';
import { formatDateTime } from '@/lib/format';
import { useApiData } from '@/lib/use-async';
import type { AuditLogDto } from '@/lib/types';

const { Title, Paragraph } = Typography;

const actionColors: Record<string, string> = {
  LOGIN: 'default',
  CREATE: 'blue',
  UPDATE: 'geekblue',
  DELETE: 'red',
  RESERVE: 'purple',
  INTAKE_ACCEPT: 'green',
  INTAKE_REJECT: 'red',
  CULTIVATION_ORDER: 'cyan',
  ORDER_CONFIRM: 'blue',
  NEEDLECAST_START: 'processing',
  NEEDLECAST_COMPLETE: 'success',
  INCIDENT: 'error',
  CHECKPOINT: 'geekblue',
  CERTIFY: 'green',
  ROLE_CHANGE: 'gold'
};

export default function AuditPage() {
  const logs = useApiData<AuditLogDto[]>('/audit');

  const columns: TableProps<AuditLogDto>['columns'] = [
    { title: 'Время', dataIndex: 'createdAt', width: 170, render: (v: string) => formatDateTime(v) },
    { title: 'Пользователь', dataIndex: 'userName', width: 180, render: (v: string | null) => v ?? '—' },
    {
      title: 'Действие',
      dataIndex: 'action',
      width: 200,
      render: (v: string) => <Tag color={actionColors[v] ?? 'default'}>{v}</Tag>
    },
    { title: 'Объект', key: 'entity', width: 150, render: (_: unknown, r) => `${r.entityType ?? '—'}${r.entityId ? ` #${r.entityId}` : ''}` },
    { title: 'Детали', dataIndex: 'details' }
  ];

  return (
    <div>
      <Title level={3} className="page-title">
        Журнал аудита
      </Title>
      <Paragraph className="page-subtitle">FR-012/FR-022: неизменяемый журнал операций в системе.</Paragraph>

      <Card>
        <Button onClick={() => logs.reload()} style={{ marginBottom: 16 }}>
          Обновить
        </Button>
        <Table
          rowKey="id"
          size="middle"
          loading={logs.loading}
          dataSource={logs.data ?? []}
          columns={columns}
          pagination={{ pageSize: 12, showSizeChanger: false }}
          scroll={{ x: 900 }}
        />
      </Card>
    </div>
  );
}
