import { useState, useMemo } from 'react'
import {
  Card, Typography, Tag, Table, Button, Modal, Descriptions, Space,
  Progress, Steps, Alert, message, Radio, Rate, Divider, Badge, Row, Col,
} from 'antd'
import {
  SafetyCertificateOutlined, CheckCircleOutlined, CloseCircleOutlined,
  WarningOutlined, ClockCircleOutlined, UserOutlined, MedicineBoxOutlined,
  FileTextOutlined, BulbOutlined, HeartOutlined, KeyOutlined,
  ThunderboltOutlined,
} from '@ant-design/icons'
import { checkpoints, cases, stackShockScale, type Checkpoint } from '../data/sleeves'

const { Title, Paragraph, Text } = Typography

const categoryConfig: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  cognitive: { label: 'Когнитивный', color: 'blue', icon: <BulbOutlined /> },
  physical:  { label: 'Физический', color: 'green', icon: <HeartOutlined /> },
  stack:     { label: 'Стек', color: 'purple', icon: <ThunderboltOutlined /> },
  identity:  { label: 'Идентификация', color: 'orange', icon: <KeyOutlined /> },
}

const checkpointStatusConfig: Record<string, { color: string; label: string; icon: React.ReactNode }> = {
  pending: { color: 'default',  label: 'Ожидает', icon: <ClockCircleOutlined /> },
  passed:  { color: 'success', label: 'Пройден', icon: <CheckCircleOutlined /> },
  failed:  { color: 'error',   label: 'Не пройден', icon: <CloseCircleOutlined /> },
}

