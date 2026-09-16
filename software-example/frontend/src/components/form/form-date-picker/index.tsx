'use client';

import { DatePicker, Form } from 'antd';
import type { Rule as FormRule } from 'antd/es/form';
import { clsx } from 'clsx';
import { memo, useMemo } from 'react';

import type { FormDatePickerProps } from '@/components/form/form-date-picker/types';

const FormDatePicker = ({
  className,
  dependencies,
  disabled = false,
  errorText,
  isError = false,
  isRequired = false,
  name,
  normalize,
  wrapperClassName,
  ...rest
}: FormDatePickerProps) => {
  const { rule } = useMemo<Record<string, FormRule[]>>(
    () => ({
      rule: [
        {
          message: errorText,
          required: isRequired,
          type: 'date',
          validator: (_, value) =>
            isError ||
            (isRequired && !value && !disabled) ||
            (isRequired &&
              !disabled &&
              !((value && Array.isArray(value) && value.length > 0) || (value && value instanceof Date)))
              ? Promise.reject(new Error(errorText))
              : Promise.resolve()
        }
      ]
    }),
    [errorText, isError, isRequired, disabled]
  );

  return (
    <Form.Item
      className={clsx(wrapperClassName, 'form_date_picker_wrapper')}
      dependencies={dependencies}
      name={name}
      normalize={normalize}
      rules={rule}
    >
      <DatePicker disabled={disabled} {...rest} className={clsx(className, 'date_picker_wrapper')} />
    </Form.Item>
  );
};

export default memo(FormDatePicker);
