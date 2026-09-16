'use client';

import { PlusOutlined, ReloadOutlined } from '@ant-design/icons';
import {
  App,
  Button,
  Card,
  Col,
  Form,
  Input,
  InputNumber,
  Modal,
  Radio,
  Row,
  Select,
  Space,
  Table,
  Tag,
  Typography
} from 'antd';
import type { TableProps } from 'antd';
import { useMemo, useState } from 'react';
import { apiSend } from '@/lib/api';
import { formatDate } from '@/lib/format';
import { genderMeta, sleeveStatusMeta } from '@/lib/labels';
import { useApiData } from '@/lib/use-async';
import type { GeneticArchiveDto, SleeveDto, SleeveGender, UserDto } from '@/lib/types';

const { Title, Paragraph } = Typography;

export default function SleevesPage() {
  const { message, modal } = App.useApp();
  const [query, setQuery] = useState('availableOnly=false');
  const sleeves = useApiData<SleeveDto[]>(`/sleeves?${query}`);
  const archives = useApiData<GeneticArchiveDto[]>('/sleeves/archives');
  const users = useApiData<UserDto[]>('/user');

  const [filters, setFilters] = useState<{ gender?: SleeveGender; status?: string; search?: string }>({});
  const [cultivationOpen, setCultivationOpen] = useState(false);
  const [reserveSleeve, setReserveSleeve] = useState<SleeveDto | null>(null);
  const [reserveUserId, setReserveUserId] = useState<number | undefined>();
  const [form] = Form.useForm();

  const clients = useMemo(() => (users.data ?? []).filter((u) => u.role === 'METH'), [users.data]);

  const applyFilters = () => {
    const params = new URLSearchParams();
    if (filters.gender) params.set('gender', filters.gender);
    if (filters.status) params.set('status', filters.status);
    if (filters.search) params.set('search', filters.search);
    setQuery(params.toString() || 'availableOnly=false');
  };

  const resetFilters = () => {
    setFilters({});
    setQuery('availableOnly=false');
  };

  const createCultivation = async () => {
    const values = await form.validateFields();
    try {
      await apiSend('POST', '/sleeves/cultivation', values);
      message.success('Заказ на культивирование создан');
      setCultivationOpen(false);
      form.resetFields();
      void sleeves.reload();
    } catch {
      message.error('Не удалось создать заказ на культивирование');
    }
  };

  const intake = async (sleeve: SleeveDto, action: 'accept' | 'reject') => {
    try {
      await apiSend('POST', `/sleeves/${sleeve.id}/intake/${action}`);
      message.success(action === 'accept' ? 'Тело принято в резерв' : 'Тело отклонено');
      void sleeves.reload();
    } catch {
      message.error('Не удалось выполнить действие');
    }
  };

  const release = (sleeve: SleeveDto) => {
    modal.confirm({
      title: `Снять резерв с тела ${sleeve.code}?`,
      onOk: async () => {
        await apiSend('POST', `/sleeves/${sleeve.id}/release`);
        message.success('Резерв снят');
        void sleeves.reload();
      }
    });
  };

  const confirmReserve = async () => {
    if (!reserveSleeve || !reserveUserId) {
      message.warning('Выберите клиента');
      return;
    }
    try {
      await apiSend('POST', `/sleeves/${reserveSleeve.id}/reserve?userId=${reserveUserId}`);
      message.success('Тело зарезервировано');
      setReserveSleeve(null);
      setReserveUserId(undefined);
      void sleeves.reload();
    } catch {
      message.error('Не удалось зарезервировать тело');
    }
  };

  const columns: TableProps<SleeveDto>['columns'] = [
    { title: 'ID', dataIndex: 'code', width: 110, render: (v: string) => <Tag color="purple">{v}</Tag> },
    {
      title: 'Пол',
      dataIndex: 'gender',
      width: 70,
      render: (v: SleeveGender) => <Tag color={genderMeta[v].color}>{genderMeta[v].label}</Tag>
    },
    { title: 'Рост', dataIndex: 'height', width: 80, render: (v: number) => `${v} см` },
    { title: 'Вес', dataIndex: 'weight', width: 80, render: (v: number) => `${v} кг` },
    { title: 'Возраст', dataIndex: 'age', width: 90, render: (v: number) => `${v} лет` },
    { title: 'Архив', dataIndex: 'geneticArchiveName', render: (v: string | null) => v ?? '—' },
    {
      title: 'Статус',
      dataIndex: 'status',
      width: 160,
      render: (v: SleeveDto['status']) => (
        <Tag color={sleeveStatusMeta[v].color}>{sleeveStatusMeta[v].label}</Tag>
      )
    },
    {
      title: 'Культивация',
      key: 'cultivation',
      width: 170,
      render: (_: unknown, record) =>
        record.status === 'CULTIVATING'
          ? `${record.cultivationStagePercent}% · до ${formatDate(record.plannedReadyAt)}`
          : '—'
    },
    {
      title: 'Действия',
      key: 'actions',
      width: 230,
      render: (_: unknown, record) => (
        <Space wrap>
          {record.status === 'INTAKE' && (
            <>
              <Button size="small" type="primary" onClick={() => intake(record, 'accept')}>
                Принять
              </Button>
              <Button size="small" danger onClick={() => intake(record, 'reject')}>
                Отклонить
              </Button>
            </>
          )}
          {record.status === 'AVAILABLE' && (
            <Button size="small" type="primary" onClick={() => setReserveSleeve(record)}>
              Зарезервировать
            </Button>
          )}
          {record.status === 'RESERVED' && (
            <>
              <Tag>За: {record.reservedForUserName ?? '—'}</Tag>
              <Button size="small" onClick={() => release(record)}>
                Снять резерв
              </Button>
            </>
          )}
        </Space>
      )
    }
  ];

  return (
    <div>
      <Title level={3} className="page-title">
        Каталог тел
      </Title>
      <Paragraph className="page-subtitle">UC-02: управление резервом, культивирование и приёмка тел.</Paragraph>

      <Card style={{ marginBottom: 16 }}>
        <Row gutter={[12, 12]} align="bottom">
          <Col xs={12} sm={4}>
            <Select
              placeholder="Пол"
              allowClear
              style={{ width: '100%' }}
              value={filters.gender}
              onChange={(value) => setFilters((prev) => ({ ...prev, gender: value }))}
              options={[
                { value: 'MALE', label: 'Мужской' },
                { value: 'FEMALE', label: 'Женский' }
              ]}
            />
          </Col>
          <Col xs={12} sm={4}>
            <Select
              placeholder="Статус"
              allowClear
              style={{ width: '100%' }}
              value={filters.status}
              onChange={(value) => setFilters((prev) => ({ ...prev, status: value }))}
              options={Object.entries(sleeveStatusMeta).map(([value, meta]) => ({ value, label: meta.label }))}
            />
          </Col>
          <Col xs={24} sm={6}>
            <Input.Search
              placeholder="Поиск по ID / донору"
              value={filters.search}
              onChange={(event) => setFilters((prev) => ({ ...prev, search: event.target.value }))}
              onSearch={applyFilters}
            />
          </Col>
          <Col xs={24} sm={6}>
            <Space>
              <Button type="primary" onClick={applyFilters}>
                Найти
              </Button>
              <Button onClick={resetFilters}>Сброс</Button>
              <Button icon={<ReloadOutlined />} onClick={() => sleeves.reload()} />
            </Space>
          </Col>
          <Col xs={24} sm={4} style={{ textAlign: 'right' }}>
            <Button type="primary" icon={<PlusOutlined />} onClick={() => setCultivationOpen(true)}>
              Культивирование
            </Button>
          </Col>
        </Row>
      </Card>

      <Card>
        <Table
          rowKey="id"
          size="middle"
          loading={sleeves.loading}
          dataSource={sleeves.data ?? []}
          columns={columns}
          pagination={{ pageSize: 8, showSizeChanger: false }}
          scroll={{ x: 1100 }}
        />
      </Card>

      <Modal
        title="Заказать культивирование тела"
        open={cultivationOpen}
        onOk={createCultivation}
        onCancel={() => setCultivationOpen(false)}
        okText="Создать заказ"
        cancelText="Отмена"
        destroyOnHidden
      >
        <Form form={form} layout="vertical" initialValues={{ gender: 'FEMALE', height: 175, weight: 70, age: 28 }}>
          <Form.Item name="geneticArchiveId" label="Генетический архив" rules={[{ required: true }]}>
            <Select
              placeholder="Выберите архив"
              options={(archives.data ?? []).map((a) => ({ value: a.id, label: a.name }))}
            />
          </Form.Item>
          <Form.Item name="gender" label="Пол" rules={[{ required: true }]}>
            <Radio.Group>
              <Radio value="MALE">М</Radio>
              <Radio value="FEMALE">Ж</Radio>
            </Radio.Group>
          </Form.Item>
          <Row gutter={12}>
            <Col span={8}>
              <Form.Item name="height" label="Рост, см" rules={[{ required: true }]}>
                <InputNumber min={140} max={220} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="weight" label="Вес, кг" rules={[{ required: true }]}>
                <InputNumber min={40} max={150} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="age" label="Возраст" rules={[{ required: true }]}>
                <InputNumber min={18} max={60} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item name="notes" label="Примечания">
            <Input.TextArea rows={2} placeholder="Например: премиум-заказ" />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title={`Резервирование тела ${reserveSleeve?.code ?? ''}`}
        open={Boolean(reserveSleeve)}
        onOk={confirmReserve}
        onCancel={() => setReserveSleeve(null)}
        okText="Зарезервировать"
        cancelText="Отмена"
      >
        <Paragraph>Выберите клиента (Meth), за которым закрепляется тело:</Paragraph>
        <Select
          style={{ width: '100%' }}
          placeholder="Клиент"
          value={reserveUserId}
          onChange={setReserveUserId}
          options={clients.map((c) => ({ value: c.id, label: c.displayName ?? `#${c.id}` }))}
          showSearch
          optionFilterProp="label"
        />
      </Modal>
    </div>
  );
}
