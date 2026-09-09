import { useState, useEffect, useRef } from 'react'
import {
  Card, Typography, Tag, Table, Button, Modal, Descriptions, Space,
  Steps, Alert, message, Badge, Divider, Timeline,
} from 'antd'
import {
  ExperimentOutlined, PlayCircleOutlined, CheckCircleOutlined,
  CloseCircleOutlined, WarningOutlined, ClockCircleOutlined,
  MedicineBoxOutlined, UserOutlined, ThunderboltOutlined,
} from '@ant-design/icons'
import { cases, type Case } from '../data/sleeves'

const { Title, Paragraph, Text } = Typography

const caseStatusConfig: Record<string, { color: string; label: string }> = {
  pending:     { color: 'default',  label: 'Ожидает' },
  in_progress: { color: 'processing', label: 'Перенос в процессе' },
  completed:   { color: 'success', label: 'Завершён' },
  incident:    { color: 'error',    label: 'Инцидент' },
}

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
}

export default function NeedlecastPage() {
  const [selectedCase, setSelectedCase] = useState<Case | null>(null)
  const [detailOpen, setDetailOpen] = useState(false)
  const [procedureActive, setProcedureActive] = useState(false)
  const [timer, setTimer] = useState(0)
  const [procedureStep, setProcedureStep] = useState(0)
  const [incidentModalOpen, setIncidentModalOpen] = useState(false)
  const [incidentType, setIncidentType] = useState<string | null>(null)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    if (procedureActive) {
      timerRef.current = setInterval(() => setTimer(t => t + 1), 1000)
    } else if (timerRef.current) {
      clearInterval(timerRef.current)
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [procedureActive])

  const startProcedure = (c: Case) => {
    setSelectedCase(c)
    setProcedureActive(true)
    setTimer(0)
    setProcedureStep(0)
    message.info('Процедура переноса начата')
  }

  const advanceStep = () => {
    if (procedureStep < 3) {
      setProcedureStep(procedureStep + 1)
    }
  }

  const completeProcedure = () => {
    setProcedureActive(false)
    setProcedureStep(3)
    message.success('Процедура переноса завершена успешно. Протокол сохранён.')
  }

  const reportIncident = () => {
    setIncidentModalOpen(true)
  }

  const confirmIncident = () => {
    setProcedureActive(false)
    setIncidentModalOpen(false)
    setIncidentType(null)
    message.error('Инцидент зафиксирован. Кейс заблокирован.')
  }

  const columns = [
    {
      title: 'Кейс',
      dataIndex: 'id',
      key: 'id',
      width: 180,
      render: (text: string) => <Tag color="purple">{text}</Tag>,
    },
    {
      title: 'Клиент',
      dataIndex: 'clientName',
      key: 'clientName',
      render: (text: string) => <Text style={{ color: '#e0d4ff' }}>{text}</Text>,
    },
    {
      title: 'Sleeve',
      dataIndex: 'sleeveName',
      key: 'sleeveName',
      render: (text: string) => <Text style={{ color: '#888' }}>{text}</Text>,
    },
    {
      title: 'Стек',
      dataIndex: 'stackId',
      key: 'stackId',
      width: 100,
      render: (text: string) => <Tag>{text}</Tag>,
    },
    {
      title: 'Needlecaster',
      dataIndex: 'needlecaster',
      key: 'needlecaster',
      render: (text: string) => <Text style={{ color: '#888' }}>{text}</Text>,
    },
    {
      title: 'Статус',
      dataIndex: 'status',
      key: 'status',
      width: 180,
      render: (status: string) => {
        const cfg = caseStatusConfig[status]
        return <Tag color={cfg.color}>{cfg.label}</Tag>
      },
    },
    {
      title: '',
      key: 'action',
      width: 120,
      render: (_: any, record: Case) => (
        <Space>
          <Button
            size="small"
            onClick={() => { setSelectedCase(record); setDetailOpen(true) }}
          >
            Детали
          </Button>
          {record.status === 'pending' && (
            <Button
              type="primary"
              size="small"
              icon={<PlayCircleOutlined />}
              onClick={(e) => { e.stopPropagation(); startProcedure(record) }}
            >
              Начать
            </Button>
          )}
        </Space>
      ),
    },
  ]

  return (
    <div>
      <Title level={3} style={{ color: '#e0d4ff', marginBottom: 4 }}>
        <ExperimentOutlined style={{ color: '#b37feb', marginRight: 12 }} />
        Процедура Needlecast
      </Title>
      <Paragraph style={{ color: '#888', marginBottom: 24 }}>
        Проведение процедуры переноса сознания (UC-03: ConductNeedlecast)
      </Paragraph>

      {/* Active procedure panel */}
      {procedureActive && selectedCase && (
        <Card
          style={{
            background: '#1a0a2e',
            border: '2px solid #722ed1',
            marginBottom: 24,
          }}
          styles={{ body: { padding: 24 } }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
            <div>
              <Space>
                <Badge status="processing" />
                <Title level={4} style={{ color: '#b37feb', margin: 0 }}>
                  Перенос в процессе
                </Title>
              </Space>
              <Descriptions size="small" column={2} style={{ marginTop: 12 }}
                labelStyle={{ background: 'transparent', color: '#666' }}
                contentStyle={{ background: 'transparent', color: '#e0d4ff' }}
              >
                <Descriptions.Item label="Кейс">{selectedCase.id}</Descriptions.Item>
                <Descriptions.Item label="Клиент">{selectedCase.clientName}</Descriptions.Item>
                <Descriptions.Item label="Sleeve">{selectedCase.sleeveName}</Descriptions.Item>
                <Descriptions.Item label="Стек">{selectedCase.stackId}</Descriptions.Item>
                <Descriptions.Item label="Needlecaster">{selectedCase.needlecaster}</Descriptions.Item>
                <Descriptions.Item label="Время">{formatTime(timer)}</Descriptions.Item>
              </Descriptions>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{
                fontSize: 48,
                fontFamily: 'monospace',
                color: timer > 60 ? '#faad14' : '#52c41a',
                fontWeight: 700,
                lineHeight: 1,
              }}>
                {formatTime(timer)}
              </div>
              <Text style={{ color: '#666', fontSize: 12 }}>Таймер процедуры</Text>
            </div>
          </div>

          <Divider style={{ borderColor: '#2a2a4a', margin: '16px 0' }} />

          <Steps
            current={procedureStep}
            style={{ marginBottom: 16 }}
            items={[
              { title: 'Инициализация', description: 'Подключение стека', icon: <ThunderboltOutlined /> },
              { title: 'Перенос DHF', description: 'Transmission active', icon: <ExperimentOutlined /> },
              { title: 'Верификация', description: 'Проверка целостности', icon: <MedicineBoxOutlined /> },
              { title: 'Завершено', description: 'Протокол сохранён', icon: <CheckCircleOutlined /> },
            ]}
          />

          <Space>
            {procedureStep < 3 && (
              <Button type="primary" onClick={advanceStep} disabled={procedureStep >= 3}>
                Следующий этап
              </Button>
            )}
            {procedureStep === 2 && (
              <Button
                type="primary"
                icon={<CheckCircleOutlined />}
                onClick={completeProcedure}
                style={{ background: '#52c41a', borderColor: '#52c41a' }}
              >
                Отметить результат: Успешно
              </Button>
            )}
            {procedureStep < 3 && (
              <Button
                danger
                icon={<WarningOutlined />}
                onClick={reportIncident}
              >
                Зафиксировать инцидент
              </Button>
            )}
          </Space>
        </Card>
      )}

      <Card style={{ background: '#1a1a2e', border: '1px solid #2a2a4a' }}>
        <Table
          dataSource={cases}
          columns={columns}
          rowKey="id"
          pagination={false}
          style={{ background: '#16162a' }}
          size="middle"
        />
      </Card>

      {/* Case detail modal */}
      <Modal
        title={
          <Space>
            <Tag color="purple">{selectedCase?.id}</Tag>
            <Tag color={caseStatusConfig[selectedCase?.status || 'pending'].color}>
              {caseStatusConfig[selectedCase?.status || 'pending'].label}
            </Tag>
          </Space>
        }
        open={detailOpen}
        onCancel={() => setDetailOpen(false)}
        footer={[
          <Button key="close" onClick={() => setDetailOpen(false)}>Закрыть</Button>,
          selectedCase?.status === 'pending' && (
            <Button
              key="start"
              type="primary"
              icon={<PlayCircleOutlined />}
              onClick={() => { setDetailOpen(false); startProcedure(selectedCase!) }}
            >
              Начать перенос
            </Button>
          ),
        ].filter(Boolean)}
        width={600}
      >
        {selectedCase && (
          <>
            <Descriptions bordered column={1} size="small"
              labelStyle={{ background: '#16162a', color: '#888', width: 160 }}
              contentStyle={{ background: '#1a1a2e', color: '#e0d4ff' }}
            >
              <Descriptions.Item label="Клиент">
                <UserOutlined style={{ marginRight: 6 }} />
                {selectedCase.clientName}
              </Descriptions.Item>
              <Descriptions.Item label="Клиент ID">{selectedCase.clientId}</Descriptions.Item>
              <Descriptions.Item label="Sleeve">{selectedCase.sleeveName}</Descriptions.Item>
              <Descriptions.Item label="Sleeve ID">{selectedCase.sleeveId}</Descriptions.Item>
              <Descriptions.Item label="Стек">{selectedCase.stackId}</Descriptions.Item>
              <Descriptions.Item label="Needlecaster">{selectedCase.needlecaster}</Descriptions.Item>
              {selectedCase.startTime && (
                <Descriptions.Item label="Начало">{selectedCase.startTime}</Descriptions.Item>
              )}
              {selectedCase.endTime && (
                <Descriptions.Item label="Завершение">{selectedCase.endTime}</Descriptions.Item>
              )}
              {selectedCase.result && (
                <Descriptions.Item label="Результат">
                  {selectedCase.result === 'success'
                    ? <Tag color="success" icon={<CheckCircleOutlined />}>Успешно</Tag>
                    : <Tag color="error" icon={<CloseCircleOutlined />}>Неудача</Tag>
                  }
                </Descriptions.Item>
              )}
              {selectedCase.incidentType && (
                <Descriptions.Item label="Инцидент">
                  <Tag color="error">{selectedCase.incidentType}</Tag>
                </Descriptions.Item>
              )}
              {selectedCase.incidentNote && (
                <Descriptions.Item label="Описание">{selectedCase.incidentNote}</Descriptions.Item>
              )}
            </Descriptions>

            {selectedCase.status === 'completed' && (
              <Alert
                message="Процедура завершена успешно"
                description="Протокол сохранён. Psychosurgeon уведомлён для валидации."
                type="success"
                showIcon
                style={{ marginTop: 16 }}
              />
            )}
            {selectedCase.status === 'incident' && (
              <Alert
                message="Зафиксирован инцидент"
                description={`${selectedCase.incidentNote}. Кейс заблокирован. Требуетсяervention Psychosurgeon и администратора.`}
                type="error"
                showIcon
                style={{ marginTop: 16 }}
              />
            )}
          </>
        )}
      </Modal>

      {/* Incident modal */}
      <Modal
        title={<span><WarningOutlined style={{ color: '#ff4d4f', marginRight: 8 }} />Зафиксировать инцидент</span>}
        open={incidentModalOpen}
        onOk={confirmIncident}
        onCancel={() => setIncidentModalOpen(false)}
        okText="Зафиксировать"
        okButtonProps={{ danger: true }}
        cancelText="Отмена"
      >
        <Paragraph style={{ color: '#ccc', marginBottom: 16 }}>
          Выберите тип инцидента для кейса <Text strong style={{ color: '#b37feb' }}>{selectedCase?.id}</Text>
        </Paragraph>
        <Space direction="vertical" style={{ width: '100%' }}>
          {[
            { key: 'stack_shock', label: 'Stack Shock', desc: 'Психосоматический шок после переноса' },
            { key: 'rejection', label: 'Отторжение', desc: 'Тело отвергает стек' },
            { key: 'stack_damage', label: 'Повреждение стека', desc: 'Данные DHF повреждены' },
          ].map((t) => (
            <Card
              key={t.key}
              hoverable
              onClick={() => setIncidentType(t.key)}
              style={{
                background: incidentType === t.key ? '#2a1a3a' : '#16162a',
                border: incidentType === t.key ? '1px solid #722ed1' : '1px solid #2a2a4a',
                cursor: 'pointer',
              }}
              styles={{ body: { padding: 12 } }}
            >
              <Space direction="vertical" size={2}>
                <Tag color={incidentType === t.key ? 'purple' : 'default'} style={{ margin: 0 }}>{t.label}</Tag>
                <Text style={{ color: '#888', fontSize: 12 }}>{t.desc}</Text>
              </Space>
            </Card>
          ))}
        </Space>
      </Modal>
    </div>
  )
}
