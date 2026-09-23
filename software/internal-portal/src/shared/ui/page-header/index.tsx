import { Typography } from "antd";
import type { ReactNode } from "react";

const { Title, Paragraph } = Typography;

interface PageHeaderProps {
  title: ReactNode;
  subtitle?: ReactNode;
  extra?: ReactNode;
}

const PageHeader = ({ title, subtitle, extra }: PageHeaderProps) => (
  <div
    style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "flex-start",
      gap: 16,
      flexWrap: "wrap",
      marginBottom: 20,
    }}
  >
    <div>
      <Title level={3} className="page-title" style={{ marginBottom: subtitle ? 4 : 0 }}>
        {title}
      </Title>
      {subtitle ? (
        <Paragraph type="secondary" className="page-subtitle" style={{ marginBottom: 0 }}>
          {subtitle}
        </Paragraph>
      ) : null}
    </div>
    {extra}
  </div>
);

export default PageHeader;
