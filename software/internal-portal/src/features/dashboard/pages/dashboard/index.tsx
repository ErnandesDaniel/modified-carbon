import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloudServerOutlined,
  ExperimentOutlined,
  SafetyCertificateOutlined,
  WarningOutlined,
} from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { Alert, Button, Card, Col, List, Row, Space, Statistic, Table, Tag, Typography } from "antd";
import type { TableProps } from "antd";
import { useSession } from "@/features/auth/model/useSession";
import {
  getAdminDashboardQueryOptions,
  getCasesQueryOptions,
  getOrdersQueryOptions,
  getSleevesQueryOptions,
  getValidationCasesQueryOptions,
} from "@/shared/api";
import type { CaseDto, OrderDto, SleeveDto } from "@/shared/api/dto";
import { formatDateTime } from "@/shared/lib/format";
import { caseStatusMeta, orderStatusMeta, sleeveStatusMeta } from "@/shared/lib/labels";
import { PageHeader, StatusTag } from "@/shared/ui";

const { Paragraph, Text } = Typography;

const DashboardPage = () => {
  const navigate = useNavigate();
  const { user } = useSession();
  const role = user?.role ?? "ADMIN";

  const isBroker = role === "SLEEVE_BROKER" || role === "ADMIN";
  const isNeedlecaster = role === "NEEDLECASTER" || role === "ADMIN";
  const isPsychosurgeon = role === "PSYCHOSURGEON" || role === "ADMIN";

  const admin = useQuery(getAdminDashboardQueryOptions());
  const intake = useQuery({ ...getSleevesQueryOptions({ status: "INTAKE" }), enabled: isBroker });
  const newOrders = useQuery({ ...getOrdersQueryOptions("NEW"), enabled: isBroker });
  const pendingCases = useQuery({ ...getCasesQueryOptions("PENDING"), enabled: isNeedlecaster });
  const activeCases = useQuery({ ...getCasesQueryOptions("IN_PROGRESS"), enabled: isNeedlecaster });
  const validation = useQuery({ ...getValidationCasesQueryOptions(), enabled: isPsychosurgeon });

  const stats = admin.data;

  const intakeColumns: TableProps<SleeveDto>["columns"] = [
    { title: "Тело", dataIndex: "code", render: (value: string) => <Tag color="purple">{value}</Tag> },
    { title: "Пол", dataIndex: "gender", render: (value: string) => (value === "MALE" ? "М" : "Ж") },
    { title: "Рост", dataIndex: "height" },
    {
      title: "Статус",
      dataIndex: "status",
      render: (value: SleeveDto["status"]) => <StatusTag meta={sleeveStatusMeta[value]} />,
    },
  ];

  const orderColumns: TableProps<OrderDto>["columns"] = [
    { title: "Заказ", dataIndex: "code", render: (value: string) => <Tag color="blue">{value}</Tag> },
    { title: "Клиент", dataIndex: "methUserName" },
    { title: "Тело", dataIndex: "sleeveCode", render: (value: string | null) => value ?? "—" },
    {
      title: "Статус",
      dataIndex: "status",
      render: (value: OrderDto["status"]) => <StatusTag meta={orderStatusMeta[value]} />,
    },
  ];

  const caseColumns: TableProps<CaseDto>["columns"] = [
    { title: "Кейс", dataIndex: "code", render: (value: string) => <Tag color="purple">{value}</Tag> },
    { title: "Клиент", dataIndex: "methUserName" },
    { title: "Стек", dataIndex: "stackCode", render: (value: string | null) => value ?? "—" },
    {
      title: "Статус",
      dataIndex: "status",
      render: (value: CaseDto["status"]) => <StatusTag meta={caseStatusMeta[value]} />,
    },
    {
      title: "",
      key: "action",
      render: (_: unknown, record: CaseDto) => (
        <Button
          size="small"
          type="primary"
          onClick={() => void navigate({ to: "/needlecast/$id", params: { id: String(record.id) } })}
        >
          Открыть
        </Button>
      ),
    },
  ];

  const validationColumns: TableProps<CaseDto>["columns"] = [
    { title: "Кейс", dataIndex: "code", render: (value: string) => <Tag color="purple">{value}</Tag> },
    { title: "Клиент", dataIndex: "methUserName" },
    { title: "Тело", dataIndex: "sleeveCode", render: (value: string | null) => value ?? "—" },
    {
      title: "Статус",
      dataIndex: "status",
      render: (value: CaseDto["status"]) => <StatusTag meta={caseStatusMeta[value]} />,
    },
    {
      title: "",
      key: "action",
      render: (_: unknown, record: CaseDto) => (
        <Button
          size="small"
          type="primary"
          onClick={() => void navigate({ to: "/validation/$id", params: { id: String(record.id) } })}
        >
          Осмотр
        </Button>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title={`Здравствуйте, ${user?.displayName ?? "сотрудник"}`}
        subtitle={`Сводка по клинике и рабочая очередь для роли «${role}».`}
      />

      {admin.isError ? (
        <Alert
          type="error"
          showIcon
          style={{ marginBottom: 16 }}
          message="Не удалось получить сводку"
          description="Проверьте, что backend доступен на http://localhost:3001."
        />
      ) : null}

      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={12} sm={6}>
          <Card loading={admin.isPending}>
            <Statistic
              title="Доступно тел"
              value={stats?.availableSleeves ?? 0}
              prefix={<CloudServerOutlined style={{ color: "#52c41a" }} />}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card loading={admin.isPending}>
            <Statistic
              title="Активных процедур"
              value={stats?.inProgressCases ?? 0}
              prefix={<ExperimentOutlined style={{ color: "#722ed1" }} />}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card loading={admin.isPending}>
            <Statistic
              title="Ожидают валидации"
              value={stats?.pendingValidation ?? 0}
              prefix={<SafetyCertificateOutlined style={{ color: "#faad14" }} />}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card loading={admin.isPending}>
            <Statistic
              title="Открытых инцидентов"
              value={stats?.openIncidents ?? 0}
              valueStyle={{ color: (stats?.openIncidents ?? 0) > 0 ? "#ff4d4f" : undefined }}
              prefix={<WarningOutlined style={{ color: "#ff4d4f" }} />}
            />
          </Card>
        </Col>
      </Row>

      {isBroker && (
        <Row gutter={[16, 16]}>
          <Col xs={24} lg={12}>
            <Card
              title="Приёмка тел"
              extra={
                <Button size="small" onClick={() => void navigate({ to: "/sleeves" })}>
                  Открыть каталог
                </Button>
              }
            >
              <Table
                rowKey="id"
                size="small"
                pagination={false}
                loading={intake.isPending}
                dataSource={intake.data ?? []}
                locale={{ emptyText: "Нет тел на приёмке" }}
                columns={intakeColumns}
              />
            </Card>
          </Col>
          <Col xs={24} lg={12}>
            <Card
              title="Новые заказы клиентов"
              extra={
                <Button size="small" onClick={() => void navigate({ to: "/orders" })}>
                  Открыть заказы
                </Button>
              }
            >
              <Table
                rowKey="id"
                size="small"
                pagination={false}
                loading={newOrders.isPending}
                dataSource={newOrders.data ?? []}
                locale={{ emptyText: "Нет новых заказов" }}
                columns={orderColumns}
              />
            </Card>
          </Col>
        </Row>
      )}

      {isNeedlecaster && (
        <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
          <Col xs={24} lg={12}>
            <Card
              title="Ожидают процедуры"
              extra={
                <Button size="small" onClick={() => void navigate({ to: "/needlecast" })}>
                  Открыть
                </Button>
              }
            >
              <Table
                rowKey="id"
                size="small"
                pagination={false}
                loading={pendingCases.isPending}
                dataSource={pendingCases.data ?? []}
                locale={{ emptyText: "Нет кейсов" }}
                columns={caseColumns}
              />
            </Card>
          </Col>
          <Col xs={24} lg={12}>
            <Card title="Перенос в процессе">
              <List
                loading={activeCases.isPending}
                dataSource={activeCases.data ?? []}
                locale={{ emptyText: "Нет активных процедур" }}
                renderItem={(item) => (
                  <List.Item
                    actions={[
                      <Button
                        key="open"
                        size="small"
                        onClick={() =>
                          void navigate({ to: "/needlecast/$id", params: { id: String(item.id) } })
                        }
                      >
                        Открыть
                      </Button>,
                    ]}
                  >
                    <List.Item.Meta
                      title={
                        <Space>
                          <Tag color="processing">{item.code}</Tag>
                          <Text>{item.methUserName}</Text>
                        </Space>
                      }
                      description={`Начало: ${formatDateTime(item.startTime)} · Needlecaster: ${
                        item.needlecasterName ?? "—"
                      }`}
                    />
                  </List.Item>
                )}
              />
            </Card>
          </Col>
        </Row>
      )}

      {isPsychosurgeon && (
        <Card
          title="Кейсы на валидации"
          style={{ marginTop: 16 }}
          extra={
            <Button size="small" onClick={() => void navigate({ to: "/validation" })}>
              Открыть валидацию
            </Button>
          }
        >
          <Table
            rowKey="id"
            size="small"
            loading={validation.isPending}
            dataSource={validation.data ?? []}
            pagination={false}
            locale={{ emptyText: "Нет кейсов на валидации" }}
            columns={validationColumns}
          />
        </Card>
      )}

      {role === "ADMIN" && (
        <Card title="Последние события" style={{ marginTop: 16 }}>
          <List
            loading={admin.isPending}
            dataSource={stats?.recentAudit ?? []}
            locale={{ emptyText: "Событий пока нет" }}
            renderItem={(log) => (
              <List.Item>
                <List.Item.Meta
                  avatar={
                    log.action === "INCIDENT" ? (
                      <WarningOutlined style={{ color: "#ff4d4f" }} />
                    ) : log.action === "CERTIFY" ? (
                      <CheckCircleOutlined style={{ color: "#52c41a" }} />
                    ) : (
                      <ClockCircleOutlined style={{ color: "#722ed1" }} />
                    )
                  }
                  title={<Text>{log.details}</Text>}
                  description={`${log.userName ?? "Система"} · ${formatDateTime(log.createdAt)}`}
                />
              </List.Item>
            )}
          />
        </Card>
      )}

      <Paragraph style={{ marginTop: 16, marginBottom: 0 }}>
        <Text type="secondary" style={{ fontSize: 12 }}>
          Данные обновляются автоматически. Статусы окрашены по типу операции.
        </Text>
      </Paragraph>
    </div>
  );
};

export default DashboardPage;
