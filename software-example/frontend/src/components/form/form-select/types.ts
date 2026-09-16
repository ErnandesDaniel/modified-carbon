import type { RuleObject } from 'antd/es/form';
import type { NamePath } from 'antd/es/form/interface';
import type { CSSProperties } from 'react';

export type SelectOptionsArrayType = {
  value: string | number;
  label: string | number;
}[];

export interface FormSelectProps {
  className?: string;
  errorText?: string;
  disabled?: boolean;
  isError?: boolean;
  isRequired?: boolean;
  label?: string;
  name: NamePath;
  options: SelectOptionsArrayType;
  placeholder?: string;
  ruleType?: RuleObject['type'];
  dependencies?: string[];
  isLoading?: boolean;
  style?: CSSProperties;
}
