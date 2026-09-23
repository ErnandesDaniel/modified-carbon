import { Tag } from "antd";
import type { Meta } from "@/shared/lib/labels";

const StatusTag = ({ meta }: { meta: Meta }) => <Tag color={meta.color}>{meta.label}</Tag>;

export default StatusTag;
