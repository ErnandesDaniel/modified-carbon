'use client';

import { Button, Card, Table, Tag, Typography } from 'antd';
import type { TableProps } from 'antd';
import { formatDateTime } from '@/lib/format';
import { certificateStatusMeta } from '@/lib/labels';
import { useApiData } from '@/lib/use-async';
import type { CertificateDto } from '@/lib/types';

const { Title, Paragraph } = Typography;

export default function CertificatesPage() {
  const certificates = useApiData<CertificateDto[]>('/certificates');

  const columns: TableProps<CertificateDto>['columns'] = [
    { title: 'Сертификат', dataIndex: 'code', render: (v: string) => <Tag color="purple">{v}</Tag> },
    { title: 'Кейс', dataIndex: 'caseCode', render: (v: string | null) => v ?? '—' },
    { title: 'Клиент', dataIndex: 'methUserName', render: (v: string | null) => v ?? '—' },
    { title: 'Код проверки', dataIndex: 'verificationCode', render: (v: string) => <Tag>{v}</Tag> },
    {
      title: 'Статус',
      dataIndex: 'status',
      render: (v: CertificateDto['status']) => (
        <Tag color={certificateStatusMeta[v].color}>{certificateStatusMeta[v].label}</Tag>
      )
    },
    { title: 'Выдан', dataIndex: 'issuedAt', render: (v: string) => formatDateTime(v) }
  ];

  return (
    <div>
      <Title level={3} className="page-title">
        Сертификаты совместимости
      </Title>
      <Paragraph className="page-subtitle">FR-010: выданные PDF-сертификаты с QR-кодом проверки.</Paragraph>

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
        />
      </Card>
    </div>
  );
}
