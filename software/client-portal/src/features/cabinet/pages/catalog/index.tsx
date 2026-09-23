import { App, Button, Card, Col, Form, InputNumber, Radio, Row, Space, Table, Tag, Typography } from "antd";
import type { TableProps } from "antd";
import { useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useCreateOrder, useSleeves } from "@/shared/api";
import type { SleeveDto, SleeveGender, SleevesSearchParams } from "@/shared/api";
import { genderMeta, genderOptions } from "@/shared/config";

const { Title, Paragraph } = Typography;

interface FiltersState {
  gender?: SleeveGender;
  heightMin?: number;
  heightMax?: number;
  ageMin?: number;
  ageMax?: number;
}

const EMPTY_FILTERS: FiltersState = {};

const CatalogPage = () => {
  const navigate = useNavigate();
  const { message } = App.useApp();
  const [filters, setFilters] = useState<FiltersState>(EMPTY_FILTERS);
  const [orderingId, setOrderingId] = useState<number | null>(null);

  const params = useMemo<SleevesSearchParams>(
    () => ({
      availableOnly: true,
      gender: filters.gender,
      heightMin: filters.heightMin,
      heightMax: filters.heightMax,
      ageMin: filters.ageMin,
      ageMax: filters.ageMax,
    }),
    [filters],
  );

  const { data, isLoading, isError, error, refetch } = useSleeves(params);
  const { mutateAsync: createOrder } = useCreateOrder();

  const order = async (sleeve: SleeveDto) => {
    setOrderingId(sleeve.id);
    try {
      await createOrder({
        sleeveId: sleeve.id,
        gender: sleeve.gender,
        height: sleeve.height,
        weight: sleeve.weight,
        age: sleeve.age,
        geneticArchiveId: sleeve.geneticArchiveId,
      });
      message.success(`Заказ на тело ${sleeve.code} создан. Sleeve Broker обработает его.`);
      await navigate({ to: "/cabinet/orders" });
    } catch (err) {
      message.error(err instanceof Error ? err.message : "Не удалось создать заказ");
    } finally {
      setOrderingId(null);
    }
  };

  const columns: TableProps<SleeveDto>["columns"] = [
    { title: "Код", dataIndex: "code", render: (value: string) => <Tag color="purple">{value}</Tag> },
    {
      title: "Пол",
      dataIndex: "gender",
      render: (value: SleeveGender) => <Tag color={genderMeta[value].color}>{genderMeta[value].label}</Tag>,
    },
    { title: "Рост", dataIndex: "height", render: (value: number) => `${value} см` },
    { title: "Вес", dataIndex: "weight", render: (value: number) => `${value} кг` },
    { title: "Возраст", dataIndex: "age", render: (value: number) => `${value} лет` },
    { title: "Генетический архив", dataIndex: "geneticArchiveName", render: (value: string | null) => value ?? "—" },
    {
      title: "",
      key: "action",
      width: 130,
      render: (_: unknown, record) => (
        <Button
          type="primary"
          size="small"
          loading={orderingId === record.id}
          onClick={() => void order(record)}
        >
          Заказать
        </Button>
      ),
    },
  ];

  return (
    <div>
      <Title level={3} className="scms-page-title">
        Каталог тел
      </Title>
      <Paragraph type="secondary">UC-01: выберите подходящее тело и оформите заказ.</Paragraph>

      <Card className="scms-section">
        <Form layout="vertical">
          <Row gutter={[12, 12]} align="bottom">
            <Col xs={24} sm={5}>
              <Form.Item label="Пол" style={{ marginBottom: 0 }}>
                <Radio.Group
                  value={filters.gender}
                  onChange={(event) =>
                    setFilters((prev) => ({ ...prev, gender: event.target.value as SleeveGender | undefined }))
                  }
                  options={genderOptions}
                />
              </Form.Item>
            </Col>
            <Col xs={12} sm={3}>
              <Form.Item label="Рост от" style={{ marginBottom: 0 }}>
                <InputNumber
                  style={{ width: "100%" }}
                  value={filters.heightMin}
                  onChange={(value) => setFilters((prev) => ({ ...prev, heightMin: value ?? undefined }))}
                />
              </Form.Item>
            </Col>
            <Col xs={12} sm={3}>
              <Form.Item label="Рост до" style={{ marginBottom: 0 }}>
                <InputNumber
                  style={{ width: "100%" }}
                  value={filters.heightMax}
                  onChange={(value) => setFilters((prev) => ({ ...prev, heightMax: value ?? undefined }))}
                />
              </Form.Item>
            </Col>
            <Col xs={12} sm={3}>
              <Form.Item label="Возраст от" style={{ marginBottom: 0 }}>
                <InputNumber
                  style={{ width: "100%" }}
                  value={filters.ageMin}
                  onChange={(value) => setFilters((prev) => ({ ...prev, ageMin: value ?? undefined }))}
                />
              </Form.Item>
            </Col>
            <Col xs={12} sm={3}>
              <Form.Item label="Возраст до" style={{ marginBottom: 0 }}>
                <InputNumber
                  style={{ width: "100%" }}
                  value={filters.ageMax}
                  onChange={(value) => setFilters((prev) => ({ ...prev, ageMax: value ?? undefined }))}
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={7}>
              <Space>
                <Button type="primary" onClick={() => void refetch()}>
                  Найти
                </Button>
                <Button onClick={() => setFilters(EMPTY_FILTERS)}>Сброс</Button>
              </Space>
            </Col>
          </Row>
        </Form>
      </Card>

      {isError && (
        <Card className="scms-section">
          <Typography.Text type="danger">{error?.message}</Typography.Text>
        </Card>
      )}

      <Card>
        <Table
          rowKey="id"
          size="middle"
          loading={isLoading}
          dataSource={data ?? []}
          columns={columns}
          pagination={{ pageSize: 8, showSizeChanger: false }}
          locale={{ emptyText: "Нет доступных тел по заданным фильтрам" }}
        />
      </Card>
    </div>
  );
};

export default CatalogPage;
