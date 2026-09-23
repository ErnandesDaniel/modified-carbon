import { Spin } from "antd";
import type { CSSProperties } from "react";

interface PageLoaderProps {
  tip?: string;
  style?: CSSProperties;
}

const PageLoader = ({ tip, style }: PageLoaderProps) => (
  <div
    style={{
      minHeight: "60vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      ...style,
    }}
  >
    <Spin size="large" tip={tip} />
  </div>
);

export default PageLoader;
