'use client';

import '@/modules/main/pages/main/components/filter-bar/index.scss';

import FormInput from '@/components/form/form-input';
import type { WeightInputsProps } from '@/modules/main/pages/main/components/filter-bar/types';

export const WeightInputs = ({ disabled }: WeightInputsProps) => (
  <div className="filter-bar__weights-container">
    <FormInput
      className="filter-bar__weight-input"
      disabled={disabled}
      label="Dense"
      max={1}
      min={0}
      name="denseWeight"
      placeholder="0.5"
      step={0.1}
      type="number"
    />
    <FormInput
      className="filter-bar__weight-input"
      disabled={disabled}
      label="Sparse"
      max={1}
      min={0}
      name="sparseWeight"
      placeholder="0.3"
      step={0.1}
      type="number"
    />
    <FormInput
      className="filter-bar__weight-input"
      disabled={disabled}
      label="Text"
      max={1}
      min={0}
      name="textWeight"
      placeholder="0.2"
      step={0.1}
      type="number"
    />
  </div>
);
