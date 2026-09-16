'use client';

import { App, Card, Select, Table, Tag, Typography } from 'antd';
import type { TableProps } from 'antd';
import { apiSend } from '@/lib/api';
import { roleMeta } from '@/lib/labels';
import { useApiData } from '@/lib/use-async';
import type { AppRole, UserDto } from '@/lib/types';

const { Title, Paragraph } = Typography;

export default function UsersPage() {
  const { message } = App.useApp();
  const users = useApiData<UserDto[]>('/user');

  const changeRole = async (id: number, role: AppRole) => {
    try {
      await apiSend('PATCH', `/user/${id}`, { role });
      message.success('Роль обновлена');
      users.reload();
    } catch {
      message.error('Не удалось обновить роль');
    }
  };

  const columns: TableProps<UserDto>['columns'] = [
    { title: 'ID', dataIndex: 'id', width: 80 },
    { title: 'Имя', dataIndex: 'displayName', render: (v: string | null) => v ?? '—' },
    { title: 'Email', dataIndex: 'email', render: (v: string | null) => v ?? '—' },
    {
      title: 'Текущая роль',
      dataIndex: 'role',
      width: 180,
      render: (v: AppRole) => <Tag color={roleMeta[v].color}>{roleMeta[v].label}</Tag>
    },
    {
      title: 'Назначить роль',
      key: 'change',
      width: 220,
      render: (_: unknown, record) => (
        <Select
          style={{ width: '100%' }}
          value={record.role}
          onChange={(value) => changeRole(record.id, value)}
          options={Object.entries(roleMeta).map(([value, meta]) => ({ value, label: meta.label }))}
        />
      )
    }
  ];

  return (
    <div>
      <Title level={3} className="page-title">
        Пользователи и роли
      </Title>
      <Paragraph className="page-subtitle">FR-015: RBAC — управление учётными записями и ролями.</Paragraph>

      <Card>
        <Table
          rowKey="id"
          size="middle"
          loading={users.loading}
          dataSource={users.data ?? []}
          columns={columns}
          pagination={{ pageSize: 10, showSizeChanger: false }}
        />
      </Card>
    </div>
  );
}
