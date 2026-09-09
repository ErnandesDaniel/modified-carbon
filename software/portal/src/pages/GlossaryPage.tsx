import { Card, Table, Typography, Input, Tag, Space } from 'antd'
import { BookOutlined, SearchOutlined } from '@ant-design/icons'
import { useState } from 'react'
import { glossary } from '../data/useCases'

const { Title, Paragraph } = Typography

export default function GlossaryPage() {
  const [search, setSearch] = useState('')

  const filtered = glossary.filter(
    (g) =>
      g.term.toLowerCase().includes(search.toLowerCase()) ||
      g.definition.toLowerCase().includes(search.toLowerCase())
  )

  const docColors: Record<string, string> = {
    'Все документы проекта': 'purple',
    'Vision, SRS, Glossary': 'blue',
    'SRS, SAD, TestPlan': 'green',
    'SRS, Glossary': 'cyan',
    'SRS, SDP, TestPlan': 'orange',
    'SRS, SAD, Glossary': 'magenta',
    'Glossary': 'default',
    'BusinessCase': 'gold',
    'SRS, SAD': 'blue',
  }

  return (
    <div>
      <Title level={3} style={{ color: '#e0d4ff', marginBottom: 8 }}>
        <BookOutlined style={{ color: '#b37feb', marginRight: 12 }} />
        Glossary — Глоссарий SCMS
      </Title>
      <Paragraph style={{ color: '#888', marginBottom: 16 }}>
        Определения и аббревиатуры, используемые в документах проекта
      </Paragraph>

      <Card
        style={{ background: '#1a1a2e', border: '1px solid #2a2a4a', marginBottom: 16 }}
        styles={{ body: { padding: '12px 16px' } }}
      >
        <Input
          placeholder="Поиск по термину или определению..."
          prefix={<SearchOutlined style={{ color: '#666' }} />}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          allowClear
          size="large"
          style={{ background: '#16162a', border: '1px solid #2a2a4a' }}
        />
      </Card>

      <Card style={{ background: '#1a1a2e', border: '1px solid #2a2a4a' }}>
        <Table
          dataSource={filtered}
          columns={[
            {
              title: 'Термин',
              dataIndex: 'term',
              key: 'term',
              width: '25%',
              render: (text: string, record) => (
                <Space direction="vertical" size={2}>
                  <span style={{ color: '#e0d4ff', fontWeight: 600 }}>{text}</span>
                  {record.abbr && (
                    <Tag color="purple" style={{ margin: 0, fontSize: 11 }}>{record.abbr}</Tag>
                  )}
                </Space>
              ),
            },
            {
              title: 'Определение',
              dataIndex: 'definition',
              key: 'definition',
              width: '50%',
              render: (text: string) => (
                <span style={{ color: '#aaa', lineHeight: 1.6 }}>{text}</span>
              ),
            },
            {
              title: 'Документы',
              dataIndex: 'docs',
              key: 'docs',
              width: '25%',
              render: (text: string) => (
                <Tag color={docColors[text] || 'default'} style={{ fontSize: 11 }}>
                  {text}
                </Tag>
              ),
            },
          ]}
          pagination={false}
          size="small"
          style={{ background: '#16162a' }}
          rowKey="term"
          locale={{ emptyText: 'Термин не найден' }}
        />
      </Card>

      <Paragraph style={{ color: '#666', marginTop: 16, fontSize: 12, textAlign: 'right' }}>
        Всего терминов: {filtered.length} из {glossary.length}
      </Paragraph>
    </div>
  )
}
