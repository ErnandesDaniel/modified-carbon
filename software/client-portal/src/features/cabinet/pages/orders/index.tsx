import { Button, Card, Table, Tag, Typography } from "antd";
import type { TableProps } from "antd";
import { useNavigate } from "@tanstack/react-router";
import { useMyOrders } from "@/shared/api";
import type { OrderDto } from "@/shared/api";
import { genderMeta, orderStatusMeta } from "@/shared/config";
import { formatDateTime } from "@/shared/lib";

const { Title, Paragraph } = Typography;

const OrdersPage = () => {
  const navigate = useNavigate();
  const { data, isLoading, isError, error, refetch } = useMyOrders();

  const columns: TableProps<OrderDto>["columns"] = [
    { title: "Заказ", dataIndex: "code", render: (value: string) => <Tag color="blue">{value}</Tag> },
    { title: "Тело", dataIndex: "sleeveCode", render: (value: string | null) => value ?? "—" },
    {
      title: "Пол",
      dataIndex: "gender",
      render: (value: OrderDto["gender"]) =>
        value ? <Tag color={genderMeta[value].color}>{genderMeta[value].label}</Tag> : "—",
    },
    { title: "Рост", dataIndex: "height", render: (value: number | null) => (value ? `${value} см` : "—") },
    { title: "Вес", dataIndex: "weight", render: (value: number | null) => (value ? `${value} кг` : "—") },
    { title: "Возраст", dataIndex: "age", render: (value: number | null) => (value ? `${value} лет` : "—") },
    {
      title: "Статус",
      dataIndex: "status",
      render: (value: OrderDto["status"]) => (
        <Tag color={orderStatusMeta[value].color}>{orderStatusMeta[value].label}</Tag>
      ),
    },
    { title: "Создан", dataIndex: "createdAt", render: (value: string) => formatDateTime(value) },
  ];

  return (
    <div>
      <Title level={3} className="scms-page-title">
        Мои заказы
      </Title>
      <Paragraph type="secondary">Статус ваших заказов на подбор и культивирование тела.</Paragraph>

      {isError && (
        <Card className="scms-section">
          <Typography.Text type="danger">{error?.message}</Typography.Text>
        </Card>
      )}

      <Card>
        <Button onClick={() => void refetch()} style={{ marginBottom: 16 }}>
          Обновить
        </Button>
        <Table
          rowKey="id"
          size="middle"
          loading={isLoading}
          dataSource={data ?? []}
          columns={columns}
          pagination={{ pageSize: 8, showSizeChanger: false }}
          locale={{
            emptyText: (
              <span>
                Заказов нет.{" "}
                <Button type="link" style={{ padding: 0 }} onClick={() => void navigate({ to: "/cabinet/catalog" })}>
                  Перейти в каталог тел
                </Button>
              </span>
            ),
          }}
        />
      </Card>
    </div>
  );
};

export default OrdersPage;
