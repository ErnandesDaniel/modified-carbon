import { useNavigate } from 'react-router-dom'
import { Card, List, Tag, Typography, Button, Row, Col, Statistic } from 'antd'
import {
  ApartmentOutlined,
  ArrowRightOutlined,
  TeamOutlined,
  FileTextOutlined,
} from '@ant-design/icons'
import { useCases } from '../data/useCases'

const { Title, Paragraph } = Typography

export default function UseCasesPage() {
  const navigate = useNavigate()

  return (
    <div>
      <Title level={3} style={{ color: '#e0d4ff', marginBottom: 8 }}>
        <ApartmentOutlined style={{ color: '#b37feb', marginRight: 12 }} />
        Use Case Specification
      </Title>
      <Paragraph style={{ color: '#888', marginBottom: 24 }}>
        Описание прецедентов системы SCMS. Все прецеденты являются архитектурно значимыми.
      </Paragraph>

      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={12} sm={6}>
          <Card style={{ background: '#1a1a2e', border: '1px solid #2a2a4a' }}>
            <Statistic title={<span style={{ color: '#888' }}>Всего UC</span>} value={5} valueStyle={{ color: '#b37feb' }} />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card style={{ background: '#1a1a2e', border: '1px solid #2a2a4a' }}>
            <Statistic title={<span style={{ color: '#888' }}>Архитектурно значимых</span>} value={5} valueStyle={{ color: '#52c41a' }} />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card style={{ background: '#1a1a2e', border: '1px solid #2a2a4a' }}>
            <Statistic title={<span style={{ color: '#888' }}>Актёров</span>} value={4} valueStyle={{ color: '#1677ff' }} />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card style={{ background: '#1a1a2e', border: '1px solid #2a2a4a' }}>
            <Statistic title={<span style={{ color: '#888' }}>Расширений</span>} value={9} valueStyle={{ color: '#fa8c16' }} />
          </Card>
        </Col>
      </Row>

      <List
        itemLayout="vertical"
        dataSource={useCases}
        renderItem={(uc) => (
          <Card
            hoverable
            onClick={() => navigate(`/use-cases/${uc.id}`)}
            style={{
              background: '#1a1a2e',
              border: '1px solid #2a2a4a',
              marginBottom: 16,
              cursor: 'pointer',
            }}
            styles={{ body: { padding: 24 } }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
              <div style={{ flex: 1, minWidth: 300 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                  <Tag color="purple" style={{ margin: 0, fontSize: 14, padding: '2px 12px' }}>{uc.code}</Tag>
                  <Tag style={{ margin: 0, fontSize: 12 }}>{uc.titleEn}</Tag>
                </div>
                <Title level={4} style={{ color: '#e0d4ff', margin: '0 0 8px' }}>{uc.title}</Title>
                <Paragraph style={{ color: '#888', margin: '0 0 12px' }}>{uc.summary}</Paragraph>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {uc.actors.map((a) => (
                    <Tag
                      key={a.name}
                      icon={<TeamOutlined />}
                      color={a.type === 'main' ? 'blue' : 'default'}
                    >
                      {a.name}
                    </Tag>
                  ))}
                </div>
                <div style={{ marginTop: 12, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  <FileTextOutlined style={{ color: '#666' }} />
                  {uc.frIds.map((fr) => (
                    <Tag key={fr} style={{ margin: 0, fontSize: 11 }}>{fr}</Tag>
                  ))}
                </div>
              </div>
              <ArrowRightOutlined style={{ color: '#b37feb', fontSize: 20, marginTop: 8 }} />
            </div>
          </Card>
        )}
      />
    </div>
  )
}
