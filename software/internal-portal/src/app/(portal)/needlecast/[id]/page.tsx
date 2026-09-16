'use client';

import { ArrowLeftOutlined, CheckCircleOutlined, PlayCircleOutlined, WarningOutlined } from '@ant-design/icons';
import {
  Alert,
  App,
  Button,
  Card,
  Descriptions,
  Input,
  Modal,
  Result,
  Select,
  Space,
  Tag,
  Typography
} from 'antd';
import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import { useSession } from '@/components/session-provider';
import { apiSend } from '@/lib/api';
import { formatDateTime } from '@/lib/format';
import { caseStatusMeta, genderMeta, incidentTypeMeta } from '@/lib/labels';
import { useApiData } from '@/lib/use-async';
import type { CaseDto, IncidentType } from '@/lib/types';

const { Title, Paragraph, Text } = Typography;

export default function NeedlecastDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { user } = useSession();
  const { message } = App.useApp();
  const [incidentOpen, setIncidentOpen] = useState(false);
  const [incidentType, setIncidentType] = useState<IncidentType>('STACK_SHOCK');
  const [incidentNote, setIncidentNote] = useState('');

  const { data: item, loading, reload } = useApiData<CaseDto>(`/cases/${params.id}`);

  if (!user) {
    return null;
  }

  if (!loading && !item) {
    return <Result status="404" title="Кейс не найден" />;
  }

  const start = async () => {
    try {
      await apiSend('POST', `/cases/${params.id}/start`, { needlecasterName: user.displayName });
      message.success('Процедура переноса начата');
      reload();
    } catch {
      message.error('Не удалось начать процедуру');
    }
  };

  const complete = async () => {
    try {
      await apiSend('POST', `/cases/${params.id}/complete`, { result: 'SUCCESS' });
      message.success('Процедура завершена успешно');
      reload();
    } catch {
      message.error('Не удалось завершить процедуру');
    }
  };

  const reportIncident = async () => {
    try {
      await apiSend('POST', `/cases/${params.id}/incident`, { type: incidentType, description: incidentNote });
      message.error('Инцидент зафиксирован, кейс заблокирован');
      setIncidentOpen(false);
      reload();
    } catch {
      message.error('Не удалось зафиксировать инцидент');
    }
  };

  return (
    <div>
      <Button icon={<ArrowLeftOutlined />} onClick={() => router.push('/needlecast')} style={{ marginBottom: 16 }}>
        Назад
      </Button>

      <Title level={3} className="page-title">
        Процедура переноса {item?.code}
      </Title>
      <Paragraph className="page-subtitle">UC-03: ConductNeedlecast</Paragraph>

      <Card loading={loading} style={{ marginBottom: 16 }}>
        {item && (
          <>
            <Descriptions bordered column={{ xs: 1, sm: 2 }} size="small">
              <Descriptions.Item label="Клиент">{item.methUserName ?? '—'}</Descriptions.Item>
              <Descriptions.Item label="Кейс">
                <Tag color="purple">{item.code}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Кортикальный стек">{item.stackCode ?? '—'}</Descriptions.Item>
              <Descriptions.Item label="Тело (sleeve)">
                {item.sleeveCode}
                {item.sleeveGender ? ` (${genderMeta[item.sleeveGender].label}, ${item.sleeveHeight} см)` : ''}
              </Descriptions.Item>
              <Descriptions.Item label="Статус">
                <Tag color={caseStatusMeta[item.status].color}>{caseStatusMeta[item.status].label}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Needlecaster">{item.needlecasterName ?? '—'}</Descriptions.Item>
              <Descriptions.Item label="Начало">{formatDateTime(item.startTime)}</Descriptions.Item>
              <Descriptions.Item label="Завершение">{formatDateTime(item.endTime)}</Descriptions.Item>
              {item.result && (
                <Descriptions.Item label="Результат">
                  {item.result === 'SUCCESS' ? (
                    <Tag color="success" icon={<CheckCircleOutlined />}>
                      Успешно
                    </Tag>
                  ) : (
                    <Tag color="error">Неудача</Tag>
                  )}
                </Descriptions.Item>
              )}
              {item.incidentType && (
                <Descriptions.Item label="Инцидент">
                  <Tag color={incidentTypeMeta[item.incidentType].color}>{incidentTypeMeta[item.incidentType].label}</Tag>
                </Descriptions.Item>
              )}
              {item.incidentNote && (
                <Descriptions.Item label="Описание" span={2}>
                  {item.incidentNote}
                </Descriptions.Item>
              )}
            </Descriptions>

            <Space style={{ marginTop: 20 }}>
              {item.status === 'PENDING' && (
                <Button type="primary" icon={<PlayCircleOutlined />} onClick={start}>
                  Начать перенос
                </Button>
              )}
              {item.status === 'IN_PROGRESS' && (
                <>
                  <Button
                    type="primary"
                    icon={<CheckCircleOutlined />}
                    onClick={complete}
                    style={{ background: '#52c41a', borderColor: '#52c41a' }}
                  >
                    Отметить результат: Успешно
                  </Button>
                  <Button danger icon={<WarningOutlined />} onClick={() => setIncidentOpen(true)}>
                    Зафиксировать инцидент
                  </Button>
                </>
              )}
              {item.status === 'COMPLETED' && (
                <Button type="primary" onClick={() => router.push(`/validation/${item.id}`)}>
                  Перейти к валидации
                </Button>
              )}
            </Space>

            {item.status === 'COMPLETED' && (
              <Alert
                style={{ marginTop: 16 }}
                type="success"
                showIcon
                message="Процедура завершена успешно"
                description="Протокол сохранён. Psychosurgeon уведомлён для валидации."
              />
            )}
            {(item.status === 'INCIDENT' || item.status === 'CORRECTIVE') && (
              <Alert
                style={{ marginTop: 16 }}
                type="error"
                showIcon
                message="Зафиксирован инцидент"
                description={`${item.incidentNote ?? ''} Кейс заблокирован, требуется вмешательство Psychosurgeon.`}
              />
            )}
          </>
        )}
      </Card>

      <Modal
        title="Зафиксировать инцидент"
        open={incidentOpen}
        onOk={reportIncident}
        onCancel={() => setIncidentOpen(false)}
        okText="Зафиксировать"
        okButtonProps={{ danger: true }}
        cancelText="Отмена"
      >
        <Text>Тип инцидента:</Text>
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
          placeholder="Опишите характер инцидента"
        />
      </Modal>
    </div>
  );
}
