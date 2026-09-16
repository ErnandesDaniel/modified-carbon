import { render, screen } from '@testing-library/react';
import ConditionalRender from './index';

describe('ConditionalRender', () => {
  it('renders children when condition is true', () => {
    render(
      <ConditionalRender condition={true}>
        <div data-testid="child">Visible Content</div>
      </ConditionalRender>
    );

    expect(screen.getByTestId('child')).toBeInTheDocument();
  });

  it('does not render children when condition is false', () => {
    render(
      <ConditionalRender condition={false}>
        <div data-testid="child">Hidden Content</div>
      </ConditionalRender>
    );

    expect(screen.queryByTestId('child')).not.toBeInTheDocument();
  });

  it('renders children when condition is a non-zero number', () => {
    render(
      <ConditionalRender condition={5}>
        <div data-testid="child">Visible Content</div>
      </ConditionalRender>
    );

    expect(screen.getByTestId('child')).toBeInTheDocument();
  });

  it('does not render children when condition is zero', () => {
    render(
      <ConditionalRender condition={0}>
        <div data-testid="child">Hidden Content</div>
      </ConditionalRender>
    );

    expect(screen.queryByTestId('child')).not.toBeInTheDocument();
  });

  it('renders children when condition is a non-empty string', () => {
    render(
      <ConditionalRender condition="hello">
        <div data-testid="child">Visible Content</div>
      </ConditionalRender>
    );

    expect(screen.getByTestId('child')).toBeInTheDocument();
  });

  it('does not render children when condition is undefined', () => {
    render(
      <ConditionalRender condition={undefined}>
        <div data-testid="child">Hidden Content</div>
      </ConditionalRender>
    );

    expect(screen.queryByTestId('child')).not.toBeInTheDocument();
  });

  it('does not render children when condition is empty string', () => {
    render(
      <ConditionalRender condition="">
        <div data-testid="child">Hidden Content</div>
      </ConditionalRender>
    );

    expect(screen.queryByTestId('child')).not.toBeInTheDocument();
  });

  it('renders children when condition is negative number', () => {
    render(
      <ConditionalRender condition={-5}>
        <div data-testid="child">Visible Content</div>
      </ConditionalRender>
    );

    expect(screen.getByTestId('child')).toBeInTheDocument();
  });

  it('does not render children when condition is null', () => {
    render(
      <ConditionalRender condition={null as unknown as boolean}>
        <div data-testid="child">Hidden Content</div>
      </ConditionalRender>
    );

    expect(screen.queryByTestId('child')).not.toBeInTheDocument();
  });

  it('renders children with nested content', () => {
    render(
      <ConditionalRender condition={true}>
        <div>
          <span data-testid="nested">Nested Content</span>
        </div>
      </ConditionalRender>
    );

    expect(screen.getByTestId('nested')).toBeInTheDocument();
  });

  it('renders children when condition is 1', () => {
    render(
      <ConditionalRender condition={1}>
        <div data-testid="child">One is truthy</div>
      </ConditionalRender>
    );

    expect(screen.getByTestId('child')).toBeInTheDocument();
  });

  it('does not render when condition is -0', () => {
    render(
      <ConditionalRender condition={-0}>
        <div data-testid="child">Negative zero</div>
      </ConditionalRender>
    );

    expect(screen.queryByTestId('child')).not.toBeInTheDocument();
  });

  it('renders children with multiple children', () => {
    render(
      <ConditionalRender condition={true}>
        <div data-testid="child1">Child 1</div>
        <div data-testid="child2">Child 2</div>
        <div data-testid="child3">Child 3</div>
      </ConditionalRender>
    );

    expect(screen.getByTestId('child1')).toBeInTheDocument();
    expect(screen.getByTestId('child2')).toBeInTheDocument();
    expect(screen.getByTestId('child3')).toBeInTheDocument();
  });

  it('does not render any children when condition is false', () => {
    render(
      <ConditionalRender condition={false}>
        <div data-testid="child1">Child 1</div>
        <div data-testid="child2">Child 2</div>
        <div data-testid="child3">Child 3</div>
      </ConditionalRender>
    );

    expect(screen.queryByTestId('child1')).not.toBeInTheDocument();
    expect(screen.queryByTestId('child2')).not.toBeInTheDocument();
    expect(screen.queryByTestId('child3')).not.toBeInTheDocument();
  });

  it('renders with string "false" as truthy', () => {
    render(
      <ConditionalRender condition="false">
        <div data-testid="child">String false is truthy</div>
      </ConditionalRender>
    );

    expect(screen.getByTestId('child')).toBeInTheDocument();
  });

  it('renders with string "0" as truthy', () => {
    render(
      <ConditionalRender condition="0">
        <div data-testid="child">String zero is truthy</div>
      </ConditionalRender>
    );

    expect(screen.getByTestId('child')).toBeInTheDocument();
  });

  it('renders children with React components', () => {
    const TestComponent = () => <div data-testid="component">Test Component</div>;
    
    render(
      <ConditionalRender condition={true}>
        <TestComponent />
      </ConditionalRender>
    );

    expect(screen.getByTestId('component')).toBeInTheDocument();
  });
});
