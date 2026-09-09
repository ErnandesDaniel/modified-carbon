import { useParams, useNavigate } from 'react-router-dom'
import { Card, Typography, Tag, Button, Descriptions, Alert, Row, Col, Timeline, Space, Image } from 'antd'
import {
  ArrowLeftOutlined,
  TeamOutlined,
  CheckCircleOutlined,
  ExperimentOutlined,
  WarningOutlined,
  FileTextOutlined,
  ExpandOutlined,
} from '@ant-design/icons'
import { useCases } from '../data/useCases'

const { Title, Paragraph, Text } = Typography

export default function UseCaseDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const uc = useCases.find((u) => u.id === Number(id))

  if (!uc) {
    return (
      <div>
        <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/use-cases')} style={{ marginBottom: 16 }}>
          Назад
        </Button>
        <Alert type="error" message="Use Case не найден" />
      </div>
    )
  }

  return (
    <div>
      <Button
        icon={<ArrowLeftOutlined />}
        onClick={() => navigate('/use-cases')}
        style={{ marginBottom: 16 }}
      >
        Назад к списку
      </Button>

      <Row gutter={[24, 24]}>
        <Col xs={24} lg={14}>
          <Card style={{ background: '#1a1a2e', border: '1px solid #2a2a4a', marginBottom: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
              <Tag color="purple" style={{ fontSize: 16, padding: '4px 16px' }}>{uc.code}</Tag>
              <Title level={3} style={{ color: '#e0d4ff', margin: 0 }}>{uc.title}</Title>
            </div>
            <Tag style={{ fontSize: 13, marginBottom: 16 }}>{uc.titleEn}</Tag>
            <Paragraph style={{ color: '#aaa', fontSize: 15, lineHeight: 1.8 }}>
              {uc.summary}
            </Paragraph>
          </Card>

          <Card title={<span><TeamOutlined style={{ marginRight: 8 }} />Актёры</span>} style={{ background: '#1a1a2e', border: '1px solid #2a2a4a', marginBottom: 16 }}>
            <Space direction="vertical" style={{ width: '100%' }}>
              {uc.actors.map((a) => (
                <div key={a.name} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Tag color={a.type === 'main' ? 'blue' : 'default'} style={{ minWidth: 80, textAlign: 'center' }}>
                    {a.type === 'main' ? 'Основной' : 'Второст.'}
                  </Tag>
                  <Text style={{ color: '#e0d4ff' }}>{a.name}</Text>
                </div>
              ))}
            </Space>
          </Card>

          <Card
            title={<span><CheckCircleOutlined style={{ marginRight: 8 }} />Предусловия</span>}
            style={{ background: '#1a1a2e', border: '1px solid #2a2a4a', marginBottom: 16 }}
          >
            <Paragraph style={{ color: '#aaa', margin: 0, lineHeight: 1.8 }}>
              {uc.preconditions}
            </Paragraph>
          </Card>

          <Card
            title={<span><ExperimentOutlined style={{ marginRight: 8 }} />Основной поток</span>}
            style={{ background: '#1a1a2e', border: '1px solid #2a2a4a', marginBottom: 16 }}
          >
            <Timeline
              style={{ marginTop: 16 }}
              items={uc.mainFlow.split('. ').filter(Boolean).map((step, i) => ({
                color: i === 0 ? 'green' : i === uc.mainFlow.split('. ').length - 2 ? 'green' : 'gray',
                children: (
                  <Text style={{ color: '#ccc', fontSize: 14, lineHeight: 1.6 }}>
                    {step.trim()}
                  </Text>
                ),
              }))}
            />
          </Card>

          <Card
            title={<span><CheckCircleOutlined style={{ marginRight: 8, color: '#52c41a' }} />Постусловия</span>}
            style={{ background: '#1a1a2e', border: '1px solid #2a2a4a', marginBottom: 16 }}
          >
            <Paragraph style={{ color: '#aaa', margin: 0, lineHeight: 1.8 }}>
              {uc.postconditions}
            </Paragraph>
          </Card>
        </Col>

        <Col xs={24} lg={10}>
          {uc.diagramImage && (
            <Card
              title={<span><ExpandOutlined style={{ marginRight: 8 }} />Диаграмма</span>}
              style={{ background: '#1a1a2e', border: '1px solid #2a2a4a', marginBottom: 16 }}
            >
              <Image
                src={uc.diagramImage}
                alt={`Диаграмма ${uc.code}`}
                style={{ width: '100%', borderRadius: 8 }}
                fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="
              />
            </Card>
          )}

          <Card
            title={<span><WarningOutlined style={{ marginRight: 8, color: '#faad14' }} />Точки расширения</span>}
            style={{ background: '#1a1a2e', border: '1px solid #2a2a4a', marginBottom: 16 }}
          >
            <Space direction="vertical" size={12} style={{ width: '100%' }}>
              {uc.extensionPoints.map((ep) => (
                <div
                  key={ep.name}
                  style={{
                    background: '#16162a',
                    borderRadius: 8,
                    padding: '12px 16px',
                    border: '1px solid #2a2a4a',
                  }}
                >
                  <Tag color="orange" style={{ marginBottom: 6 }}>{ep.name}</Tag>
                  <Paragraph style={{ color: '#aaa', margin: 0, fontSize: 13, lineHeight: 1.6 }}>
                    {ep.description}
                  </Paragraph>
                </div>
              ))}
            </Space>
          </Card>

          <Card
            title={<span><FileTextOutlined style={{ marginRight: 8 }} />Связанные требования</span>}
            style={{ background: '#1a1a2e', border: '1px solid #2a2a4a', marginBottom: 16 }}
          >
            <Space wrap>
              {uc.frIds.map((fr) => (
                <Tag key={fr} color="purple" style={{ fontSize: 12 }}>{fr}</Tag>
              ))}
            </Space>
          </Card>

          <Descriptions
            bordered
            column={1}
            style={{ background: '#1a1a2e' }}
            labelStyle={{ background: '#16162a', color: '#888' }}
            contentStyle={{ background: '#1a1a2e', color: '#e0d4ff' }}
          >
            <Descriptions.Item label="ID">{uc.id}</Descriptions.Item>
            <Descriptions.Item label="Код">{uc.code}</Descriptions.Item>
            <Descriptions.Item label="Англ. название">{uc.titleEn}</Descriptions.Item>
            <Descriptions.Item label="Кол-во расширений">{uc.extensionPoints.length}</Descriptions.Item>
            <Descriptions.Item label="Кол-во FR">{uc.frIds.length}</Descriptions.Item>
          </Descriptions>
        </Col>
      </Row>
    </div>
  )
}
