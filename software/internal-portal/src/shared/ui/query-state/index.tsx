import { Alert, Spin } from "antd";
import type { ReactNode } from "react";

interface QueryStateProps {
  loading?: boolean;
  error?: unknown;
  children: ReactNode;
}

const QueryState = ({ loading, error, children }: QueryStateProps) => {
  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", padding: 48 }}>
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert
        type="error"
        showIcon
        message="Не удалось загрузить данные"
        description={error instanceof Error ? error.message : "Проверьте, что backend доступен на :3001."}
      />
    );
  }

  return children;
};

export default QueryState;
