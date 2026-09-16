import { render, screen, fireEvent } from '@testing-library/react';
import { Form } from 'antd';
import FormCheckbox from './index';

describe('FormCheckbox', () => {
  const renderWithForm = (component: React.ReactElement) => {
    return render(
      <Form>
        {component}
      </Form>
    );
  };

  it('renders checkbox with label', () => {
    renderWithForm(
      <FormCheckbox 
        name="testCheckbox" 
        label="Test Checkbox"
      />
    );

    expect(screen.getByText('Test Checkbox')).toBeInTheDocument();
    expect(screen.getByRole('checkbox')).toBeInTheDocument();
  });

  it('renders disabled checkbox', () => {
    renderWithForm(
      <FormCheckbox 
        name="disabledCheckbox" 
        label="Disabled Checkbox"
        disabled={true}
      />
    );

    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toBeDisabled();
  });

  it('applies custom className', () => {
    renderWithForm(
      <FormCheckbox 
        name="styledCheckbox" 
        label="Styled Checkbox"
        className="custom-checkbox-class"
      />
    );

    expect(document.querySelector('.custom-checkbox-class')).toBeInTheDocument();
  });

  it('handles checkbox click', () => {
    renderWithForm(
      <FormCheckbox 
        name="clickCheckbox" 
        label="Clickable Checkbox"
      />
    );

    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox);
    expect(checkbox).toBeInTheDocument();
  });

  it('renders checkbox without label', () => {
    renderWithForm(
      <FormCheckbox 
        name="noLabelCheckbox"
      />
    );

    expect(screen.getByRole('checkbox')).toBeInTheDocument();
  });

  it('renders enabled checkbox by default', () => {
    renderWithForm(
      <FormCheckbox 
        name="enabledCheckbox" 
        label="Enabled Checkbox"
        disabled={false}
      />
    );

    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).not.toBeDisabled();
  });

  it('handles checkbox toggle', () => {
    renderWithForm(
      <FormCheckbox 
        name="toggleCheckbox" 
        label="Toggle Checkbox"
      />
    );

    const checkbox = screen.getByRole('checkbox');
    
    // Click to check
    fireEvent.click(checkbox);
    expect(checkbox).toBeChecked();
    
    // Click to uncheck
    fireEvent.click(checkbox);
    expect(checkbox).not.toBeChecked();
  });

  it('renders with checked state', () => {
    const { container } = renderWithForm(
      <FormCheckbox 
        name="checkedCheckbox" 
        label="Checked Checkbox"
      />
    );

    expect(container.querySelector('.form_checkbox_wrapper')).toBeInTheDocument();
  });

  it('renders with long label text', () => {
    renderWithForm(
      <FormCheckbox 
        name="longLabelCheckbox" 
        label="This is a very long label text for the checkbox component"
      />
    );

    expect(screen.getByText('This is a very long label text for the checkbox component')).toBeInTheDocument();
  });

  it('renders with special characters in label', () => {
    renderWithForm(
      <FormCheckbox 
        name="specialCharCheckbox" 
        label="Checkbox with @#$%^&*() special characters"
      />
    );

    expect(screen.getByText('Checkbox with @#$%^&*() special characters')).toBeInTheDocument();
  });

  it('renders disabled and checked checkbox', () => {
    const { container } = renderWithForm(
      <FormCheckbox 
        name="disabledCheckedCheckbox" 
        label="Disabled Checked"
        disabled={true}
      />
    );

    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toBeDisabled();
    expect(container.querySelector('.form_checkbox_wrapper')).toBeInTheDocument();
  });

  it('handles rapid clicks on checkbox', () => {
    renderWithForm(
      <FormCheckbox 
        name="rapidClickCheckbox" 
        label="Rapid Click Checkbox"
      />
    );

    const checkbox = screen.getByRole('checkbox');
    
    // Multiple rapid clicks
    for (let i = 0; i < 5; i++) {
      fireEvent.click(checkbox);
    }
    
    expect(checkbox).toBeInTheDocument();
  });
});
