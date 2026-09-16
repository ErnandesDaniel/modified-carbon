'use client';

import { App, Button, Card, Select, Space, Table, Tag, Typography } from 'antd';
import type { TableProps } from 'antd';
import { useState } from 'react';
import { apiSend } from '@/lib/api';
import { formatDateTime } from '@/lib/format';
import { genderMeta, orderStatusMeta } from '@/lib/labels';
import { useApiData } from '@/lib/use-async';
import type { OrderDto, OrderStatus } from '@/lib/types';

const { Title, Paragraph } = Typography;

export default function OrdersPage() {
  const { message, modal } = App.useApp();
  const [status, setStatus] = useState<OrderStatus | undefined>();
  const [refreshKey, setRefreshKey] = useState(0);
  const orders = useApiData<OrderDto[]>(`/orders${status ? `?status=${status}` : ''}`);

  const reload = () => {
    void orders.reload();
    setRefreshKey((k) => k + 1);
  };

  const confirmOrder = (order: OrderDto) => {
    modal.confirm({
      title: `Подтвердить заказ ${order.code}?`,
      content: `Тело ${order.sleeveCode} будет зарезервировано за ${order.methUserName ?? 'клиентом'} и создан кейс needlecast.`,
      onOk: async () => {
        try {
          await apiSend('POST', `/orders/${order.id}/confirm`);
          message.success('Заказ подтверждён');
          reload();
        } catch {
          message.error('Не удалось подтвердить заказ');
        }
      }
    });
  };

  const awaitBody = async (order: OrderDto) => {
    try {
      await apiSend('POST', `/orders/${order.id}/await-body`);
      message.success('Заказ переведён в ожидание тела');
      reload();
    } catch {
      message.error('Не удалось обновить заказ');
    }
  };

  const cancelOrder = (order: OrderDto) => {
    modal.confirm({
      title: `Отменить заказ ${order.code}?`,
      okButtonProps: { danger: true },
      onOk: async () => {
        await apiSend('POST', `/orders/${order.id}/cancel`);
        message.success('Заказ отменён');
        reload();
      }
    });
  };

  const columns: TableProps<OrderDto>['columns'] = [
    { title: 'Заказ', dataIndex: 'code', width: 110, render: (v: string) => <Tag color="blue">{v}</Tag> },
    { title: 'Клиент', dataIndex: 'methUserName', render: (v: string | null) => v ?? '—' },
    { title: 'Тело', dataIndex: 'sleeveCode', render: (v: string | null) => v ?? '— (нет тела)' },
    {
      title: 'Параметры',
      key: 'params',
      render: (_: unknown, r) =>
        `${r.gender ? genderMeta[r.gender].label : '—'}, ${r.height ?? '—'} см, ${r.weight ?? '—'} кг, ${r.age ?? '—'} лет`
    },
    {
      title: 'Статус',
      dataIndex: 'status',
      width: 160,
      render: (v: OrderStatus) => <Tag color={orderStatusMeta[v].color}>{orderStatusMeta[v].label}</Tag>
    },
    { title: 'Создан', dataIndex: 'createdAt', width: 160, render: (v: string) => formatDateTime(v) },
    {
      title: 'Действия',
      key: 'actions',
      width: 300,
      render: (_: unknown, record) => (
        <Space wrap>
          {record.status === 'NEW' && record.sleeveId && (
            <Button size="small" type="primary" onClick={() => confirmOrder(record)}>
              Подтвердить
            </Button>
          )}
          {record.status === 'NEW' && !record.sleeveId && (
            <Button size="small" onClick={() => awaitBody(record)}>
              Ожидает тело
            </Button>
          )}
          {(record.status === 'NEW' || record.status === 'AWAITING_BODY') && (
            <Button size="small" danger onClick={() => cancelOrder(record)}>
              Отменить
            </Button>
          )}
        </Space>
      )
    }
  ];

  return (
    <div>
      <Title level={3} className="page-title">
        Заказы клиентов
      </Title>
      <Paragraph className="page-subtitle">UC-01: обработка заказов на тело и резервирование.</Paragraph>

      <Card>
        <Space style={{ marginBottom: 16 }}>
          <Select
            placeholder="Все статусы"
            allowClear
            style={{ width: 220 }}
            value={status}
            onChange={(value) => setStatus(value)}
            options={Object.entries(orderStatusMeta).map(([value, meta]) => ({ value, label: meta.label }))}
          />
          <Button onClick={reload} key={refreshKey}>
            Обновить
          </Button>
        </Space>

        <Table
          rowKey="id"
          size="middle"
          loading={orders.loading}
          dataSource={orders.data ?? []}
          columns={columns}
          pagination={{ pageSize: 8, showSizeChanger: false }}
          scroll={{ x: 1000 }}
        />
      </Card>
    </div>
  );
}
