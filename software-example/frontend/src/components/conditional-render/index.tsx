import type { ReactNode } from 'react';

interface ConditionalRenderProps {
  children: ReactNode;
  condition: undefined | number | string | boolean;
}
const Index = ({ children, condition }: ConditionalRenderProps) => {
  if (!condition) {
    return null;
  }

  return children;
};

export default Index;
