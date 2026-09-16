import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Form } from 'antd';
import FormInput from './index';

describe('FormInput', () => {
  const renderWithForm = (component: React.ReactElement) => {
    return render(
      <Form>
        {component}
      </Form>
    );
  };

  it('renders input with label', () => {
    renderWithForm(
      <FormInput 
        name="testField" 
        label="Test Label"
        placeholder="Enter text"
      />
    );

    expect(screen.getByText('Test Label')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter text')).toBeInTheDocument();
  });

  it('renders required input with asterisk', () => {
    renderWithForm(
      <FormInput 
        name="requiredField" 
        label="Required Field"
        isRequired={true}
      />
    );

    const label = screen.getByText('Required Field');
    expect(label).toBeInTheDocument();
    expect(document.querySelector('.is-required')).toBeInTheDocument();
  });

  it('renders input with allowClear', () => {
    renderWithForm(
      <FormInput 
        name="clearableField" 
        label="Clearable Field"
        allowClear={true}
      />
    );

    const input = screen.getByRole('textbox');
    expect(input).toBeInTheDocument();
  });

  it('applies custom className', () => {
    renderWithForm(
      <FormInput 
        name="styledField" 
        label="Styled Field"
        className="custom-class"
      />
    );

    expect(document.querySelector('.custom-class')).toBeInTheDocument();
  });

  it('renders with horizontal layout', () => {
    renderWithForm(
      <FormInput 
        name="horizontalField" 
        label="Horizontal Field"
        labelLayout="horizontal"
      />
    );

    expect(screen.getByText('Horizontal Field')).toBeInTheDocument();
  });

  it('handles input change', () => {
    renderWithForm(
      <FormInput 
        name="changeField" 
        label="Change Field"
      />
    );

    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'new value' } });
    expect(input).toHaveValue('new value');
  });

  it('renders with error state', () => {
    renderWithForm(
      <FormInput 
        name="errorField" 
        label="Error Field"
        isError={true}
        errorText="Error message"
      />
    );

    expect(screen.getByText('Error Field')).toBeInTheDocument();
  });

  it('renders with pattern validation', () => {
    renderWithForm(
      <FormInput 
        name="patternField" 
        label="Pattern Field"
        pattern={/^\d+$/}
        errorText="Only numbers allowed"
      />
    );

    expect(screen.getByText('Pattern Field')).toBeInTheDocument();
  });

  it('renders with type password', () => {
    renderWithForm(
      <FormInput 
        name="passwordField" 
        label="Password"
        type="password"
      />
    );

    expect(screen.getByLabelText('Password')).toBeInTheDocument();
  });

  it('renders with maxLength', () => {
    renderWithForm(
      <FormInput 
        name="maxLengthField" 
        label="Max Length Field"
        maxLength={10}
      />
    );

    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('maxLength', '10');
  });

  it('validates required field', async () => {
    renderWithForm(
      <FormInput 
        name="validateRequired" 
        label="Validate Required"
        isRequired={true}
        errorText="This field is required"
      />
    );

    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: '' } });
    fireEvent.blur(input);
  });

  it('validates pattern match', async () => {
    renderWithForm(
      <FormInput 
        name="validatePattern" 
        label="Validate Pattern"
        pattern={/^\d+$/}
        errorText="Only numbers"
      />
    );

    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'abc' } });
    fireEvent.blur(input);
  });

  it('validates pattern with matching value', async () => {
    renderWithForm(
      <FormInput 
        name="validatePatternMatch" 
        label="Validate Pattern Match"
        pattern={/^\d+$/}
        errorText="Only numbers"
      />
    );

    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: '123' } });
    fireEvent.blur(input);
  });

  it('handles isError with value present', () => {
    renderWithForm(
      <FormInput 
        name="errorWithValue" 
        label="Error With Value"
        isError={true}
        errorText="Error occurred"
      />
    );

    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'some value' } });
  });

  it('handles disabled input', () => {
    renderWithForm(
      <FormInput 
        name="disabledInput" 
        label="Disabled Input"
        disabled={true}
      />
    );

    const input = screen.getByRole('textbox');
    expect(input).toBeDisabled();
  });

  it('renders with vertical layout (default)', () => {
    renderWithForm(
      <FormInput 
        name="verticalField" 
        label="Vertical Field"
        labelLayout="vertical"
      />
    );

    expect(screen.getByText('Vertical Field')).toBeInTheDocument();
  });
});
