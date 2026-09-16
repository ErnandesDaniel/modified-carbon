import { render } from '@testing-library/react';
import RestProvider from './index';
import NotificationProvider from '@/components/providers/notification-provider';

describe('RestProvider', () => {
  it('renders children', () => {
    render(
      <NotificationProvider>
        <RestProvider>
          <div data-testid="child">Child Content</div>
        </RestProvider>
      </NotificationProvider>
    );
  });

  it('renders with QueryClientProvider', () => {
    render(
      <NotificationProvider>
        <RestProvider>
          <div data-testid="query-child">Query Child</div>
        </RestProvider>
      </NotificationProvider>
    );
  });
});
