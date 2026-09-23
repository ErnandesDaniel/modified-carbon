import { WarningOutlined } from "@ant-design/icons";
import { Alert, Button, Card, List, Space, Steps, Table, Tag, Typography } from "antd";
import type { TableProps } from "antd";
import { useNavigate } from "@tanstack/react-router";
import { useAuth } from "@/app/providers/providers/auth-provider/useAuth";
import { useClientDashboard } from "@/shared/api";
import type { CaseDto, CertificateDto, OrderDto } from "@/shared/api";
import {
  caseStatusMeta,
  certificateStatusMeta,
  orderStatusMeta,
  stageLabels,
  stageOrder,
} from "@/shared/config";
import { formatDateTime } from "@/shared/lib";

const { Title, Paragraph } = Typography;

const DashboardPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { data, isLoading, isError, error, refetch } = useClientDashboard();

  const stage = data?.currentStage ?? "NO_ORDER";
  const isProblem = stage === "INCIDENT" || stage === "CORRECTIVE";
  const stageIndex = stageOrder.indexOf(stage as (typeof stageOrder)[number]);
  const currentIndex = isProblem ? stageOrder.length - 1 : stageIndex < 0 ? 0 : stageIndex;

  const certificateColumns: TableProps<CertificateDto>["columns"] = [
    { title: "Сертификат", dataIndex: "code", render: (value: string) => <Tag color="purple">{value}</Tag> },
    { title: "Кейс", dataIndex: "caseCode", render: (value: string | null) => value ?? "—" },
    { title: "Код проверки", dataIndex: "verificationCode", render: (value: string) => <Tag>{value}</Tag> },
    {
      title: "Статус",
      dataIndex: "status",
      render: (value: CertificateDto["status"]) => (
        <Tag color={certificateStatusMeta[value].color}>{certificateStatusMeta[value].label}</Tag>
      ),
    },
    { title: "Выдан", dataIndex: "issuedAt", render: (value: string) => formatDateTime(value) },
  ];

  if (isError) {
    return (
      <Alert
        type="error"
        showIcon
        message="Не удалось загрузить кабинет"
        description={error?.message}
        action={<Button onClick={() => void refetch()}>Повторить</Button>}
      />
    );
  }

  return (
    <div>
      <Title level={3} className="scms-page-title">
        Здравствуйте, {user?.displayName ?? "клиент"}
      </Title>
      <Paragraph type="secondary">Персональный таймлайн вашего кейса и документы.</Paragraph>

      {isProblem && (
        <Alert
          className="scms-section"
          type="error"
          showIcon
          icon={<WarningOutlined />}
          message="Требуется корректирующая процедура"
          description="Специалист клиники свяжется с вами. Выпуск временно заблокирован."
        />
      )}

      <Card title="Этап кейса" loading={isLoading} className="scms-section">
        <Steps
          current={currentIndex}
          status={isProblem ? "error" : stage === "COMPLETED" ? "finish" : "process"}
          size="small"
          items={stageOrder.map((key) => ({ title: stageLabels[key] }))}
        />
      </Card>

      <Card title="Мои заказы" className="scms-section">
        <Table
          rowKey="id"
          size="small"
          loading={isLoading}
          pagination={false}
          dataSource={data?.orders ?? []}
          locale={{ emptyText: "Заказов пока нет — оформите в каталоге тел" }}
          columns={[
            { title: "Заказ", dataIndex: "code", render: (value: string) => <Tag color="blue">{value}</Tag> },
            { title: "Тело", dataIndex: "sleeveCode", render: (value: string | null) => value ?? "—" },
            {
              title: "Параметры",
              key: "params",
              render: (_: unknown, record: OrderDto) =>
                `${record.height ?? "—"} см, ${record.weight ?? "—"} кг, ${record.age ?? "—"} лет`,
            },
            {
              title: "Статус",
              dataIndex: "status",
              render: (value: OrderDto["status"]) => (
                <Tag color={orderStatusMeta[value].color}>{orderStatusMeta[value].label}</Tag>
              ),
            },
            { title: "Создан", dataIndex: "createdAt", render: (value: string) => formatDateTime(value) },
          ]}
        />
      </Card>

      <Card title="История переносов" className="scms-section">
        <List
          loading={isLoading}
          dataSource={data?.cases ?? []}
          locale={{ emptyText: "Кейсов пока нет" }}
          renderItem={(item: CaseDto) => (
            <List.Item>
              <List.Item.Meta
                title={
                  <Space>
                    <Tag color="purple">{item.code}</Tag>
                    <Tag color={caseStatusMeta[item.status].color}>{caseStatusMeta[item.status].label}</Tag>
                    <span>Тело: {item.sleeveCode ?? "—"}</span>
                  </Space>
                }
                description={`Стек: ${item.stackCode ?? "—"} · Needlecaster: ${
                  item.needlecasterName ?? "—"
                } · Начало: ${formatDateTime(item.startTime)}`}
              />
            </List.Item>
          )}
        />
      </Card>

      <Card
        title="Сертификаты"
        extra={
          <Button type="link" onClick={() => void navigate({ to: "/cabinet/certificates" })}>
            Все сертификаты
          </Button>
        }
      >
        <Table
          rowKey="id"
          size="small"
          loading={isLoading}
          pagination={false}
          dataSource={data?.certificates ?? []}
          columns={certificateColumns}
          locale={{ emptyText: "Сертификатов пока нет" }}
        />
      </Card>
    </div>
  );
};

export default DashboardPage;
