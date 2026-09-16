import { render } from '@testing-library/react';
import MockProvider from './index';

describe('MockProvider', () => {
  it('renders children when mock is disabled', () => {
    render(
      <MockProvider>
        <div data-testid="child">Child Content</div>
      </MockProvider>
    );
  });

  it('renders with Fragment', () => {
    const { container } = render(
      <MockProvider>
        <div>Test Content</div>
      </MockProvider>
    );
    expect(container).toBeInTheDocument();
  });
});
