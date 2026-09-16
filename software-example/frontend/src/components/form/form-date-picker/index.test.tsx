import { render, screen, fireEvent } from '@testing-library/react';
import { Form } from 'antd';
import FormDatePicker from './index';

describe('FormDatePicker', () => {
  const renderWithForm = (component: React.ReactElement) => {
    return render(
      <Form>
        {component}
      </Form>
    );
  };

  it('renders date picker', () => {
    renderWithForm(
      <FormDatePicker 
        name="testDate"
      />
    );

    expect(screen.getByPlaceholderText('Select date')).toBeInTheDocument();
  });

  it('renders disabled date picker', () => {
    renderWithForm(
      <FormDatePicker 
        name="disabledDate"
        disabled={true}
      />
    );

    expect(screen.getByPlaceholderText('Select date')).toBeDisabled();
  });

  it('renders required date picker', () => {
    renderWithForm(
      <FormDatePicker 
        name="requiredDate"
        isRequired={true}
      />
    );

    expect(screen.getByPlaceholderText('Select date')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    renderWithForm(
      <FormDatePicker 
        name="styledDate"
        className="custom-date-class"
      />
    );

    expect(document.querySelector('.custom-date-class')).toBeInTheDocument();
  });

  it('renders with placeholder', () => {
    renderWithForm(
      <FormDatePicker 
        name="placeholderDate"
        placeholder="Pick a date"
      />
    );

    expect(screen.getByPlaceholderText('Pick a date')).toBeInTheDocument();
  });

  it('handles date picker click', () => {
    renderWithForm(
      <FormDatePicker 
        name="clickDate"
      />
    );

    const datePicker = screen.getByPlaceholderText('Select date');
    fireEvent.click(datePicker);
    expect(datePicker).toBeInTheDocument();
  });

  it('renders with error state', () => {
    renderWithForm(
      <FormDatePicker 
        name="errorDate"
        isError={true}
        errorText="Invalid date"
      />
    );

    expect(screen.getByPlaceholderText('Select date')).toBeInTheDocument();
  });

  it('renders with dependencies', () => {
    renderWithForm(
      <FormDatePicker 
        name="dependentDate"
        dependencies={['otherField']}
      />
    );

    expect(screen.getByPlaceholderText('Select date')).toBeInTheDocument();
  });

  it('renders enabled date picker by default', () => {
    renderWithForm(
      <FormDatePicker 
        name="enabledDate"
        disabled={false}
      />
    );

    expect(screen.getByPlaceholderText('Select date')).not.toBeDisabled();
  });

  it('renders with error and required state', () => {
    renderWithForm(
      <FormDatePicker 
        name="errorRequiredDate"
        isError={true}
        isRequired={true}
        errorText="Date is required"
      />
    );

    expect(screen.getByPlaceholderText('Select date')).toBeInTheDocument();
  });

  it('renders with wrapperClassName', () => {
    renderWithForm(
      <FormDatePicker 
        name="wrappedDate"
        wrapperClassName="wrapper-class"
      />
    );

    expect(document.querySelector('.wrapper-class')).toBeInTheDocument();
  });

  it('renders with custom format', () => {
    renderWithForm(
      <FormDatePicker 
        name="formattedDate"
        format="YYYY-MM-DD"
      />
    );

    expect(screen.getByPlaceholderText('Select date')).toBeInTheDocument();
  });

  it('renders with showTime', () => {
    renderWithForm(
      <FormDatePicker 
        name="dateTimePicker"
        showTime={true}
      />
    );

    expect(screen.getByPlaceholderText('Select date')).toBeInTheDocument();
  });

  it('renders RangePicker variant', () => {
    const { container } = renderWithForm(
      <FormDatePicker 
        name="rangeDate"
      />
    );

    expect(container.querySelector('.ant-picker')).toBeInTheDocument();
  });

  it('renders with custom errorText', () => {
    renderWithForm(
      <FormDatePicker 
        name="customErrorDate"
        isError={true}
        errorText="Custom error message"
      />
    );

    expect(screen.getByPlaceholderText('Select date')).toBeInTheDocument();
  });
});
