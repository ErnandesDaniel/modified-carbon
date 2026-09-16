import { render } from '@testing-library/react';
import NotificationProvider, { NotificationContext } from './index';
import { useContext } from 'react';

// Test component that uses the context
const TestComponent = () => {
  const notification = useContext(NotificationContext);
  return <div data-testid="notification-value">{notification ? 'has-notification' : 'no-notification'}</div>;
};

describe('NotificationProvider', () => {
  it('renders children', () => {
    render(
      <NotificationProvider>
        <div data-testid="child">Child Content</div>
      </NotificationProvider>
    );
  });

  it('provides notification context', () => {
    render(
      <NotificationProvider>
        <TestComponent />
      </NotificationProvider>
    );
  });
});
