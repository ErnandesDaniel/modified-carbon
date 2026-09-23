import { DownloadOutlined } from "@ant-design/icons";
import { Alert, App, Button, Card, Table, Tag, Typography } from "antd";
import type { TableProps } from "antd";
import { useState } from "react";
import { useMyCertificates } from "@/shared/api";
import type { CertificateDto } from "@/shared/api";
import { certificateStatusMeta } from "@/shared/config";
import { formatDateTime } from "@/shared/lib";
import { downloadCertificatePdf } from "./certificate-pdf";

const { Title, Paragraph } = Typography;

const CertificatesPage = () => {
  const { message } = App.useApp();
  const { data, isLoading, isError, error, refetch } = useMyCertificates();
  const [downloadingId, setDownloadingId] = useState<number | null>(null);

  const download = async (cert: CertificateDto) => {
    setDownloadingId(cert.id);
    try {
      await downloadCertificatePdf(cert);
      message.success(`Сертификат ${cert.code} сохранён`);
    } catch {
      message.error("Не удалось сформировать PDF");
    } finally {
      setDownloadingId(null);
    }
  };

  const columns: TableProps<CertificateDto>["columns"] = [
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
    {
      title: "",
      key: "download",
      width: 160,
      render: (_: unknown, record) => (
        <Button
          icon={<DownloadOutlined />}
          size="small"
          disabled={record.status !== "READY"}
          loading={downloadingId === record.id}
          onClick={() => void download(record)}
        >
          Скачать PDF
        </Button>
      ),
    },
  ];

  return (
    <div>
      <Title level={3} className="scms-page-title">
        Сертификаты совместимости
      </Title>
      <Paragraph type="secondary">FR-010: документы, подтверждающие успешный перенос сознания.</Paragraph>

      <Alert
        className="scms-section"
        type="info"
        showIcon
        message="Проверка подлинности"
        description="Каждый сертификат содержит уникальный код проверки и QR-код. PDF можно скачать после завершения валидации."
      />

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
          locale={{ emptyText: "Сертификатов пока нет" }}
        />
      </Card>
    </div>
  );
};

export default CertificatesPage;
