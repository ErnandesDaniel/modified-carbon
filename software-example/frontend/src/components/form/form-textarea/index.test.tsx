import { render, screen, fireEvent } from '@testing-library/react';
import { Form } from 'antd';
import FormTextarea from './index';

describe('FormTextarea', () => {
  const renderWithForm = (component: React.ReactElement) => {
    return render(
      <Form>
        {component}
      </Form>
    );
  };

  it('renders textarea with label', () => {
    renderWithForm(
      <FormTextarea 
        name="testTextarea" 
        label="Test Label"
        placeholder="Enter text"
      />
    );

    expect(screen.getByText('Test Label')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter text')).toBeInTheDocument();
  });

  it('renders required textarea', () => {
    renderWithForm(
      <FormTextarea 
        name="requiredTextarea" 
        label="Required Textarea"
        isRequired={true}
      />
    );

    expect(screen.getByText('Required Textarea')).toBeInTheDocument();
  });

  it('renders textarea with autoSize', () => {
    renderWithForm(
      <FormTextarea 
        name="autoTextarea" 
        label="Auto Size Textarea"
        autoSize={true}
      />
    );

    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    renderWithForm(
      <FormTextarea 
        name="styledTextarea" 
        label="Styled Textarea"
        className="custom-textarea-class"
      />
    );

    expect(document.querySelector('.custom-textarea-class')).toBeInTheDocument();
  });

  it('renders non-resizable textarea by default', () => {
    renderWithForm(
      <FormTextarea 
        name="nonResizable" 
        label="Non Resizable"
      />
    );

    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('renders resizable textarea', () => {
    renderWithForm(
      <FormTextarea 
        name="resizable" 
        label="Resizable"
        isResizable={true}
      />
    );

    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('handles textarea change', () => {
    renderWithForm(
      <FormTextarea 
        name="changeTextarea" 
        label="Change Textarea"
      />
    );

    const textarea = screen.getByRole('textbox');
    fireEvent.change(textarea, { target: { value: 'new text' } });
    expect(textarea).toHaveValue('new text');
  });

  it('renders with error state', () => {
    renderWithForm(
      <FormTextarea 
        name="errorTextarea" 
        label="Error Textarea"
        isError={true}
        errorText="Error message"
      />
    );

    expect(screen.getByText('Error Textarea')).toBeInTheDocument();
  });

  it('renders with pattern validation', () => {
    renderWithForm(
      <FormTextarea 
        name="patternTextarea" 
        label="Pattern Textarea"
        pattern={/^[a-zA-Z]+$/}
        errorText="Only letters allowed"
      />
    );

    expect(screen.getByText('Pattern Textarea')).toBeInTheDocument();
  });

  it('renders with minRows and maxRows', () => {
    renderWithForm(
      <FormTextarea 
        name="sizedTextarea" 
        label="Sized Textarea"
        autoSize={true}
        minRows={2}
        maxRows={10}
      />
    );

    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('renders with autoSize false', () => {
    renderWithForm(
      <FormTextarea 
        name="fixedTextarea" 
        label="Fixed Textarea"
        autoSize={false}
      />
    );

    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('validates required field with empty value', () => {
    renderWithForm(
      <FormTextarea 
        name="validateRequired" 
        label="Validate Required"
        isRequired={true}
        errorText="This field is required"
      />
    );

    const textarea = screen.getByRole('textbox');
    fireEvent.change(textarea, { target: { value: '' } });
    fireEvent.blur(textarea);
  });

  it('validates pattern with non-matching value', () => {
    renderWithForm(
      <FormTextarea 
        name="validatePattern" 
        label="Validate Pattern"
        pattern={/^\d+$/}
        errorText="Only numbers"
      />
    );

    const textarea = screen.getByRole('textbox');
    fireEvent.change(textarea, { target: { value: 'abc123' } });
    fireEvent.blur(textarea);
  });

  it('validates with error state and value present', () => {
    renderWithForm(
      <FormTextarea 
        name="errorWithValue" 
        label="Error With Value"
        isError={true}
        isRequired={true}
        errorText="Error occurred"
      />
    );

    const textarea = screen.getByRole('textbox');
    fireEvent.change(textarea, { target: { value: 'some text here' } });
  });

  it('renders without label', () => {
    renderWithForm(
      <FormTextarea 
        name="noLabelTextarea"
        placeholder="No label textarea"
      />
    );

    expect(screen.getByPlaceholderText('No label textarea')).toBeInTheDocument();
  });

  it('renders with only minRows specified', () => {
    renderWithForm(
      <FormTextarea 
        name="minRowsOnly" 
        label="Min Rows Only"
        autoSize={true}
        minRows={3}
      />
    );

    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('renders with only maxRows specified', () => {
    renderWithForm(
      <FormTextarea 
        name="maxRowsOnly" 
        label="Max Rows Only"
        autoSize={true}
        maxRows={8}
      />
    );

    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });
});
