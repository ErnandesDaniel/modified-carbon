import { useState, useMemo } from 'react'
import {
  Card, Typography, Tag, Row, Col, Select, InputNumber, Radio,
  Button, Modal, Descriptions, Badge, Tooltip, Space, Empty, message,
} from 'antd'
import {
  SearchOutlined, FilterOutlined, UserOutlined, ManOutlined, WomanOutlined,
  CheckCircleOutlined, ClockCircleOutlined, PauseCircleOutlined,
  ThunderboltOutlined,
} from '@ant-design/icons'
import { sleeves, type Sleeve, type SleeveStatus } from '../data/sleeves'

const { Title, Paragraph, Text } = Typography

const statusConfig: Record<SleeveStatus, { color: string; label: string; icon: React.ReactNode }> = {
  available:      { color: 'green',  label: 'Доступно',       icon: <CheckCircleOutlined /> },
  cultivating:    { color: 'orange', label: 'Культивирование', icon: <ClockCircleOutlined /> },
  reserved:       { color: 'blue',   label: 'Зарезервировано', icon: <PauseCircleOutlined /> },
  in_use:         { color: 'red',    label: 'Используется',    icon: <ThunderboltOutlined /> },
}

export default function SleeveCatalogPage() {
  const [filterGender, setFilterGender] = useState<string | null>(null)
  const [filterStatus, setFilterStatus] = useState<SleeveStatus | null>(null)
  const [filterAgeMin, setFilterAgeMin] = useState<number | null>(null)
  const [filterAgeMax, setFilterAgeMax] = useState<number | null>(null)
  const [filterHeightMin, setFilterHeightMin] = useState<number | null>(null)
  const [filterHeightMax, setFilterHeightMax] = useState<number | null>(null)
  const [searchText, setSearchText] = useState('')
  const [selectedSleeve, setSelectedSleeve] = useState<Sleeve | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [reserveModalOpen, setReserveModalOpen] = useState(false)

  const filtered = useMemo(() => {
    return sleeves.filter((s) => {
      if (filterGender && s.gender !== filterGender) return false
      if (filterStatus && s.status !== filterStatus) return false
      if (filterAgeMin !== null && s.age < filterAgeMin) return false
      if (filterAgeMax !== null && s.age > filterAgeMax) return false
      if (filterHeightMin !== null && s.height < filterHeightMin) return false
      if (filterHeightMax !== null && s.height > filterHeightMax) return false
      if (searchText) {
        const q = searchText.toLowerCase()
        if (!s.name.toLowerCase().includes(q) && !s.id.toLowerCase().includes(q) && !s.dnaSource.toLowerCase().includes(q)) {
          return false
        }
      }
      return true
    })
  }, [filterGender, filterStatus, filterAgeMin, filterAgeMax, filterHeightMin, filterHeightMax, searchText])

  const stats = useMemo(() => ({
    total: sleeves.length,
    available: sleeves.filter(s => s.status === 'available').length,
    cultivating: sleeves.filter(s => s.status === 'cultivating').length,
    reserved: sleeves.filter(s => s.status === 'reserved').length,
    inUse: sleeves.filter(s => s.status === 'in_use').length,
  }), [])

  const handleReserve = (sleeve: Sleeve) => {
    setSelectedSleeve(sleeve)
    setReserveModalOpen(true)
  }

  const confirmReserve = () => {
    setReserveModalOpen(false)
    message.success(`Тело ${selectedSleeve?.name} зарезервировано`)
  }

  const clearFilters = () => {
    setFilterGender(null)
    setFilterStatus(null)
    setFilterAgeMin(null)
    setFilterAgeMax(null)
    setFilterHeightMin(null)
    setFilterHeightMax(null)
    setSearchText('')
  }

  return (
    <div>
      <Title level={3} style={{ color: '#e0d4ff', marginBottom: 4 }}>
        <ManOutlined style={{ color: '#b37feb', marginRight: 12 }} />
        Каталог Sleeves
      </Title>
      <Paragraph style={{ color: '#888', marginBottom: 24 }}>
        Управление жизненным циклом клонированных тел (UC-02: ManageSleeveLifecycle)
      </Paragraph>

      {/* Stats */}
      <Row gutter={[12, 12]} style={{ marginBottom: 20 }}>
        <Col xs={12} sm={6}>
          <Card style={{ background: '#1a1a2e', border: '1px solid #2a2a4a' }} styles={{ body: { padding: 12 } }}>
            <Badge count={stats.total} showZero color="#722ed1" offset={[8, 0]}>
              <Text style={{ color: '#888', fontSize: 12 }}>Всего тел</Text>
            </Badge>
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card style={{ background: '#1a1a2e', border: '1px solid #2a2a4a' }} styles={{ body: { padding: 12 } }}>
            <Badge count={stats.available} showZero color="green" offset={[8, 0]}>
              <Text style={{ color: '#888', fontSize: 12 }}>Доступно</Text>
            </Badge>
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card style={{ background: '#1a1a2e', border: '1px solid #2a2a4a' }} styles={{ body: { padding: 12 } }}>
            <Badge count={stats.cultivating} showZero color="orange" offset={[8, 0]}>
              <Text style={{ color: '#888', fontSize: 12 }}>Культивация</Text>
            </Badge>
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card style={{ background: '#1a1a2e', border: '1px solid #2a2a4a' }} styles={{ body: { padding: 12 } }}>
            <Badge count={stats.reserved + stats.inUse} showZero color="blue" offset={[8, 0]}>
              <Text style={{ color: '#888', fontSize: 12 }}>Занято</Text>
            </Badge>
          </Card>
        </Col>
      </Row>

      {/* Filters */}
      <Card
        style={{ background: '#1a1a2e', border: '1px solid #2a2a4a', marginBottom: 20 }}
        styles={{ body: { padding: '16px 20px' } }}
      >
        <Row gutter={[12, 12]} align="middle">
          <Col xs={24} sm={8}>
            <InputNumber
              placeholder="Поиск по имени или ID..."
              prefix={<SearchOutlined style={{ color: '#666' }} />}
              value={searchText as any}
              onChange={(v) => setSearchText(v as unknown as string)}
              style={{ width: '100%' }}
              addonAfter={
                <FilterOutlined style={{ color: '#666' }} />
              }
            />
          </Col>
          <Col xs={12} sm={4}>
            <Select
              placeholder="Пол"
              allowClear
              value={filterGender}
              onChange={setFilterGender}
              style={{ width: '100%' }}
              options={[
                { value: 'М', label: 'Мужской' },
                { value: 'Ж', label: 'Женский' },
              ]}
            />
          </Col>
          <Col xs={12} sm={4}>
            <Select
              placeholder="Статус"
              allowClear
              value={filterStatus}
              onChange={setFilterStatus}
              style={{ width: '100%' }}
              options={Object.entries(statusConfig).map(([k, v]) => ({
                value: k,
                label: v.label,
              }))}
            />
          </Col>
          <Col xs={12} sm={3}>
            <InputNumber
              placeholder="Возраст от"
              min={18}
              max={60}
              value={filterAgeMin}
              onChange={setFilterAgeMin}
              style={{ width: '100%' }}
            />
          </Col>
          <Col xs={12} sm={3}>
            <InputNumber
              placeholder="Рост от (см)"
              min={140}
              max={220}
              value={filterHeightMin}
              onChange={setFilterHeightMin}
              style={{ width: '100%' }}
            />
          </Col>
          <Col xs={24} sm={2}>
            <Button onClick={clearFilters} block>Сброс</Button>
          </Col>
        </Row>
      </Card>

      {/* Results count */}
      <div style={{ marginBottom: 12 }}>
        <Text style={{ color: '#666' }}>
          Найдено: <Text style={{ color: '#b37feb' }}>{filtered.length}</Text> из {sleeves.length} тел
        </Text>
      </div>

      {/* Sleeve cards */}
      {filtered.length === 0 ? (
        <Card style={{ background: '#1a1a2e', border: '1px solid #2a2a4a' }}>
          <Empty description={<span style={{ color: '#666' }}>Нет тел, соответствующих фильтрам</span>} />
        </Card>
      ) : (
        <Row gutter={[16, 16]}>
          {filtered.map((s) => {
            const st = statusConfig[s.status]
            return (
              <Col xs={24} sm={12} lg={8} xl={6} key={s.id}>
                <Card
                  hoverable
                  onClick={() => { setSelectedSleeve(s); setModalOpen(true) }}
                  style={{
                    background: '#1a1a2e',
                    border: `1px solid ${s.status === 'available' ? '#2a4a2a' : '#2a2a4a'}`,
                    height: '100%',
                  }}
                  styles={{ body: { padding: 16 } }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                    <Tag color={st.color} icon={st.icon} style={{ margin: 0 }}>
                      {st.label}
                    </Tag>
                    <Tag style={{ margin: 0, fontSize: 11 }}>{s.id}</Tag>
                  </div>

                  <Title level={5} style={{ color: '#e0d4ff', margin: '0 0 8px', fontSize: 14 }}>
                    {s.gender === 'М' ? <ManOutlined style={{ marginRight: 4 }} /> : <WomanOutlined style={{ marginRight: 4 }} />}
                    {s.name}
                  </Title>

                  <Space direction="vertical" size={4} style={{ width: '100%', marginBottom: 8 }}>
                    <div style={{ display: 'flex', gap: 12 }}>
                      <Text style={{ color: '#888', fontSize: 12 }}>Рост: <Text style={{ color: '#ccc' }}>{s.height} см</Text></Text>
                      <Text style={{ color: '#888', fontSize: 12 }}>Вес: <Text style={{ color: '#ccc' }}>{s.weight} кг</Text></Text>
                      <Text style={{ color: '#888', fontSize: 12 }}>Возраст: <Text style={{ color: '#ccc' }}>{s.age} лет</Text></Text>
                    </div>
                    <Text style={{ color: '#666', fontSize: 11 }}>Архив: {s.dnaSource}</Text>
                  </Space>

                  <Paragraph ellipsis={{ rows: 2 }} style={{ color: '#777', fontSize: 12, margin: '0 0 8px' }}>
                    {s.notes}
                  </Paragraph>

                  {s.compatibleStacks.length > 0 && (
                    <div style={{ marginBottom: 8 }}>
                      {s.compatibleStacks.slice(0, 3).map((stk) => (
                        <Tag key={stk} style={{ margin: 1, fontSize: 10 }}>{stk}</Tag>
                      ))}
                      {s.compatibleStacks.length > 3 && (
                        <Tag style={{ margin: 1, fontSize: 10 }}>+{s.compatibleStacks.length - 3}</Tag>
                      )}
                    </div>
                  )}

                  {s.status === 'available' && (
                    <Button
                      type="primary"
                      size="small"
                      block
                      onClick={(e) => { e.stopPropagation(); handleReserve(s) }}
                      style={{ marginTop: 4 }}
                    >
                      Зарезервировать
                    </Button>
                  )}
                  {s.status === 'cultivating' && (
                    <Button size="small" block disabled style={{ marginTop: 4 }}>
                      Ожидает культивации
                    </Button>
                  )}
                </Card>
              </Col>
            )
          })}
        </Row>
      )}

      {/* Detail modal */}
      <Modal
        title={
          <Space>
            <Tag color={statusConfig[selectedSleeve?.status || 'available'].color}>
              {statusConfig[selectedSleeve?.status || 'available'].label}
            </Tag>
            <span>{selectedSleeve?.name}</span>
          </Space>
        }
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        footer={selectedSleeve?.status === 'available' ? [
          <Button key="cancel" onClick={() => setModalOpen(false)}>Закрыть</Button>,
          <Button key="reserve" type="primary" onClick={() => { setModalOpen(false); handleReserve(selectedSleeve!) }}>
            Зарезервировать
          </Button>,
        ] : [
          <Button key="ok" onClick={() => setModalOpen(false)}>Закрыть</Button>,
        ]}
        width={600}
      >
        {selectedSleeve && (
          <Descriptions bordered column={1} size="small"
            labelStyle={{ background: '#16162a', color: '#888', width: 160 }}
            contentStyle={{ background: '#1a1a2e', color: '#e0d4ff' }}
          >
            <Descriptions.Item label="ID">{selectedSleeve.id}</Descriptions.Item>
            <Descriptions.Item label="Название">{selectedSleeve.name}</Descriptions.Item>
            <Descriptions.Item label="Пол">{selectedSleeve.gender === 'М' ? 'Мужской' : 'Женский'}</Descriptions.Item>
            <Descriptions.Item label="Рост">{selectedSleeve.height} см</Descriptions.Item>
            <Descriptions.Item label="Вес">{selectedSleeve.weight} кг</Descriptions.Item>
            <Descriptions.Item label="Биологический возраст">{selectedSleeve.age} лет</Descriptions.Item>
            <Descriptions.Item label="Генетический архив">{selectedSleeve.dnaSource}</Descriptions.Item>
            <Descriptions.Item label="Статус">
              <Tag color={statusConfig[selectedSleeve.status].color}>
                {statusConfig[selectedSleeve.status].label}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Совместимые стеки">
              <Space wrap>
                {selectedSleeve.compatibleStacks.length > 0
                  ? selectedSleeve.compatibleStacks.map(s => <Tag key={s}>{s}</Tag>)
                  : <Text style={{ color: '#666' }}>Нет данных (в культивации)</Text>
                }
              </Space>
            </Descriptions.Item>
            <Descriptions.Item label="Примечания">{selectedSleeve.notes}</Descriptions.Item>
          </Descriptions>
        )}
      </Modal>

      {/* Reserve confirmation modal */}
      <Modal
        title="Подтверждение резервирования"
        open={reserveModalOpen}
        onOk={confirmReserve}
        onCancel={() => setReserveModalOpen(false)}
        okText="Зарезервировать"
        cancelText="Отмена"
        okButtonProps={{ danger: false }}
      >
        <Paragraph style={{ color: '#ccc' }}>
          Вы уверены, что хотите зарезервировать тело <Text strong style={{ color: '#b37feb' }}>{selectedSleeve?.name}</Text> ({selectedSleeve?.id})?
        </Paragraph>
        <Descriptions size="small" column={1}
          labelStyle={{ background: '#16162a', color: '#888' }}
          contentStyle={{ background: '#1a1a2e', color: '#e0d4ff' }}
        >
          <Descriptions.Item label="Тело">{selectedSleeve?.name}</Descriptions.Item>
          <Descriptions.Item label="Параметры">{selectedSleeve?.height} см / {selectedSleeve?.weight} кг / {selectedSleeve?.age} лет</Descriptions.Item>
          <Descriptions.Item label="Архив">{selectedSleeve?.dnaSource}</Descriptions.Item>
        </Descriptions>
      </Modal>
    </div>
  )
}
