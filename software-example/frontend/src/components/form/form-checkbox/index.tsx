'use client';

import { Checkbox } from 'antd';
import Form from 'antd/es/form';
import { clsx } from 'clsx';
import { memo } from 'react';

import type { FormCheckboxProps } from '@/components/form/form-checkbox/types';

const FormCheckbox = ({ className, disabled, label, name }: FormCheckboxProps) => (
  <Form.Item className={clsx(className, 'form_checkbox_wrapper')} name={name} valuePropName="checked">
    <Checkbox disabled={disabled}>{label}</Checkbox>
  </Form.Item>
);

export default memo(FormCheckbox);
