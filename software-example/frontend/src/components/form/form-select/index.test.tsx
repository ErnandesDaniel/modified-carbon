import { render, screen, fireEvent } from '@testing-library/react';
import { Form } from 'antd';
import FormSelect from './index';

describe('FormSelect', () => {
  const renderWithForm = (component: React.ReactElement) => {
    return render(
      <Form>
        {component}
      </Form>
    );
  };

  it('renders select with options', () => {
    renderWithForm(
      <FormSelect 
        name="testSelect"
        options={[
          { label: 'Option 1', value: '1' },
          { label: 'Option 2', value: '2' }
        ]}
      />
    );

    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });

  it('renders disabled select', () => {
    renderWithForm(
      <FormSelect 
        name="disabledSelect"
        disabled={true}
        options={[{ label: 'Option', value: '1' }]}
      />
    );

    expect(screen.getByRole('combobox')).toBeDisabled();
  });

  it('renders required select', () => {
    renderWithForm(
      <FormSelect 
        name="requiredSelect"
        isRequired={true}
        options={[{ label: 'Option', value: '1' }]}
      />
    );

    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    renderWithForm(
      <FormSelect 
        name="styledSelect"
        className="custom-select-class"
        options={[{ label: 'Option', value: '1' }]}
      />
    );

    expect(document.querySelector('.custom-select-class')).toBeInTheDocument();
  });

  it('renders with mode multiple', () => {
    renderWithForm(
      <FormSelect 
        name="multiSelect"
        mode="multiple"
        options={[
          { label: 'Option 1', value: '1' },
          { label: 'Option 2', value: '2' }
        ]}
      />
    );

    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });

  it('renders with custom id', () => {
    renderWithForm(
      <FormSelect 
        name="idSelect"
        id="custom-select-id"
        options={[{ label: 'Option', value: '1' }]}
      />
    );

    expect(document.querySelector('#custom-select-id')).toBeInTheDocument();
  });

  it('renders with error state', () => {
    renderWithForm(
      <FormSelect 
        name="errorSelect"
        isError={true}
        errorText="Selection error"
        options={[{ label: 'Option', value: '1' }]}
      />
    );

    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });

  it('renders with dependencies', () => {
    renderWithForm(
      <FormSelect 
        name="dependentSelect"
        dependencies={['otherField']}
        options={[{ label: 'Option', value: '1' }]}
      />
    );

    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });

  it('handles select change', () => {
    renderWithForm(
      <FormSelect 
        name="changeSelect"
        options={[
          { label: 'Option 1', value: '1' },
          { label: 'Option 2', value: '2' }
        ]}
      />
    );

    const select = screen.getByRole('combobox');
    fireEvent.mouseDown(select);
    expect(select).toBeInTheDocument();
  });

  it('renders with number ruleType', () => {
    renderWithForm(
      <FormSelect 
        name="numberSelect"
        ruleType="number"
        options={[{ label: '1', value: 1 }]}
      />
    );

    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });

  it('handles multiple select with values', () => {
    const { container } = renderWithForm(
      <FormSelect 
        name="tagsSelect"
        mode="tags"
        options={[
          { label: 'Tag 1', value: 'tag1' },
          { label: 'Tag 2', value: 'tag2' }
        ]}
      />
    );

    expect(container.querySelector('.ant-select')).toBeInTheDocument();
  });

  it('renders with error and disabled state', () => {
    renderWithForm(
      <FormSelect 
        name="errorDisabledSelect"
        isError={true}
        disabled={true}
        errorText="Error message"
        options={[{ label: 'Option', value: '1' }]}
      />
    );

    expect(screen.getByRole('combobox')).toBeDisabled();
  });

  it('renders required and disabled select', () => {
    renderWithForm(
      <FormSelect 
        name="requiredDisabledSelect"
        isRequired={true}
        disabled={true}
        options={[{ label: 'Option', value: '1' }]}
      />
    );

    expect(screen.getByRole('combobox')).toBeDisabled();
  });

  it('renders with string ruleType', () => {
    renderWithForm(
      <FormSelect 
        name="stringSelect"
        ruleType="string"
        options={[{ label: 'Option', value: 'value1' }]}
      />
    );

    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });

  it('handles select with empty options', () => {
    renderWithForm(
      <FormSelect 
        name="emptySelect"
        options={[]}
      />
    );

    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });

  it('renders with showSearch', () => {
    renderWithForm(
      <FormSelect 
        name="searchableSelect"
        showSearch={true}
        options={[
          { label: 'Option 1', value: '1' },
          { label: 'Option 2', value: '2' }
        ]}
      />
    );

    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });
});
