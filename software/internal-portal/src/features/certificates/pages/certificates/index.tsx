import { useQuery } from "@tanstack/react-query";
import { Button, Card, Table, Tag, Typography } from "antd";
import type { TableProps } from "antd";
import { getCertificatesQueryOptions } from "@/shared/api";
import type { CertificateDto } from "@/shared/api/dto";
import { formatDateTime } from "@/shared/lib/format";
import { certificateStatusMeta } from "@/shared/lib/labels";
import { PageHeader, StatusTag } from "@/shared/ui";

const { Paragraph } = Typography;

const CertificatesPage = () => {
  const certificates = useQuery(getCertificatesQueryOptions());

  const columns: TableProps<CertificateDto>["columns"] = [
    {
      title: "Сертификат",
      dataIndex: "code",
      render: (value: string) => <Tag color="purple">{value}</Tag>,
    },
    { title: "Кейс", dataIndex: "caseCode", render: (value: string | null) => value ?? "—" },
    { title: "Клиент", dataIndex: "methUserName", render: (value: string | null) => value ?? "—" },
    {
      title: "Код проверки",
      dataIndex: "verificationCode",
      render: (value: string) => <Tag>{value}</Tag>,
    },
    {
      title: "Статус",
      dataIndex: "status",
      render: (value: CertificateDto["status"]) => <StatusTag meta={certificateStatusMeta[value]} />,
    },
    { title: "Выдан", dataIndex: "issuedAt", render: (value: string) => formatDateTime(value) },
  ];

  return (
    <div>
      <PageHeader
        title="Сертификаты совместимости"
        subtitle="FR-010: выданные сертификаты с кодом проверки."
        extra={<Button onClick={() => void certificates.refetch()}>Обновить</Button>}
      />

      {certificates.isError ? (
        <Paragraph type="danger">Не удалось загрузить сертификаты. Проверьте backend.</Paragraph>
      ) : null}

      <Card>
        <Table
          rowKey="id"
          size="middle"
          loading={certificates.isPending}
          dataSource={certificates.data ?? []}
          columns={columns}
          pagination={{ pageSize: 8, showSizeChanger: false }}
          scroll={{ x: 900 }}
        />
      </Card>
    </div>
  );
};

export default CertificatesPage;
