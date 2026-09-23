import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { Button, Card, Select, Space, Table, Tag, Typography } from "antd";
import type { TableProps } from "antd";
import { useState } from "react";
import { getCasesQueryOptions } from "@/shared/api";
import type { CaseDto, CaseStatus } from "@/shared/api/dto";
import { formatDateTime } from "@/shared/lib/format";
import { caseStatusMeta } from "@/shared/lib/labels";
import { PageHeader, StatusTag } from "@/shared/ui";

const { Paragraph } = Typography;

const NeedlecastListPage = () => {
  const navigate = useNavigate();
  const [status, setStatus] = useState<CaseStatus | undefined>();
  const cases = useQuery(getCasesQueryOptions(status));

  const columns: TableProps<CaseDto>["columns"] = [
    { title: "Кейс", dataIndex: "code", width: 100, render: (value: string) => <Tag color="purple">{value}</Tag> },
    { title: "Клиент", dataIndex: "methUserName", render: (value: string | null) => value ?? "—" },
    { title: "Тело", dataIndex: "sleeveCode", render: (value: string | null) => value ?? "—" },
    { title: "Стек", dataIndex: "stackCode", width: 100, render: (value: string | null) => value ?? "—" },
    {
      title: "Статус",
      dataIndex: "status",
      width: 210,
      render: (value: CaseStatus) => <StatusTag meta={caseStatusMeta[value]} />,
    },
    { title: "Начало", dataIndex: "startTime", width: 160, render: (value: string | null) => formatDateTime(value) },
    { title: "Needlecaster", dataIndex: "needlecasterName", render: (value: string | null) => value ?? "—" },
    {
      title: "",
      key: "action",
      width: 120,
      render: (_: unknown, record) => (
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

  return (
    <div>
      <PageHeader title="Процедура Needlecast" subtitle="UC-03: проведение переноса сознания и фиксация результата." />

      <Card>
        <Space style={{ marginBottom: 16 }}>
          <Select
            placeholder="Все статусы"
            allowClear
            style={{ width: 240 }}
            value={status}
            onChange={(value) => setStatus(value)}
            options={Object.entries(caseStatusMeta).map(([value, meta]) => ({
              value,
              label: meta.label,
            }))}
          />
          <Button onClick={() => void cases.refetch()}>Обновить</Button>
        </Space>

        {cases.isError ? (
          <Paragraph type="danger">Не удалось загрузить кейсы. Проверьте backend.</Paragraph>
        ) : null}

        <Table
          rowKey="id"
          size="middle"
          loading={cases.isPending}
          dataSource={cases.data ?? []}
          columns={columns}
          pagination={{ pageSize: 8, showSizeChanger: false }}
          scroll={{ x: 1050 }}
        />
      </Card>
    </div>
  );
};

export default NeedlecastListPage;
