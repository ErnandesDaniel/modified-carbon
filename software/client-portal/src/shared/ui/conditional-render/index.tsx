import type { ReactNode } from "react";

interface ConditionalRenderProps {
  children: ReactNode;
  condition: undefined | null | number | string | boolean;
}

const ConditionalRender = ({ children, condition }: ConditionalRenderProps) => {
  if (!condition) {
    return null;
  }

  return <>{children}</>;
};

export default ConditionalRender;
