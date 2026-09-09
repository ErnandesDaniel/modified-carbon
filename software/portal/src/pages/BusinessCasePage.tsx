import { Card, Typography, Table, Tag, Row, Col, Statistic, Alert, Descriptions, Space } from 'antd'
import {
  FileTextOutlined,
  DollarOutlined,
  TrophyOutlined,
  WarningOutlined,
  CheckCircleOutlined,
  BarChartOutlined,
} from '@ant-design/icons'

const { Title, Paragraph, Text } = Typography

const costComparison = [
  { key: '1', item: 'Ведение каталога тел в Excel', before: '20 000', after: '0', change: '−20 000' },
  { key: '2', item: 'Бронирование по телефону', before: '10 000', after: '0', change: '−10 000' },
  { key: '3', item: 'Бумажные протоколы needlecast', before: '36 000', after: '0', change: '−36 000' },
  { key: '4', item: 'Ручная генерация сертификатов', before: '20 000', after: '0', change: '−20 000' },
  { key: '5', item: 'Печать и канцелярия', before: '8 000', after: '1 000', change: '−7 000' },
  { key: '6', item: 'Телефонные уведомления', before: '15 000', after: '0', change: '−15 000' },
  { key: '7', item: 'Ручной аудит-журнал', before: '5 000', after: '0', change: '−5 000' },
  { key: '8', item: 'Двойное бронирование (потери)', before: '500 000', after: '0', change: '−500 000' },
  { key: '9', item: 'Задержки подбора тела', before: '80 000', after: '5 000', change: '−75 000' },
  { key: '10', item: 'Ошибки в сертификатах', before: '50 000', after: '2 000', change: '−48 000' },
  { key: '11', item: 'Штрафы Протектората', before: '100 000', after: '10 000', change: '−90 000' },
  { key: '12', item: 'Потеря репутации', before: '150 000', after: '20 000', change: '−130 000' },
  { key: '13', item: 'Простой needlecast', before: '70 000', after: '10 000', change: '−60 000' },
  { key: '14', item: 'Лицензия SCMS', before: '0', after: '25 000', change: '+25 000' },
  { key: 'total', item: 'ИТОГО', before: '1 064 000', after: '98 000', change: '−966 000', isTotal: true },
]

const costColumns = [
  {
    title: 'Статья расходов',
    dataIndex: 'item',
    key: 'item',
    width: '40%',
    render: (text: string, record: any) => (
      <Text style={{ color: record.isTotal ? '#e0d4ff' : '#ccc', fontWeight: record.isTotal ? 700 : 400 }}>
        {text}
      </Text>
    ),
  },
  {
    title: 'До (кр/мес)',
    dataIndex: 'before',
    key: 'before',
    width: '20%',
    align: 'right' as const,
    render: (text: string, record: any) => (
      <Text style={{ color: record.isTotal ? '#e0d4ff' : '#888', fontWeight: record.isTotal ? 700 : 400 }}>
        {text}
      </Text>
    ),
  },
  {
    title: 'После (кр/мес)',
    dataIndex: 'after',
    key: 'after',
    width: '20%',
    align: 'right' as const,
    render: (text: string, record: any) => (
      <Text style={{ color: record.isTotal ? '#52c41a' : '#888', fontWeight: record.isTotal ? 700 : 400 }}>
        {text}
      </Text>
    ),
  },
  {
    title: 'Изменение',
    dataIndex: 'change',
    key: 'change',
    width: '20%',
    align: 'right' as const,
    render: (text: string, record: any) => {
      const isNegative = text.startsWith('−') || text.startsWith('-')
      return (
        <Tag color={record.isTotal ? 'green' : isNegative ? 'green' : 'red'} style={{ fontWeight: record.isTotal ? 700 : 400 }}>
          {text}
        </Tag>
      )
    },
  },
]

const roiMonths = [
  { month: '0', value: '-6 000 000' },
  { month: '1', value: '-5 034 000' },
  { month: '2', value: '-4 068 000' },
  { month: '3', value: '-3 102 000' },
  { month: '4', value: '-2 136 000' },
  { month: '5', value: '-1 170 000' },
  { month: '6', value: '-204 000' },
  { month: '7', value: '+762 000' },
  { month: '8', value: '+1 728 000' },
  { month: '9', value: '+2 694 000' },
  { month: '10', value: '+3 660 000' },
  { month: '11', value: '+4 626 000' },
  { month: '12', value: '+5 592 000' },
]

