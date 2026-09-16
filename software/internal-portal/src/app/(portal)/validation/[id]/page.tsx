'use client';

import { ArrowLeftOutlined, CheckCircleOutlined, WarningOutlined } from '@ant-design/icons';
import {
  Alert,
  App,
  Button,
  Card,
  Descriptions,
  Input,
  Modal,
  Progress,
  Radio,
  Result,
  Select,
  Space,
  Tag,
  Typography
} from 'antd';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { apiGet, apiSend } from '@/lib/api';
import { formatDateTime } from '@/lib/format';
import { caseStatusMeta, checkpointCategoryMeta, incidentTypeMeta } from '@/lib/labels';
import { useApiData } from '@/lib/use-async';
import type { CaseDto, CertificateDto, CheckpointDto, CheckpointStatus, IncidentType } from '@/lib/types';

const { Title, Paragraph, Text } = Typography;

export default function ValidationDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { message } = App.useApp();
  const [complicationOpen, setComplicationOpen] = useState(false);
  const [incidentType, setIncidentType] = useState<IncidentType>('STACK_SHOCK');
  const [incidentNote, setIncidentNote] = useState('');
  const [certificate, setCertificate] = useState<CertificateDto | null>(null);

  const { data: item, loading, reload: reloadCase } = useApiData<CaseDto>(`/cases/${params.id}`);
  const { data: checkpoints, reload: reloadCheckpoints } = useApiData<CheckpointDto[]>(
    `/cases/${params.id}/checkpoints`
  );

  useEffect(() => {
    if (item?.status === 'COMPLETED') {
      apiGet<CertificateDto>(`/certificates/case/${params.id}`)
        .then(setCertificate)
        .catch(() => setCertificate(null));
    }
  }, [item?.status, params.id]);

  if (!loading && !item) {
    return <Result status="404" title="Кейс не найден" />;
  }

  const list = checkpoints ?? [];
  const passed = list.filter((c) => c.status === 'PASSED').length;
  const failed = list.filter((c) => c.status === 'FAILED').length;
  const percent = list.length ? Math.round((passed / list.length) * 100) : 0;
  const allPassed = list.length > 0 && passed === list.length && failed === 0;

  const mark = async (checkpoint: CheckpointDto, status: CheckpointStatus) => {
    try {
      await apiSend('PATCH', `/checkpoints/${checkpoint.id}`, { status });
      reloadCheckpoints();
    } catch {
      message.error('Не удалось обновить чекпоинт');
    }
  };

  const confirm = async () => {
    try {
      const cert = await apiSend<CertificateDto>('POST', `/cases/${params.id}/confirm`);
      setCertificate(cert);
      message.success('Клиент сертифицирован, PDF-сертификат доступен клиенту');
      reloadCase();
    } catch {
      message.error('Сертификация невозможна: есть непройденные чекпоинты');
    }
  };

  const reportComplication = async () => {
    try {
      await apiSend('POST', `/cases/${params.id}/complications`, {
        type: incidentType,
        description: incidentNote
      });
      message.error('Осложнение зафиксировано, выпуск клиента заблокирован');
      setComplicationOpen(false);
      reloadCase();
    } catch {
      message.error('Не удалось зафиксировать осложнение');
    }
  };

  return (
    <div>
      <Button icon={<ArrowLeftOutlined />} onClick={() => router.push('/validation')} style={{ marginBottom: 16 }}>
        Назад
      </Button>

      <Title level={3} className="page-title">
        Осмотр и сертификация {item?.code}
      </Title>
      <Paragraph className="page-subtitle">UC-04: ExamineAndCertify</Paragraph>

      <Card loading={loading} style={{ marginBottom: 16 }}>
        {item && (
          <Descriptions bordered column={{ xs: 1, sm: 2 }} size="small">
            <Descriptions.Item label="Клиент">{item.methUserName ?? '—'}</Descriptions.Item>
            <Descriptions.Item label="Кейс">
              <Tag color="purple">{item.code}</Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Кортикальный стек">{item.stackCode ?? '—'}</Descriptions.Item>
            <Descriptions.Item label="Тело (sleeve)">{item.sleeveCode}</Descriptions.Item>
            <Descriptions.Item label="Статус">
              <Tag color={caseStatusMeta[item.status].color}>{caseStatusMeta[item.status].label}</Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Завершение переноса">{formatDateTime(item.endTime)}</Descriptions.Item>
          </Descriptions>
        )}
      </Card>

      <Card title="Чек-лист осмотра" style={{ marginBottom: 16 }}>
        <Progress
          percent={percent}
          status={failed > 0 ? 'exception' : allPassed ? 'success' : 'active'}
          strokeColor="#722ed1"
          style={{ marginBottom: 16 }}
        />
        <Space direction="vertical" style={{ width: '100%' }} size={12}>
          {list.map((checkpoint) => (
            <Card key={checkpoint.id} size="small" style={{ background: '#fafafa' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
                <div style={{ maxWidth: 520 }}>
                  <Space style={{ marginBottom: 4 }}>
                    <Tag color={checkpointCategoryMeta[checkpoint.category].color}>
                      {checkpointCategoryMeta[checkpoint.category].label}
                    </Tag>
                    {checkpoint.required && <Tag color="red">Обязательный</Tag>}
                  </Space>
                  <div style={{ fontWeight: 600 }}>{checkpoint.label}</div>
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    {checkpoint.description}
                  </Text>
                </div>
                <Radio.Group
                  value={checkpoint.status}
                  onChange={(event) => mark(checkpoint, event.target.value as CheckpointStatus)}
                  disabled={item?.status === 'COMPLETED' || item?.status === 'CORRECTIVE'}
                >
                  <Radio.Button value="PASSED">Пройден</Radio.Button>
                  <Radio.Button value="FAILED">Провал</Radio.Button>
                </Radio.Group>
              </div>
            </Card>
          ))}
        </Space>
      </Card>

      <Space>
        <Button
          type="primary"
          icon={<CheckCircleOutlined />}
          disabled={!allPassed || item?.status === 'COMPLETED'}
          onClick={confirm}
          style={{ background: '#52c41a', borderColor: '#52c41a' }}
        >
          Подтвердить и выдать сертификат
        </Button>
        <Button
          danger
          icon={<WarningOutlined />}
          disabled={item?.status === 'COMPLETED'}
          onClick={() => setComplicationOpen(true)}
        >
          Зафиксировать осложнение
        </Button>
      </Space>

      {certificate && (
        <Alert
          style={{ marginTop: 16 }}
          type="success"
          showIcon
          message={`Сертификат ${certificate.code} сгенерирован`}
          description={`Код проверки: ${certificate.verificationCode}. Сертификат доступен клиенту в личном кабинете.`}
        />
      )}
      {item?.status === 'CORRECTIVE' && (
        <Alert
          style={{ marginTop: 16 }}
          type="error"
          showIcon
          message="Корректирующие процедуры"
          description={item.incidentNote ?? 'Зафиксировано осложнение, выпуск клиента заблокирован.'}
        />
      )}

      <Modal
        title="Зафиксировать осложнение"
        open={complicationOpen}
        onOk={reportComplication}
        onCancel={() => setComplicationOpen(false)}
        okText="Зафиксировать"
        okButtonProps={{ danger: true }}
        cancelText="Отмена"
      >
        <Text>Тип осложнения:</Text>
        <Select
          style={{ width: '100%', margin: '8px 0 16px' }}
          value={incidentType}
          onChange={setIncidentType}
          options={Object.entries(incidentTypeMeta).map(([value, meta]) => ({ value, label: meta.label }))}
        />
        <Text>Описание:</Text>
        <Input.TextArea
          style={{ marginTop: 8 }}
          rows={3}
          value={incidentNote}
          onChange={(event) => setIncidentNote(event.target.value)}
          placeholder="Опишите выявленные отклонения"
        />
      </Modal>
    </div>
  );
}
