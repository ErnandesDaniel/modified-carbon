import { PlusOutlined, ReloadOutlined } from "@ant-design/icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  App,
  Button,
  Card,
  Col,
  Form,
  Input,
  InputNumber,
  Modal,
  Radio,
  Row,
  Select,
  Space,
  Table,
  Tag,
  Typography,
} from "antd";
import type { TableProps } from "antd";
import { useMemo, useState } from "react";
import {
  acceptIntake,
  getArchivesQueryOptions,
  getSleevesQueryOptions,
  getUsersQueryOptions,
  orderCultivation,
  rejectIntake,
  releaseSleeve,
  reserveSleeve,
} from "@/shared/api";
import type { SleevesFilter } from "@/shared/api";
import type {
  CultivationRequestDto,
  SleeveDto,
  SleeveGender,
  SleeveStatus,
} from "@/shared/api/dto";
import { formatDate } from "@/shared/lib/format";
import { genderMeta, sleeveStatusMeta } from "@/shared/lib/labels";
import { PageHeader, StatusTag } from "@/shared/ui";

const { Paragraph } = Typography;

interface FilterDraft {
  gender?: SleeveGender;
  status?: SleeveStatus;
  search?: string;
}

const SleevesPage = () => {
  const { message, modal } = App.useApp();
  const queryClient = useQueryClient();
  const [form] = Form.useForm<CultivationRequestDto>();

  const [draft, setDraft] = useState<FilterDraft>({});
  const [filter, setFilter] = useState<SleevesFilter>({});
  const [cultivationOpen, setCultivationOpen] = useState(false);
  const [reserveSleeveTarget, setReserveSleeveTarget] = useState<SleeveDto | null>(null);
  const [reserveUserId, setReserveUserId] = useState<number | undefined>();

  const sleeves = useQuery(getSleevesQueryOptions(filter));
  const archives = useQuery(getArchivesQueryOptions());
  const users = useQuery(getUsersQueryOptions());

  const clients = useMemo(
    () => (users.data ?? []).filter((user) => user.role === "METH"),
    [users.data],
  );

  const invalidateSleeves = () => queryClient.invalidateQueries({ queryKey: ["sleeves"] });

  const cultivationMutation = useMutation({
    mutationFn: (values: CultivationRequestDto) => orderCultivation(values),
    onSuccess: () => {
      message.success("Заказ на культивирование создан");
      setCultivationOpen(false);
      form.resetFields();
      void invalidateSleeves();
    },
    onError: () => message.error("Не удалось создать заказ на культивирование"),
  });

  const intakeMutation = useMutation({
    mutationFn: ({ id, action }: { id: number; action: "accept" | "reject" }) =>
      action === "accept" ? acceptIntake(id) : rejectIntake(id),
    onSuccess: (_data, variables) => {
      message.success(variables.action === "accept" ? "Тело принято в резерв" : "Тело отклонено");
      void invalidateSleeves();
    },
    onError: () => message.error("Не удалось выполнить действие"),
  });

  const releaseMutation = useMutation({
    mutationFn: (id: number) => releaseSleeve(id),
    onSuccess: () => {
      message.success("Резерв снят");
      void invalidateSleeves();
    },
    onError: () => message.error("Не удалось снять резерв"),
  });

  const reserveMutation = useMutation({
    mutationFn: ({ id, userId }: { id: number; userId: number }) => reserveSleeve(id, userId),
    onSuccess: () => {
      message.success("Тело зарезервировано");
      setReserveSleeveTarget(null);
      setReserveUserId(undefined);
      void invalidateSleeves();
    },
    onError: () => message.error("Не удалось зарезервировать тело"),
  });

  const applyFilters = () => {
    setFilter({
      gender: draft.gender,
      status: draft.status,
      search: draft.search?.trim() ? draft.search.trim() : undefined,
    });
  };

  const resetFilters = () => {
    setDraft({});
    setFilter({});
  };

  const confirmReserve = () => {
    if (!reserveSleeveTarget || !reserveUserId) {
      message.warning("Выберите клиента");
      return;
    }
    reserveMutation.mutate({ id: reserveSleeveTarget.id, userId: reserveUserId });
  };

  const columns: TableProps<SleeveDto>["columns"] = [
    { title: "ID", dataIndex: "code", width: 110, render: (value: string) => <Tag color="purple">{value}</Tag> },
    {
      title: "Пол",
      dataIndex: "gender",
      width: 70,
      render: (value: SleeveGender) => <StatusTag meta={genderMeta[value]} />,
    },
    { title: "Рост", dataIndex: "height", width: 80, render: (value: number) => `${value} см` },
    { title: "Вес", dataIndex: "weight", width: 80, render: (value: number) => `${value} кг` },
    { title: "Возраст", dataIndex: "age", width: 90, render: (value: number) => `${value} лет` },
    { title: "Архив", dataIndex: "geneticArchiveName", render: (value: string | null) => value ?? "—" },
    {
      title: "Статус",
      dataIndex: "status",
      width: 160,
      render: (value: SleeveDto["status"]) => <StatusTag meta={sleeveStatusMeta[value]} />,
    },
    {
      title: "Культивация",
      key: "cultivation",
      width: 180,
      render: (_: unknown, record) =>
        record.status === "CULTIVATING"
          ? `${record.cultivationStagePercent}% · до ${formatDate(record.plannedReadyAt)}`
          : "—",
    },
    {
      title: "Действия",
      key: "actions",
      width: 250,
      render: (_: unknown, record) => (
        <Space wrap>
          {record.status === "INTAKE" && (
            <>
              <Button
                size="small"
                type="primary"
                loading={intakeMutation.isPending}
                onClick={() => intakeMutation.mutate({ id: record.id, action: "accept" })}
              >
                Принять
              </Button>
              <Button
                size="small"
                danger
                loading={intakeMutation.isPending}
                onClick={() => intakeMutation.mutate({ id: record.id, action: "reject" })}
              >
                Отклонить
              </Button>
            </>
          )}
          {record.status === "AVAILABLE" && (
            <Button size="small" type="primary" onClick={() => setReserveSleeveTarget(record)}>
              Зарезервировать
            </Button>
          )}
          {record.status === "RESERVED" && (
            <>
              <Tag>За: {record.reservedForUserName ?? "—"}</Tag>
              <Button
                size="small"
                onClick={() =>
                  modal.confirm({
                    title: `Снять резерв с тела ${record.code}?`,
                    okText: "Снять",
                    cancelText: "Отмена",
                    onOk: () => releaseMutation.mutateAsync(record.id),
                  })
                }
              >
                Снять резерв
              </Button>
            </>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Каталог тел"
        subtitle="UC-02: управление резервом, культивирование и приёмка тел."
        extra={
          <Button type="primary" icon={<PlusOutlined />} onClick={() => setCultivationOpen(true)}>
            Культивирование
          </Button>
        }
      />

      <Card style={{ marginBottom: 16 }}>
        <Row gutter={[12, 12]} align="bottom">
          <Col xs={12} sm={4}>
            <Select
              placeholder="Пол"
              allowClear
              style={{ width: "100%" }}
              value={draft.gender}
              onChange={(value) => setDraft((prev) => ({ ...prev, gender: value }))}
              options={[
                { value: "MALE", label: "Мужской" },
                { value: "FEMALE", label: "Женский" },
              ]}
            />
          </Col>
          <Col xs={12} sm={4}>
            <Select
              placeholder="Статус"
              allowClear
              style={{ width: "100%" }}
              value={draft.status}
              onChange={(value) => setDraft((prev) => ({ ...prev, status: value }))}
              options={Object.entries(sleeveStatusMeta).map(([value, meta]) => ({
                value,
                label: meta.label,
              }))}
            />
          </Col>
          <Col xs={24} sm={6}>
            <Input.Search
              placeholder="Поиск по ID / донору"
              value={draft.search}
              onChange={(event) => setDraft((prev) => ({ ...prev, search: event.target.value }))}
              onSearch={applyFilters}
            />
          </Col>
          <Col xs={24} sm={10}>
            <Space wrap>
              <Button type="primary" onClick={applyFilters}>
                Найти
              </Button>
              <Button onClick={resetFilters}>Сброс</Button>
              <Button icon={<ReloadOutlined />} onClick={() => void sleeves.refetch()} />
            </Space>
          </Col>
        </Row>
      </Card>

      <Card>
        <Table
          rowKey="id"
          size="middle"
          loading={sleeves.isPending}
          dataSource={sleeves.data ?? []}
          columns={columns}
          pagination={{ pageSize: 8, showSizeChanger: false }}
          scroll={{ x: 1200 }}
        />
      </Card>

      <Modal
        title="Заказать культивирование тела"
        open={cultivationOpen}
        onOk={() => form.submit()}
        confirmLoading={cultivationMutation.isPending}
        onCancel={() => setCultivationOpen(false)}
        okText="Создать заказ"
        cancelText="Отмена"
        destroyOnHidden
      >
        <Form<CultivationRequestDto>
          form={form}
          layout="vertical"
          initialValues={{ gender: "FEMALE", height: 175, weight: 70, age: 28 }}
          onFinish={(values) => cultivationMutation.mutate(values)}
        >
          <Form.Item name="geneticArchiveId" label="Генетический архив" rules={[{ required: true }]}>
            <Select
              placeholder="Выберите архив"
              loading={archives.isPending}
              options={(archives.data ?? []).map((archive) => ({
                value: archive.id,
                label: archive.name,
              }))}
            />
          </Form.Item>
          <Form.Item name="gender" label="Пол" rules={[{ required: true }]}>
            <Radio.Group>
              <Radio value="MALE">М</Radio>
              <Radio value="FEMALE">Ж</Radio>
            </Radio.Group>
          </Form.Item>
          <Row gutter={12}>
            <Col span={8}>
              <Form.Item name="height" label="Рост, см" rules={[{ required: true }]}>
                <InputNumber min={140} max={220} style={{ width: "100%" }} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="weight" label="Вес, кг" rules={[{ required: true }]}>
                <InputNumber min={40} max={150} style={{ width: "100%" }} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="age" label="Возраст" rules={[{ required: true }]}>
                <InputNumber min={18} max={60} style={{ width: "100%" }} />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item name="notes" label="Примечания">
            <Input.TextArea rows={2} placeholder="Например: премиум-заказ" />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title={`Резервирование тела ${reserveSleeveTarget?.code ?? ""}`}
        open={Boolean(reserveSleeveTarget)}
        onOk={confirmReserve}
        confirmLoading={reserveMutation.isPending}
        onCancel={() => setReserveSleeveTarget(null)}
        okText="Зарезервировать"
        cancelText="Отмена"
      >
        <Paragraph>Выберите клиента (Meth), за которым закрепляется тело:</Paragraph>
        <Select
          style={{ width: "100%" }}
          placeholder="Клиент"
          value={reserveUserId}
          onChange={setReserveUserId}
          options={clients.map((client) => ({
            value: client.id,
            label: client.displayName ?? `#${client.id}`,
          }))}
          showSearch
          optionFilterProp="label"
        />
      </Modal>
    </div>
  );
};

export default SleevesPage;
