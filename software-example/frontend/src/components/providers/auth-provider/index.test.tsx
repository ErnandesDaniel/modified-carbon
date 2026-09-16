import { render } from '@testing-library/react';
import AuthProvider from './index';

describe('AuthProvider', () => {
  it('renders children with session', () => {
    render(
      <AuthProvider session={null}>
        <div data-testid="child">Child Content</div>
      </AuthProvider>
    );
  });

  it('renders children without session', () => {
    render(
      <AuthProvider session={null}>
        <div data-testid="child">Child Content</div>
      </AuthProvider>
    );
  });
});
