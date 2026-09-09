import { useNavigate } from 'react-router-dom'
import {
  Card, Typography, Tag, Row, Col, Badge, Button, Space, List, Avatar,
  Progress, Timeline, Statistic, Divider,
} from 'antd'
import {
  CloudServerOutlined, ExperimentOutlined, SafetyCertificateOutlined,
  UserOutlined, ClockCircleOutlined, CheckCircleOutlined,
  WarningOutlined, ArrowRightOutlined, ThunderboltOutlined,
  MedicineBoxOutlined, BellOutlined,
} from '@ant-design/icons'
import { cases, sleeves, checkpoints } from '../data/sleeves'

const { Title, Paragraph, Text } = Typography

export default function HomePage() {
  const navigate = useNavigate()

  const activeCases = cases.filter(c => c.status === 'in_progress')
  const pendingCases = cases.filter(c => c.status === 'pending')
  const incidentCases = cases.filter(c => c.status === 'incident')
  const completedCases = cases.filter(c => c.status === 'completed')
  const availableSleeves = sleeves.filter(s => s.status === 'available')

  const recentActivity = [
    { time: '14:30', text: 'Начата процедура needlecast — CASE-2384-003 (Такеши Кавахара)', type: 'info' as const },
    { time: '11:45', text: 'Завершена процедура — CASE-2384-001 (Лоренс Банкрофт)', type: 'success' as const },
    { time: '09:00', text: 'Инцидент: Stack Shock — CASE-2384-004 (Виктория Лэнг)', type: 'error' as const },
    { time: 'Вчера', text: 'Новое тело S-009 добавлено в каталог', type: 'info' as const },
    { time: 'Вчера', text: 'Сертификат сгенерирован для CASE-2384-001', type: 'success' as const },
  ]

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <Title level={2} style={{ color: '#e0d4ff', marginBottom: 4 }}>
          Панель управления
        </Title>
        <Paragraph style={{ color: '#666', margin: 0 }}>
          Bay City Sleeving Clinic — {new Date().toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })}
        </Paragraph>
      </div>

      {/* Stat cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={12} sm={6}>
          <Card
            style={{ background: '#1a1a2e', border: '1px solid #2a2a4a', cursor: 'pointer' }}
            hoverable
            onClick={() => navigate('/catalog')}
            styles={{ body: { padding: 16 } }}
          >
            <Statistic
              title={<span style={{ color: '#666', fontSize: 12 }}>Тел в каталоге</span>}
              value={availableSleeves.length}
              prefix={<CloudServerOutlined style={{ color: '#52c41a' }} />}
              valueStyle={{ color: '#e0d4ff' }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card
            style={{ background: '#1a1a2e', border: '1px solid #2a2a4a', cursor: 'pointer' }}
            hoverable
            onClick={() => navigate('/needlecast')}
            styles={{ body: { padding: 16 } }}
          >
            <Statistic
              title={<span style={{ color: '#666', fontSize: 12 }}>Активных процедур</span>}
              value={activeCases.length}
              prefix={<ExperimentOutlined style={{ color: '#722ed1' }} />}
              valueStyle={{ color: '#e0d4ff' }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card
            style={{ background: '#1a1a2e', border: '1px solid #2a2a4a', cursor: 'pointer' }}
            hoverable
            onClick={() => navigate('/validation')}
            styles={{ body: { padding: 16 } }}
          >
            <Statistic
              title={<span style={{ color: '#666', fontSize: 12 }}>Ожидают валидации</span>}
              value={pendingCases.length}
              prefix={<SafetyCertificateOutlined style={{ color: '#faad14' }} />}
              valueStyle={{ color: '#e0d4ff' }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card
            style={{ background: '#1a1a2e', border: incidentCases.length > 0 ? '1px solid #ff4d4f44' : '1px solid #2a2a4a', cursor: 'pointer' }}
            hoverable
            onClick={() => navigate('/needlecast')}
            styles={{ body: { padding: 16 } }}
          >
            <Statistic
              title={<span style={{ color: '#666', fontSize: 12 }}>Инциденты</span>}
              value={incidentCases.length}
              prefix={<WarningOutlined style={{ color: '#ff4d4f' }} />}
              valueStyle={{ color: incidentCases.length > 0 ? '#ff4d4f' : '#e0d4ff' }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        {/* Active procedures */}
        <Col xs={24} lg={14}>
          <Card
            title={
              <Space>
                <ThunderboltOutlined style={{ color: '#b37feb' }} />
                <span>Активные процедуры</span>
              </Space>
            }
            extra={<Button size="small" onClick={() => navigate('/needlecast')}>Все кейсы <ArrowRightOutlined /></Button>}
            style={{ background: '#1a1a2e', border: '1px solid #2a2a4a', marginBottom: 16 }}
          >
            {activeCases.length === 0 && pendingCases.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '24px 0', color: '#666' }}>
                <CheckCircleOutlined style={{ fontSize: 32, marginBottom: 8, color: '#52c41a' }} />
                <div>Нет активных процедур</div>
              </div>
            ) : (
              <Space direction="vertical" style={{ width: '100%' }} size={12}>
                {activeCases.map((c) => (
                  <div
                    key={c.id}
                    onClick={() => navigate('/needlecast')}
                    style={{
                      background: '#16162a',
                      borderRadius: 8,
                      padding: '12px 16px',
                      border: '1px solid #722ed133',
                      cursor: 'pointer',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Space>
                        <Badge status="processing" color="#722ed1" />
                        <Tag color="purple" style={{ margin: 0 }}>{c.id}</Tag>
                        <Text style={{ color: '#e0d4ff' }}>{c.clientName}</Text>
                      </Space>
                      <Text style={{ color: '#666', fontSize: 12 }}>
                        <ClockCircleOutlined style={{ marginRight: 4 }} />
                        {c.startTime?.split('T')[1]}
                      </Text>
                    </div>
                    <div style={{ marginTop: 4, color: '#666', fontSize: 12 }}>
                      Sleeve: {c.sleeveName} · Стек: {c.stackId} · Needlecaster: {c.needlecaster}
                    </div>
                  </div>
                ))}
                {pendingCases.map((c) => (
                  <div
                    key={c.id}
                    onClick={() => navigate('/needlecast')}
                    style={{
                      background: '#16162a',
                      borderRadius: 8,
                      padding: '12px 16px',
                      border: '1px solid #2a2a4a',
                      cursor: 'pointer',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Space>
                        <Badge status="default" />
                        <Tag color="default" style={{ margin: 0 }}>{c.id}</Tag>
                        <Text style={{ color: '#e0d4ff' }}>{c.clientName}</Text>
                      </Space>
                      <Button type="primary" size="small" icon={<ExperimentOutlined />}>
                        Начать
                      </Button>
                    </div>
                    <div style={{ marginTop: 4, color: '#666', fontSize: 12 }}>
                      Sleeve: {c.sleeveName} · Стек: {c.stackId} · Needlecaster: {c.needlecaster}
                    </div>
                  </div>
                ))}
              </Space>
            )}
          </Card>

          {/* Validation queue */}
          <Card
            title={
              <Space>
                <SafetyCertificateOutlined style={{ color: '#faad14' }} />
                <span>Очередь валидации</span>
              </Space>
            }
            extra={<Button size="small" onClick={() => navigate('/validation')}>Открыть <ArrowRightOutlined /></Button>}
            style={{ background: '#1a1a2e', border: '1px solid #2a2a4a' }}
          >
            {completedCases.filter(c => c.status === 'completed').length === 0 ? (
              <div style={{ textAlign: 'center', padding: '16px 0', color: '#666' }}>
                Нет кейсов на валидации
              </div>
            ) : (
              <Space direction="vertical" style={{ width: '100%' }} size={8}>
                {completedCases.map((c) => {
                  const cps = checkpoints.filter(cp => cp.caseId === c.id)
                  const passed = cps.filter(cp => cp.status === 'passed').length
                  const total = cps.length
                  return (
                    <div
                      key={c.id}
                      onClick={() => navigate('/validation')}
                      style={{
                        background: '#16162a',
                        borderRadius: 8,
                        padding: '10px 16px',
                        border: '1px solid #2a2a4a',
                        cursor: 'pointer',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <Space>
                        <MedicineBoxOutlined style={{ color: '#faad14' }} />
                        <Tag color="purple" style={{ margin: 0 }}>{c.id}</Tag>
                        <Text style={{ color: '#e0d4ff' }}>{c.clientName}</Text>
                      </Space>
                      <Space>
                        {total > 0 && (
                          <Progress
                            percent={Math.round((passed / total) * 100)}
                            size="small"
                            style={{ width: 80 }}
                            strokeColor="#722ed1"
                          />
                        )}
                        <ArrowRightOutlined style={{ color: '#666' }} />
                      </Space>
                    </div>
                  )
                })}
              </Space>
            )}
          </Card>
        </Col>

        {/* Right column */}
        <Col xs={24} lg={10}>
          {/* Quick actions */}
          <Card
            title={<span><BellOutlined style={{ color: '#b37feb', marginRight: 8 }} />Быстрые действия</span>}
            style={{ background: '#1a1a2e', border: '1px solid #2a2a4a', marginBottom: 16 }}
          >
            <Row gutter={[12, 12]}>
              <Col span={12}>
                <Button
                  block
                  icon={<CloudServerOutlined />}
                  onClick={() => navigate('/catalog')}
                  style={{ height: 48 }}
                >
                  Каталог тел
                </Button>
              </Col>
              <Col span={12}>
                <Button
                  block
                  type="primary"
                  icon={<ExperimentOutlined />}
                  onClick={() => navigate('/needlecast')}
                  style={{ height: 48 }}
                >
                  Needlecast
                </Button>
              </Col>
              <Col span={24}>
                <Button
                  block
                  icon={<SafetyCertificateOutlined />}
                  onClick={() => navigate('/validation')}
                  style={{ height: 48 }}
                >
                  Валидация и сертификация
                </Button>
              </Col>
            </Row>
          </Card>

          {/* Activity feed */}
          <Card
            title={<span><ClockCircleOutlined style={{ color: '#b37feb', marginRight: 8 }} />Последние события</span>}
            style={{ background: '#1a1a2e', border: '1px solid #2a2a4a' }}
          >
            <Timeline
              items={recentActivity.map((a) => ({
                color: a.type === 'success' ? '#52c41a' : a.type === 'error' ? '#ff4d4f' : '#722ed1',
                children: (
                  <div>
                    <Text style={{ color: '#666', fontSize: 11 }}>{a.time}</Text>
                    <div style={{ color: '#ccc', fontSize: 13, marginTop: 2 }}>{a.text}</div>
                  </div>
                ),
              }))}
            />
          </Card>
        </Col>
      </Row>
    </div>
  )
}