export default function ValidationPage() {
  const [selectedCaseId, setSelectedCaseId] = useState<string | null>(null)
  const [stackShockLevel, setStackShockLevel] = useState<number | null>(null)
  const [certModalOpen, setCertModalOpen] = useState(false)
  const [certGenerating, setCertGenerating] = useState(false)

  const caseCheckpoints = useMemo(() => {
    if (!selectedCaseId) return []
    return checkpoints.filter(cp => cp.caseId === selectedCaseId)
  }, [selectedCaseId])

  const completedCases = cases.filter(c => c.status === 'completed' || c.status === 'in_progress')

  const selectedCase = cases.find(c => c.id === selectedCaseId)

  const stats = useMemo(() => {
    if (!selectedCaseId) return { total: 0, passed: 0, failed: 0, pending: 0 }
    const cps = checkpoints.filter(cp => cp.caseId === selectedCaseId)
    return {
      total: cps.length,
      passed: cps.filter(cp => cp.status === 'passed').length,
      failed: cps.filter(cp => cp.status === 'failed').length,
      pending: cps.filter(cp => cp.status === 'pending').length,
    }
  }, [selectedCaseId])

  const allPassed = stats.total > 0 && stats.passed === stats.total && stats.failed === 0
  const progressPercent = stats.total > 0 ? Math.round((stats.passed / stats.total) * 100) : 0

  const handleGenerateCert = () => {
    setCertGenerating(true)
    setTimeout(() => {
      setCertGenerating(false)
      setCertModalOpen(false)
      message.success('PDF-сертификат совместимости сгенерирован и доступен клиенту')
    }, 2000)
  }

  const markCheckpoint = (cpId: string, status: 'passed' | 'failed') => {
    const cp = checkpoints.find(c => c.id === cpId)
    if (cp) {
      cp.status = status
      if (status === 'failed' && cp.category === 'stack') {
        message.error('Stack Shock обнаружен! Требуется немедленноеervention.')
      } else {
        message.info(`Чекпоинт "${cp.label}" — ${status === 'passed' ? 'пройден' : 'не пройден'}`)
      }
    }
  }

  return (
    <div>
      <Title level={3} style={{ color: '#e0d4ff', marginBottom: 4 }}>
        <SafetyCertificateOutlined style={{ color: '#b37feb', marginRight: 12 }} />
        Валидация и Сертификация
      </Title>
      <Paragraph style={{ color: '#888', marginBottom: 24 }}>
        Постпроцедурная проверка совместимости (UC-04: ValidateAndCertify)
      </Paragraph>

      {/* Case selector */}
      <Card
        title={
          <Space>
            <MedicineBoxOutlined style={{ color: '#b37feb' }} />
            <span>Кейсы на валидации</span>
          </Space>
        }
        style={{ background: '#1a1a2e', border: '1px solid #2a2a4a', marginBottom: 16 }}
      >
        <Table
          dataSource={completedCases}
          columns={[
            {
              title: 'Кейс',
              dataIndex: 'id',
              key: 'id',
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
              title: 'Статус',
              dataIndex: 'status',
              key: 'status',
              render: (status: string) => {
                const cps = checkpoints.filter(cp => cp.caseId === status)
                const passedCount = cps.filter(cp => cp.status === 'passed').length
                const failedCount = cps.filter(cp => cp.status === 'failed').length
                if (failedCount > 0) return <Tag color="error">Осложнения</Tag>
                if (passedCount === cps.length && cps.length > 0) return <Tag color="success">Все пройдены</Tag>
                return <Tag color="processing">В процессе</Tag>
              },
            },
            {
              title: '',
              key: 'select',
              width: 100,
              render: (_: any, record: any) => (
                <Button
                  type={selectedCaseId === record.id ? 'primary' : 'default'}
                  onClick={() => setSelectedCaseId(record.id)}
                >
                  {selectedCaseId === record.id ? 'Выбран' : 'Выбрать'}
                </Button>
              ),
            },
          ]}
          rowKey="id"
          pagination={false}
          size="small"
          style={{ background: '#16162a' }}
        />
      </Card>

      {selectedCaseId && (
        <Row gutter={[16, 16]}>
          {/* Checkpoints list */}
          <Col xs={24} lg={14}>
            <Card
              title={
                <Space>
                  <FileTextOutlined style={{ color: '#b37feb' }} />
                  <span>Чекпоинты — {selectedCase?.clientName}</span>
                </Space>
              }
              extra={
                <Space>
                  <Badge count={stats.passed} showZero color="green" />
                  <Badge count={stats.failed} showZero color="red" />
                  <Badge count={stats.pending} showZero color="default" />
                </Space>
              }
              style={{ background: '#1a1a2e', border: '1px solid #2a2a4a', marginBottom: 16 }}
            >
              <div style={{ marginBottom: 16 }}>
                <Progress
                  percent={progressPercent}
                  status={stats.failed > 0 ? 'exception' : stats.pending === 0 ? 'success' : 'active'}
                  strokeColor="#722ed1"
                />
                <Text style={{ color: '#666', fontSize: 12 }}>
                  {stats.passed}/{stats.total} пройдено
                </Text>
              </div>

              <Space direction="vertical" style={{ width: '100%' }} size={12}>
                {caseCheckpoints.map((cp) => {
                  const catCfg = categoryConfig[cp.category]
                  const stCfg = checkpointStatusConfig[cp.status]
                  return (
                    <Card
                      key={cp.id}
                      style={{
                        background: '#16162a',
                        border: `1px solid ${cp.status === 'failed' ? '#ff4d4f33' : cp.status === 'passed' ? '#52c41a33' : '#2a2a4a'}`,
                      }}
                      styles={{ body: { padding: 12 } }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
                        <div style={{ flex: 1 }}>
                          <Space style={{ marginBottom: 4 }}>
                            <Tag color={catCfg.color} icon={catCfg.icon} style={{ margin: 0 }}>{catCfg.label}</Tag>
                            {cp.required && <Tag color="red" style={{ margin: 0, fontSize: 10 }}>Обязательный</Tag>}
                          </Space>
                          <Title level={5} style={{ color: '#e0d4ff', margin: '4px 0 4px', fontSize: 14 }}>{cp.label}</Title>
                          <Paragraph style={{ color: '#888', margin: 0, fontSize: 12, lineHeight: 1.5 }}>{cp.description}</Paragraph>
                        </div>
                        <div style={{ textAlign: 'right', minWidth: 140 }}>
                          <Tag color={stCfg.color} icon={stCfg.icon} style={{ marginBottom: 4 }}>{stCfg.label}</Tag>
                          <div style={{ marginTop: 4 }}>
                            {cp.status === 'pending' && (
                              <Space size={4}>
                                <Button
                                  size="small"
                                  type="primary"
                                  onClick={() => markCheckpoint(cp.id, 'passed')}
                                >
                                  Пройден
                                </Button>
                                <Button
                                  size="small"
                                  danger
                                  onClick={() => markCheckpoint(cp.id, 'failed')}
                                >
                                  Провал
                                </Button>
                              </Space>
                            )}
                          </div>
                        </div>
                      </div>
                    </Card>
                  )
                })}
              </Space>
            </Card>
          </Col>

          {/* Right panel */}
          <Col xs={24} lg={10}>
            {/* Stack Shock Assessment */}
            <Card
              title={
                <Space>
                  <ThunderboltOutlined style={{ color: '#faad14' }} />
                  <span>Оценка Stack Shock</span>
                </Space>
              }
              style={{ background: '#1a1a2e', border: '1px solid #2a2a4a', marginBottom: 16 }}
            >
              <Paragraph style={{ color: '#888', marginBottom: 12, fontSize: 13 }}>
                Оцените уровень Stack Shock по шкале 0-5:
              </Paragraph>
              <Radio.Group
                value={stackShockLevel}
                onChange={(e) => setStackShockLevel(e.target.value)}
                style={{ width: '100%' }}
              >
                <Space direction="vertical" style={{ width: '100%' }}>
                  {stackShockScale.map((item) => (
                    <Radio key={item.level} value={item.level} style={{ width: '100%' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <Tag color={item.color} style={{ margin: 0, minWidth: 16, textAlign: 'center' }}>{item.level}</Tag>
                        <div>
                          <Text style={{ color: '#e0d4ff', fontSize: 13 }}>{item.label}</Text>
                          <Text style={{ color: '#666', fontSize: 11, display: 'block' }}>{item.description}</Text>
                        </div>
                      </div>
                    </Radio>
                  ))}
                </Space>
              </Radio.Group>
              {stackShockLevel !== null && stackShockLevel >= 3 && (
                <Alert
                  message="Критический уровень Stack Shock"
                  description="Пациент не может быть выпущен. Требуется расширенное наблюдение."
                  type="error"
                  showIcon
                  style={{ marginTop: 12 }}
                />
              )}
            </Card>

            {/* Certificate */}
            <Card
              title={
                <Space>
                  <FileTextOutlined style={{ color: '#52c41a' }} />
                  <span>Сертификат совместимости</span>
                </Space>
              }
              style={{ background: '#1a1a2e', border: '1px solid #2a2a4a', marginBottom: 16 }}
            >
              {allPassed ? (
                <div>
                  <Alert
                    message="Все чекпоинты пройдены"
                    description="Клиент готов к выписке. Сертификат совместимости может быть сгенерирован."
                    type="success"
                    showIcon
                    style={{ marginBottom: 12 }}
                  />
                  <Button
                    type="primary"
                    icon={<SafetyCertificateOutlined />}
                    block
                    onClick={() => setCertModalOpen(true)}
                    style={{ background: '#52c41a', borderColor: '#52c41a' }}
                  >
                    Сгенерировать PDF-сертификат
                  </Button>
                </div>
              ) : stats.failed > 0 ? (
                <Alert
                  message="Есть непройденные чекпоинты"
                  description="Сертификат не может быть сгенерирован до устранения проблем."
                  type="error"
                  showIcon
                />
              ) : (
                <Alert
                  message="Чекпоинты ещё не пройдены"
                  description={`Пройдено ${stats.passed} из ${stats.total} обязательных проверок.`}
                  type="info"
                  showIcon
                />
              )}
            </Card>

            {/* Status summary */}
            <Card
              style={{ background: '#1a1a2e', border: '1px solid #2a2a4a' }}
              styles={{ body: { padding: 12 } }}
            >
              <Descriptions size="small" column={1}
                labelStyle={{ background: '#16162a', color: '#666', width: 120 }}
                contentStyle={{ background: '#1a1a2e', color: '#e0d4ff' }}
              >
                <Descriptions.Item label="Кейс">{selectedCaseId}</Descriptions.Item>
                <Descriptions.Item label="Клиент">{selectedCase?.clientName}</Descriptions.Item>
                <Descriptions.Item label="Sleeve">{selectedCase?.sleeveName}</Descriptions.Item>
                <Descriptions.Item label="Стек">{selectedCase?.stackId}</Descriptions.Item>
                <Descriptions.Item label="Пройдено">{stats.passed}/{stats.total}</Descriptions.Item>
                <Descriptions.Item label="Stack Shock">
                  {stackShockLevel !== null
                    ? <Tag color={stackShockScale[stackShockLevel].color}>Уровень {stackShockLevel}</Tag>
                    : <Text style={{ color: '#666' }}>Не оценён</Text>
                  }
                </Descriptions.Item>
              </Descriptions>
            </Card>
          </Col>
        </Row>
      )}

      {!selectedCaseId && (
        <Card style={{ background: '#1a1a2e', border: '1px solid #2a2a4a' }}>
          <Alert
            message="Выберите кейс"
            description="Выберите кейс из таблицы выше для начала валидации."
            type="info"
            showIcon
          />
        </Card>
      )}

      {/* Certificate generation modal */}
      <Modal
        title={
          <Space>
            <SafetyCertificateOutlined style={{ color: '#52c41a' }} />
            <span>Генерация сертификата</span>
          </Space>
        }
        open={certModalOpen}
        onOk={handleGenerateCert}
        onCancel={() => setCertModalOpen(false)}
        okText="Сгенерировать PDF"
        confirmLoading={certGenerating}
      >
        <Descriptions bordered column={1} size="small"
          labelStyle={{ background: '#16162a', color: '#888' }}
          contentStyle={{ background: '#1a1a2e', color: '#e0d4ff' }}
        >
          <Descriptions.Item label="Клиент">{selectedCase?.clientName}</Descriptions.Item>
          <Descriptions.Item label="Клиент ID">{selectedCase?.clientId}</Descriptions.Item>
          <Descriptions.Item label="Sleeve">{selectedCase?.sleeveName}</Descriptions.Item>
          <Descriptions.Item label="Стек">{selectedCase?.stackId}</Descriptions.Item>
          <Descriptions.Item label="Чекпоинты">
            <Tag color="green">{stats.passed}/{stats.total} пройдено</Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Stack Shock">
            {stackShockLevel !== null
              ? <Tag color={stackShockScale[stackShockLevel].color}>{stackShockScale[stackShockLevel].label} ({stackShockLevel})</Tag>
              : <Tag color="default">Не оценён</Tag>
            }
          </Descriptions.Item>
          <Descriptions.Item label="Формат">PDF с QR-кодом и криптографической подписью</Descriptions.Item>
        </Descriptions>
      </Modal>
    </div>
  )
}


