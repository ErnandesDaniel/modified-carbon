import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { App, Button, Card, Select, Space, Table, Tag, Typography } from "antd";
import type { TableProps } from "antd";
import { useState } from "react";
import {
  awaitOrderBody,
  cancelOrder,
  confirmOrder,
  getOrdersQueryOptions,
} from "@/shared/api";
import type { OrderDto, OrderStatus } from "@/shared/api/dto";
import { formatDateTime } from "@/shared/lib/format";
import { genderMeta, orderStatusMeta } from "@/shared/lib/labels";
import { PageHeader, StatusTag } from "@/shared/ui";

const { Paragraph } = Typography;

const OrdersPage = () => {
  const { message, modal } = App.useApp();
  const queryClient = useQueryClient();
  const [status, setStatus] = useState<OrderStatus | undefined>();

  const orders = useQuery(getOrdersQueryOptions(status));
  const invalidateOrders = () => queryClient.invalidateQueries({ queryKey: ["orders"] });

  const confirmMutation = useMutation({
    mutationFn: (id: number) => confirmOrder(id),
    onSuccess: () => {
      message.success("Заказ подтверждён");
      void invalidateOrders();
    },
    onError: () => message.error("Не удалось подтвердить заказ"),
  });

  const awaitBodyMutation = useMutation({
    mutationFn: (id: number) => awaitOrderBody(id),
    onSuccess: () => {
      message.success("Заказ переведён в ожидание тела");
      void invalidateOrders();
    },
    onError: () => message.error("Не удалось обновить заказ"),
  });

  const cancelMutation = useMutation({
    mutationFn: (id: number) => cancelOrder(id),
    onSuccess: () => {
      message.success("Заказ отменён");
      void invalidateOrders();
    },
    onError: () => message.error("Не удалось отменить заказ"),
  });

  const columns: TableProps<OrderDto>["columns"] = [
    { title: "Заказ", dataIndex: "code", width: 110, render: (value: string) => <Tag color="blue">{value}</Tag> },
    { title: "Клиент", dataIndex: "methUserName", render: (value: string | null) => value ?? "—" },
    { title: "Тело", dataIndex: "sleeveCode", render: (value: string | null) => value ?? "— (нет тела)" },
    {
      title: "Параметры",
      key: "params",
      render: (_: unknown, record) =>
        `${record.gender ? genderMeta[record.gender].label : "—"}, ${record.height ?? "—"} см, ${
          record.weight ?? "—"
        } кг, ${record.age ?? "—"} лет`,
    },
    {
      title: "Статус",
      dataIndex: "status",
      width: 170,
      render: (value: OrderStatus) => <StatusTag meta={orderStatusMeta[value]} />,
    },
    { title: "Создан", dataIndex: "createdAt", width: 160, render: (value: string) => formatDateTime(value) },
    {
      title: "Действия",
      key: "actions",
      width: 300,
      render: (_: unknown, record) => (
        <Space wrap>
          {record.status === "NEW" && record.sleeveId && (
            <Button
              size="small"
              type="primary"
              onClick={() =>
                modal.confirm({
                  title: `Подтвердить заказ ${record.code}?`,
                  content: `Тело ${record.sleeveCode} будет закреплено за ${
                    record.methUserName ?? "клиентом"
                  } и создан кейс needlecast.`,
                  okText: "Подтвердить",
                  cancelText: "Отмена",
                  onOk: () => confirmMutation.mutateAsync(record.id),
                })
              }
            >
              Подтвердить
            </Button>
          )}
          {record.status === "NEW" && !record.sleeveId && (
            <Button size="small" onClick={() => awaitBodyMutation.mutate(record.id)}>
              Ожидает тело
            </Button>
          )}
          {(record.status === "NEW" || record.status === "AWAITING_BODY") && (
            <Button
              size="small"
              danger
              onClick={() =>
                modal.confirm({
                  title: `Отменить заказ ${record.code}?`,
                  okText: "Отменить заказ",
                  okButtonProps: { danger: true },
                  cancelText: "Назад",
                  onOk: () => cancelMutation.mutateAsync(record.id),
                })
              }
            >
              Отменить
            </Button>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div>
      <PageHeader title="Заказы клиентов" subtitle="UC-01: обработка заказов на тело и резервирование." />

      <Card>
        <Space style={{ marginBottom: 16 }}>
          <Select
            placeholder="Все статусы"
            allowClear
            style={{ width: 220 }}
            value={status}
            onChange={(value) => setStatus(value)}
            options={Object.entries(orderStatusMeta).map(([value, meta]) => ({
              value,
              label: meta.label,
            }))}
          />
          <Button onClick={() => void orders.refetch()}>Обновить</Button>
        </Space>

        {orders.isError ? (
          <Paragraph type="danger">Не удалось загрузить заказы. Проверьте backend.</Paragraph>
        ) : null}

        <Table
          rowKey="id"
          size="middle"
          loading={orders.isPending}
          dataSource={orders.data ?? []}
          columns={columns}
          pagination={{ pageSize: 8, showSizeChanger: false }}
          scroll={{ x: 1050 }}
        />
      </Card>
    </div>
  );
};

export default OrdersPage;
