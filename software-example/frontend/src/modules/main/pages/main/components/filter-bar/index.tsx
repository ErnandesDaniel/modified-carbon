'use client';

import '@/modules/main/pages/main/components/filter-bar/index.scss';

import { Card, Collapse, Flex, Form, Typography } from 'antd';
import { useEffect, useMemo } from 'react';
import { useDebounceValue } from 'usehooks-ts';

import FormCheckbox from '@/components/form/form-checkbox';
import FormInput from '@/components/form/form-input';
import type { FilterBarProps } from '@/modules/main/pages/main/components/filter-bar/types';
import { WeightInputs } from '@/modules/main/pages/main/components/filter-bar/weight-inputs';
import type { FilterFormValues } from '@/modules/main/pages/main/types';

const { Text } = Typography;

const DEFAULT_VALUES: Required<
  Pick<FilterFormValues, 'semanticLimit' | 'denseWeight' | 'sparseWeight' | 'textWeight'>
> = {
  denseWeight: 0.5,
  semanticLimit: 5,
  sparseWeight: 0.3,
  textWeight: 0.2
};

export const FilterBar = ({ onFilterChange }: FilterBarProps) => {
  const [form] = Form.useForm<FilterFormValues>();

  // Следим за значениями формы через функцию-селектор с дефолтами
  const { denseWeight, searchQuery, semanticLimit, sparseWeight, textWeight, useSemanticSearch } =
    Form.useWatch(
      ({ denseWeight, searchQuery, semanticLimit, sparseWeight, textWeight, useSemanticSearch }) => ({
        denseWeight: denseWeight ?? DEFAULT_VALUES.denseWeight,
        searchQuery,
        semanticLimit: semanticLimit ?? DEFAULT_VALUES.semanticLimit,
        sparseWeight: sparseWeight ?? DEFAULT_VALUES.sparseWeight,
        textWeight: textWeight ?? DEFAULT_VALUES.textWeight,
        useSemanticSearch: useSemanticSearch ?? false
      }),
      form
    ) ?? DEFAULT_VALUES;

  // Debounce для поиска
  const [debouncedQuery] = useDebounceValue(searchQuery, 300);

  // Отправляем изменения наружу
  useEffect(() => {
    const effectiveLimit = useSemanticSearch ? semanticLimit : undefined;
    onFilterChange(debouncedQuery, useSemanticSearch, effectiveLimit, denseWeight, sparseWeight, textWeight);
  }, [debouncedQuery, useSemanticSearch, semanticLimit, denseWeight, sparseWeight, textWeight, onFilterChange]);

  // Initial values для формы - мемоизируем чтобы не создавать новый объект при каждом рендере
  const initialValues = useMemo(
    () => ({
      denseWeight: DEFAULT_VALUES.denseWeight,
      semanticLimit: DEFAULT_VALUES.semanticLimit,
      sparseWeight: DEFAULT_VALUES.sparseWeight,
      textWeight: DEFAULT_VALUES.textWeight
    }),
    []
  );

  // Items для Collapse с useMemo для оптимизации
  const collapseItems = useMemo(
    () => [
      {
        children: <WeightInputs disabled={!useSemanticSearch} />,
        disabled: !useSemanticSearch,
        key: 'weights',
        label: <Text type="secondary">Настройка весов поиска (семантический)</Text>
      }
    ],
    [useSemanticSearch]
  );

  return (
    <Card>
      <Form form={form} initialValues={initialValues}>
        <Flex align="flex-start" gap="middle">
          <div className="filter-bar__search-container">
            <FormInput allowClear label="Поиск заметок по title, description, url" name="searchQuery" />
          </div>
          <Flex vertical className="filter-bar__options-container" gap="small">
            <FormCheckbox label="Семантический поиск" name="useSemanticSearch" />
            <FormInput
              disabled={!useSemanticSearch}
              label="Кол-во результатов:"
              labelLayout="horizontal"
              max={100}
              min={1}
              name="semanticLimit"
              type="number"
            />
          </Flex>
        </Flex>
        <Collapse ghost className="filter-bar__collapse" items={collapseItems} />
      </Form>
    </Card>
  );
};
