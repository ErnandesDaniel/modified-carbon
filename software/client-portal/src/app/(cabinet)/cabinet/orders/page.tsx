'use client';

import { Button, Card, Table, Tag, Typography } from 'antd';
import type { TableProps } from 'antd';
import { useRouter } from 'next/navigation';
import { formatDateTime } from '@/lib/format';
import { genderMeta, orderStatusMeta } from '@/lib/labels';
import { useApiData } from '@/lib/use-async';
import type { OrderDto } from '@/lib/types';

const { Title, Paragraph } = Typography;

export default function OrdersPage() {
  const router = useRouter();
  const orders = useApiData<OrderDto[]>('/orders/mine');

  const columns: TableProps<OrderDto>['columns'] = [
    { title: 'Заказ', dataIndex: 'code', render: (v: string) => <Tag color="blue">{v}</Tag> },
    { title: 'Тело', dataIndex: 'sleeveCode', render: (v: string | null) => v ?? '—' },
    {
      title: 'Пол',
      dataIndex: 'gender',
      render: (v: OrderDto['gender']) => (v ? <Tag color={genderMeta[v].color}>{genderMeta[v].label}</Tag> : '—')
    },
    { title: 'Рост', dataIndex: 'height', render: (v: number | null) => (v ? `${v} см` : '—') },
    { title: 'Вес', dataIndex: 'weight', render: (v: number | null) => (v ? `${v} кг` : '—') },
    { title: 'Возраст', dataIndex: 'age', render: (v: number | null) => (v ? `${v} лет` : '—') },
    {
      title: 'Статус',
      dataIndex: 'status',
      render: (v: OrderDto['status']) => <Tag color={orderStatusMeta[v].color}>{orderStatusMeta[v].label}</Tag>
    },
    { title: 'Создан', dataIndex: 'createdAt', render: (v: string) => formatDateTime(v) }
  ];

  return (
    <div>
      <Title level={3} style={{ marginBottom: 4 }}>
        Мои заказы
      </Title>
      <Paragraph type="secondary">Статус ваших заказов на подбор и культивирование тела.</Paragraph>

      <Card>
        <Button onClick={() => orders.reload()} style={{ marginBottom: 16 }}>
          Обновить
        </Button>
        <Table
          rowKey="id"
          size="middle"
          loading={orders.loading}
          dataSource={orders.data ?? []}
          columns={columns}
          pagination={{ pageSize: 8, showSizeChanger: false }}
          locale={{
            emptyText: (
              <span>
                Заказов нет.{' '}
                <a onClick={() => router.push('/cabinet/catalog')}>Перейти в каталог тел</a>
              </span>
            )
          }}
        />
      </Card>
    </div>
  );
}
