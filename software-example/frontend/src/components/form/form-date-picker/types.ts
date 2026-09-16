import type { NamePath, Store, StoreValue } from 'antd/es/form/interface';

export interface FormDatePickerProps {
  disabled?: boolean;
  isClearable?: boolean;
  isRequired?: boolean;
  isRange?: boolean;
  label?: string;
  name: NamePath;
  selectedYear?: number;
  errorText?: string;
  className?: string;
  disabledDates?: Date[] | ((dateForCheck: Date) => boolean);
  isError?: boolean;
  dependencies?: NamePath[];
  normalize?: (value: StoreValue, prevValue: StoreValue, allValues: Store) => StoreValue;
  isLoading?: boolean;
  wrapperClassName?: string;
  description?: string;
}
