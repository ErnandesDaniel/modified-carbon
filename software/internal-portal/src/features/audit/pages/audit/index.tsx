import { useQuery } from "@tanstack/react-query";
import { Button, Card, Table, Tag, Typography } from "antd";
import type { TableProps } from "antd";
import { getAuditQueryOptions } from "@/shared/api";
import type { AuditLogDto } from "@/shared/api/dto";
import { formatDateTime } from "@/shared/lib/format";
import { auditActionMeta } from "@/shared/lib/labels";
import { PageHeader } from "@/shared/ui";

const { Paragraph } = Typography;

const AuditPage = () => {
  const logs = useQuery(getAuditQueryOptions());

  const columns: TableProps<AuditLogDto>["columns"] = [
    { title: "Время", dataIndex: "createdAt", width: 170, render: (value: string) => formatDateTime(value) },
    { title: "Пользователь", dataIndex: "userName", width: 180, render: (value: string | null) => value ?? "—" },
    {
      title: "Действие",
      dataIndex: "action",
      width: 220,
      render: (value: AuditLogDto["action"]) => {
        const meta = auditActionMeta[value];
        return <Tag color={meta?.color ?? "default"}>{meta?.label ?? value}</Tag>;
      },
    },
    {
      title: "Объект",
      key: "entity",
      width: 160,
      render: (_: unknown, record) =>
        `${record.entityType ?? "—"}${record.entityId ? ` #${record.entityId}` : ""}`,
    },
    { title: "Детали", dataIndex: "details", render: (value: string | null) => value ?? "—" },
  ];

  return (
    <div>
      <PageHeader
        title="Журнал аудита"
        subtitle="FR-012/FR-022: неизменяемый журнал операций в системе."
        extra={<Button onClick={() => void logs.refetch()}>Обновить</Button>}
      />

      {logs.isError ? (
        <Paragraph type="danger">Не удалось загрузить журнал. Проверьте backend.</Paragraph>
      ) : null}

      <Card>
        <Table
          rowKey="id"
          size="middle"
          loading={logs.isPending}
          dataSource={logs.data ?? []}
          columns={columns}
          pagination={{ pageSize: 12, showSizeChanger: false }}
          scroll={{ x: 950 }}
        />
      </Card>
    </div>
  );
};

export default AuditPage;
