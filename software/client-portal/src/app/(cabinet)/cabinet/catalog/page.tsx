'use client';

import { App, Button, Card, Col, InputNumber, Row, Select, Space, Table, Tag, Typography } from 'antd';
import type { TableProps } from 'antd';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { apiSend } from '@/lib/api';
import { genderMeta } from '@/lib/labels';
import { useApiData } from '@/lib/use-async';
import type { OrderDto, SleeveDto, SleeveGender } from '@/lib/types';

const { Title, Paragraph } = Typography;

export default function CatalogPage() {
  const router = useRouter();
  const { message } = App.useApp();
  const [query, setQuery] = useState('availableOnly=true');
  const [gender, setGender] = useState<SleeveGender | undefined>();
  const [heightMin, setHeightMin] = useState<number | undefined>();
  const [heightMax, setHeightMax] = useState<number | undefined>();
  const [ageMin, setAgeMin] = useState<number | undefined>();
  const [ageMax, setAgeMax] = useState<number | undefined>();
  const [ordering, setOrdering] = useState<number | null>(null);

  const sleeves = useApiData<SleeveDto[]>(`/sleeves?${query}`);

  const applyFilters = () => {
    const params = new URLSearchParams({ availableOnly: 'true' });
    if (gender) params.set('gender', gender);
    if (heightMin) params.set('heightMin', String(heightMin));
    if (heightMax) params.set('heightMax', String(heightMax));
    if (ageMin) params.set('ageMin', String(ageMin));
    if (ageMax) params.set('ageMax', String(ageMax));
    setQuery(params.toString());
  };

  const order = async (sleeve: SleeveDto) => {
    setOrdering(sleeve.id);
    try {
      await apiSend<OrderDto>('POST', '/orders', {
        sleeveId: sleeve.id,
        gender: sleeve.gender,
        height: sleeve.height,
        weight: sleeve.weight,
        age: sleeve.age,
        geneticArchiveId: sleeve.geneticArchiveId
      });
      message.success(`Заказ на тело ${sleeve.code} создан. Sleeve Broker обработает его.`);
      router.push('/cabinet/orders');
    } catch {
      message.error('Не удалось создать заказ');
    } finally {
      setOrdering(null);
    }
  };

  const columns: TableProps<SleeveDto>['columns'] = [
    { title: 'ID', dataIndex: 'code', render: (v: string) => <Tag color="purple">{v}</Tag> },
    {
      title: 'Пол',
      dataIndex: 'gender',
      render: (v: SleeveGender) => <Tag color={genderMeta[v].color}>{genderMeta[v].label}</Tag>
    },
    { title: 'Рост', dataIndex: 'height', render: (v: number) => `${v} см` },
    { title: 'Вес', dataIndex: 'weight', render: (v: number) => `${v} кг` },
    { title: 'Возраст', dataIndex: 'age', render: (v: number) => `${v} лет` },
    { title: 'Генетический архив', dataIndex: 'geneticArchiveName', render: (v: string | null) => v ?? '—' },
    {
      title: '',
      key: 'action',
      width: 130,
      render: (_: unknown, record) => (
        <Button type="primary" size="small" loading={ordering === record.id} onClick={() => order(record)}>
          Заказать
        </Button>
      )
    }
  ];

  return (
    <div>
      <Title level={3} style={{ marginBottom: 4 }}>
        Каталог тел
      </Title>
      <Paragraph type="secondary">UC-01: выберите подходящее тело и оформите заказ.</Paragraph>

      <Card style={{ marginBottom: 16 }}>
        <Row gutter={[12, 12]} align="bottom">
          <Col xs={12} sm={4}>
            <Select
              placeholder="Пол"
              allowClear
              style={{ width: '100%' }}
              value={gender}
              onChange={setGender}
              options={[
                { value: 'MALE', label: 'Мужской' },
                { value: 'FEMALE', label: 'Женский' }
              ]}
            />
          </Col>
          <Col xs={6} sm={3}>
            <InputNumber placeholder="Рост от" style={{ width: '100%' }} value={heightMin} onChange={(value) => setHeightMin(value ?? undefined)} />
          </Col>
          <Col xs={6} sm={3}>
            <InputNumber placeholder="Рост до" style={{ width: '100%' }} value={heightMax} onChange={(value) => setHeightMax(value ?? undefined)} />
          </Col>
          <Col xs={6} sm={3}>
            <InputNumber placeholder="Возраст от" style={{ width: '100%' }} value={ageMin} onChange={(value) => setAgeMin(value ?? undefined)} />
          </Col>
          <Col xs={6} sm={3}>
            <InputNumber placeholder="Возраст до" style={{ width: '100%' }} value={ageMax} onChange={(value) => setAgeMax(value ?? undefined)} />
          </Col>
          <Col xs={24} sm={4}>
            <Space>
              <Button type="primary" onClick={applyFilters}>
                Найти
              </Button>
              <Button onClick={() => {
                setGender(undefined);
                setHeightMin(undefined);
                setHeightMax(undefined);
                setAgeMin(undefined);
                setAgeMax(undefined);
                setQuery('availableOnly=true');
              }}>
                Сброс
              </Button>
            </Space>
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
          locale={{ emptyText: 'Нет доступных тел по заданным фильтрам' }}
        />
      </Card>
    </div>
  );
}