const devCosts = [
  { phase: 'Inception', hours: 200, share: '6%', cost: '710 000' },
  { phase: 'Elaboration', hours: 200, share: '38%', cost: '710 000' },
  { phase: 'Construction Iter 1', hours: 200, share: '12%', cost: '710 000' },
  { phase: 'Construction Iter 2', hours: 200, share: '12%', cost: '710 000' },
  { phase: 'Construction Iter 3', hours: 200, share: '12%', cost: '710 000' },
  { phase: 'Construction Iter 4', hours: 200, share: '12%', cost: '710 000' },
  { phase: 'Transition', hours: 160, share: '4%', cost: '568 000' },
]

export default function BusinessCasePage() {
  return (
    <div>
      <Title level={3} style={{ color: '#e0d4ff', marginBottom: 8 }}>
        <FileTextOutlined style={{ color: '#b37feb', marginRight: 12 }} />
        Business Case — SCMS
      </Title>
      <Paragraph style={{ color: '#888', marginBottom: 24 }}>
        Бизнес-обоснование разработки системы управления элитной клиникой переноса сознания
      </Paragraph>

      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={12} sm={6}>
          <Card style={{ background: '#1a1a2e', border: '1px solid #2a2a4a' }}>
            <Statistic title={<span style={{ color: '#888' }}>Бюджет</span>} value="6M" suffix="кр" prefix={<DollarOutlined style={{ color: '#faad14' }} />} />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card style={{ background: '#1a1a2e', border: '1px solid #2a2a4a' }}>
            <Statistic title={<span style={{ color: '#888' }}>Окупаемость</span>} value="6.2 мес" prefix={<TrophyOutlined style={{ color: '#52c41a' }} />} />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card style={{ background: '#1a1a2e', border: '1px solid #2a2a4a' }}>
            <Statistic title={<span style={{ color: '#888' }}>ROI (3 года)</span>} value="479.6%" prefix={<BarChartOutlined style={{ color: '#b37feb' }} />} />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card style={{ background: '#1a1a2e', border: '1px solid #2a2a4a' }}>
            <Statistic title={<span style={{ color: '#888' }}>Экономия/мес</span>} value="966K" suffix="кр" prefix={<CheckCircleOutlined style={{ color: '#52c41a' }} />} />
          </Card>
        </Col>
      </Row>

      <Card
        title={<span><FileTextOutlined style={{ marginRight: 8 }} />Описание продукта</span>}
        style={{ background: '#1a1a2e', border: '1px solid #2a2a4a', marginBottom: 16 }}
      >
        <Paragraph style={{ color: '#aaa', lineHeight: 1.8 }}>
          Разрабатываемый продукт — корпоративная информационная система <strong style={{ color: '#b37feb' }}>SCMS</strong> 
          (Sleeving Clinic Management System) для автоматизации ключевых бизнес-процессов элитной клиники 
          переноса сознания (sleeving) в Бей-Сити, 2384 год.
        </Paragraph>
        <Paragraph style={{ color: '#aaa', lineHeight: 1.8 }}>
          Использование системы позволяет значительно сократить операционные расходы клиники за счёт 
          автоматизации: учёт клонированных тел, бронирование, протоколирование переноса, формирование 
          сертификатов. Система обеспечивает защищённый личный кабинет для клиентов (Meth).
        </Paragraph>
        <Space wrap style={{ marginTop: 12 }}>
          <Tag color="purple">SCMS — Sleeving Clinic Management System</Tag>
          <Tag color="blue">Бей-Сити, 2384</Tag>
          <Tag color="green">Контрактная разработка</Tag>
        </Space>
      </Card>

      <Alert
        message="Ключевой вывод"
        description="Система полностью окупает затраты на разработку примерно через 6 месяцев эксплуатации. За трёхлетний период использования совокупный экономический эффект составляет 34 776 000 кредитов. ROI за 3 года — 479.6%."
        type="success"
        showIcon
        style={{ marginBottom: 16, background: '#1a2e1a', border: '1px solid #2a4a2a' }}
      />

      <Card
        title={<span><DollarOutlined style={{ marginRight: 8 }} />Сравнение ежемесячных расходов (кредитов/мес)</span>}
        style={{ background: '#1a1a2e', border: '1px solid #2a2a4a', marginBottom: 16 }}
      >
        <Table
          dataSource={costComparison}
          columns={costColumns}
          pagination={false}
          size="small"
          style={{ background: '#16162a' }}
          rowClassName={(record) => record.isTotal ? 'total-row' : ''}
        />
      </Card>

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Card
            title={<span><BarChartOutlined style={{ marginRight: 8 }} />Стоимость разработки</span>}
            style={{ background: '#1a1a2e', border: '1px solid #2a2a4a', marginBottom: 16 }}
          >
            <Table
              dataSource={devCosts}
              columns={[
                { title: 'Фаза', dataIndex: 'phase', key: 'phase', render: (t: string) => <Text style={{ color: '#e0d4ff' }}>{t}</Text> },
                { title: 'Часы', dataIndex: 'hours', key: 'hours', align: 'right' as const, render: (t: number) => <Text style={{ color: '#888' }}>{t}</Text> },
                { title: 'Стоимость', dataIndex: 'cost', key: 'cost', align: 'right' as const, render: (t: string) => <Text style={{ color: '#b37feb' }}>{t} кр</Text> },
              ]}
              pagination={false}
              size="small"
              style={{ background: '#16162a' }}
            />
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card
            title={<span><TrophyOutlined style={{ marginRight: 8 }} />Окупаемость по месяцам</span>}
            style={{ background: '#1a1a2e', border: '1px solid #2a2a4a', marginBottom: 16 }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {roiMonths.map((r) => {
                const val = r.value.replace(/\s/g, '')
                const isNeg = val.startsWith('-')
                const numVal = parseInt(val.replace(/[+-]/g, ''))
                const maxVal = 6000000
                const width = Math.min((numVal / maxVal) * 100, 100)
                return (
                  <div key={r.month} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Text style={{ color: '#666', width: 36, textAlign: 'right', fontSize: 12 }}>
                      {r.month} мес
                    </Text>
                    <div style={{ flex: 1, height: 20, background: '#16162a', borderRadius: 4, overflow: 'hidden' }}>
                      <div
                        style={{
                          width: `${width}%`,
                          height: '100%',
                          background: isNeg
                            ? 'linear-gradient(90deg, #ff4d4f, #ff7875)'
                            : 'linear-gradient(90deg, #52c41a, #95de64)',
                          borderRadius: 4,
                          minWidth: width > 0 ? 4 : 0,
                        }}
                      />
                    </div>
                    <Text style={{ color: isNeg ? '#ff7875' : '#95de64', width: 100, fontSize: 12 }}>
                      {r.value} кр
                    </Text>
                  </div>
                )
              })}
            </div>
          </Card>
        </Col>
      </Row>

      <Card
        title={<span><WarningOutlined style={{ marginRight: 8, color: '#faad14' }} />Ограничения</span>}
        style={{ background: '#1a1a2e', border: '1px solid #2a2a4a', marginBottom: 16 }}
      >
        <Descriptions column={1} bordered size="small" labelStyle={{ background: '#16162a', color: '#888' }} contentStyle={{ background: '#1a1a2e', color: '#aaa' }}>
          <Descriptions.Item label="Юридические">Операции с DHF законодательно не урегулированы. Система минимизирует юридические риски через аудит-лог и цифровые подписи.</Descriptions.Item>
          <Descriptions.Item label="Рыночные">12 клиник-конкурентов. Система должна давать преимущество в скорости обслуживания.</Descriptions.Item>
          <Descriptions.Item label="Безопасность">Данные шифруются квантовым алгоритмом. Доступ — только для назначенного персонала.</Descriptions.Item>
          <Descriptions.Item label="Технические">95% uptime. Поддержка стерильных условий операционной. Голосовое/жестовое управление.</Descriptions.Item>
          <Descriptions.Item label="Зависимости">Генетические архивы, охранные корпорации. Архитектура поддерживает 2+ поставщиков каждого типа.</Descriptions.Item>
        </Descriptions>
      </Card>
    </div>
  )
}
