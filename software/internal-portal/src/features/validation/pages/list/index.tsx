import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { Button, Card, Table, Tag, Typography } from "antd";
import type { TableProps } from "antd";
import { getValidationCasesQueryOptions } from "@/shared/api";
import type { CaseDto, CaseStatus } from "@/shared/api/dto";
import { formatDateTime } from "@/shared/lib/format";
import { caseStatusMeta } from "@/shared/lib/labels";
import { PageHeader, StatusTag } from "@/shared/ui";

const { Paragraph } = Typography;

const ValidationListPage = () => {
  const navigate = useNavigate();
  const cases = useQuery(getValidationCasesQueryOptions());

  const columns: TableProps<CaseDto>["columns"] = [
    { title: "Кейс", dataIndex: "code", width: 100, render: (value: string) => <Tag color="purple">{value}</Tag> },
    { title: "Клиент", dataIndex: "methUserName", render: (value: string | null) => value ?? "—" },
    { title: "Тело", dataIndex: "sleeveCode", render: (value: string | null) => value ?? "—" },
    { title: "Стек", dataIndex: "stackCode", width: 100, render: (value: string | null) => value ?? "—" },
    {
      title: "Статус",
      dataIndex: "status",
      width: 220,
      render: (value: CaseStatus) => <StatusTag meta={caseStatusMeta[value]} />,
    },
    { title: "Завершение", dataIndex: "endTime", width: 160, render: (value: string | null) => formatDateTime(value) },
    {
      title: "",
      key: "action",
      width: 140,
      render: (_: unknown, record) => (
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
        title="Валидация и сертификация"
        subtitle="UC-04: осмотр клиента, чекпоинты и выдача сертификата."
        extra={<Button onClick={() => void cases.refetch()}>Обновить</Button>}
      />

      {cases.isError ? (
        <Paragraph type="danger">Не удалось загрузить кейсы. Проверьте backend.</Paragraph>
      ) : null}

      <Card>
        <Table
          rowKey="id"
          size="middle"
          loading={cases.isPending}
          dataSource={cases.data ?? []}
          columns={columns}
          pagination={{ pageSize: 8, showSizeChanger: false }}
          scroll={{ x: 1000 }}
        />
      </Card>
    </div>
  );
};

export default ValidationListPage;
