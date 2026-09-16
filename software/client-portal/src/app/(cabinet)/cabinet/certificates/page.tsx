'use client';

import { DownloadOutlined } from '@ant-design/icons';
import { Alert, Button, Card, Table, Tag, Typography } from 'antd';
import type { TableProps } from 'antd';
import { formatDateTime } from '@/lib/format';
import { certificateStatusMeta } from '@/lib/labels';
import { useApiData } from '@/lib/use-async';
import type { CertificateDto } from '@/lib/types';

const { Title, Paragraph } = Typography;

export default function CertificatesPage() {
  const certificates = useApiData<CertificateDto[]>('/certificates/mine');

  const columns: TableProps<CertificateDto>['columns'] = [
    { title: 'Сертификат', dataIndex: 'code', render: (v: string) => <Tag color="purple">{v}</Tag> },
    { title: 'Кейс', dataIndex: 'caseCode', render: (v: string | null) => v ?? '—' },
    { title: 'Код проверки', dataIndex: 'verificationCode', render: (v: string) => <Tag>{v}</Tag> },
    {
      title: 'Статус',
      dataIndex: 'status',
      render: (v: CertificateDto['status']) => (
        <Tag color={certificateStatusMeta[v].color}>{certificateStatusMeta[v].label}</Tag>
      )
    },
    { title: 'Выдан', dataIndex: 'issuedAt', render: (v: string) => formatDateTime(v) },
    {
      title: '',
      key: 'download',
      width: 160,
      render: (_: unknown, record) => (
        <Button
          icon={<DownloadOutlined />}
          size="small"
          disabled={record.status !== 'READY'}
          onClick={() => window.print()}
        >
          Скачать PDF
        </Button>
      )
    }
  ];

  return (
    <div>
      <Title level={3} style={{ marginBottom: 4 }}>
        Сертификаты совместимости
      </Title>
      <Paragraph type="secondary">FR-010: документы, подтверждающие успешный перенос сознания.</Paragraph>

      <Alert
        style={{ marginBottom: 16 }}
        type="info"
        showIcon
        message="Проверка подлинности"
        description="Каждый сертификат содержит уникальный код проверки и QR-код. PDF можно скачать после завершения валидации."
      />

      <Card>
        <Button onClick={() => certificates.reload()} style={{ marginBottom: 16 }}>
          Обновить
        </Button>
        <Table
          rowKey="id"
          size="middle"
          loading={certificates.loading}
          dataSource={certificates.data ?? []}
          columns={columns}
          pagination={{ pageSize: 8, showSizeChanger: false }}
          locale={{ emptyText: 'Сертификатов пока нет' }}
        />
      </Card>
    </div>
  );
}
