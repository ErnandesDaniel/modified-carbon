import {
  ApartmentOutlined,
  AuditOutlined,
  CloudServerOutlined,
  DashboardOutlined,
  ExperimentOutlined,
  FileDoneOutlined,
  SafetyCertificateOutlined,
  SettingOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import type { ReactNode } from "react";
import type { AppRole } from "@/shared/api/dto";

export type MenuKey =
  | "/dashboard"
  | "/sleeves"
  | "/orders"
  | "/needlecast"
  | "/validation"
  | "/certificates"
  | "/users"
  | "/audit"
  | "/settings";

export interface MenuItemDef {
  key: MenuKey;
  icon: ReactNode;
  label: string;
  roles: AppRole[];
}

const ALL_STAFF: AppRole[] = ["SLEEVE_BROKER", "NEEDLECASTER", "PSYCHOSURGEON", "ADMIN"];

export const menuDefinition: MenuItemDef[] = [
  { key: "/dashboard", icon: <DashboardOutlined />, label: "Дашборд", roles: ALL_STAFF },
  {
    key: "/sleeves",
    icon: <CloudServerOutlined />,
    label: "Каталог тел",
    roles: ["SLEEVE_BROKER", "ADMIN"],
  },
  { key: "/orders", icon: <ApartmentOutlined />, label: "Заказы", roles: ["SLEEVE_BROKER", "ADMIN"] },
  {
    key: "/needlecast",
    icon: <ExperimentOutlined />,
    label: "Needlecast",
    roles: ["NEEDLECASTER", "ADMIN"],
  },
  {
    key: "/validation",
    icon: <SafetyCertificateOutlined />,
    label: "Валидация",
    roles: ["PSYCHOSURGEON", "ADMIN"],
  },
  { key: "/certificates", icon: <FileDoneOutlined />, label: "Сертификаты", roles: ALL_STAFF },
  { key: "/users", icon: <TeamOutlined />, label: "Пользователи", roles: ["ADMIN"] },
  { key: "/audit", icon: <AuditOutlined />, label: "Аудит", roles: ["ADMIN"] },
  { key: "/settings", icon: <SettingOutlined />, label: "Настройки", roles: ALL_STAFF },
];

export const isMenuAllowed = (key: MenuKey, role: AppRole): boolean => {
  const item = menuDefinition.find((entry) => entry.key === key);
  return item ? item.roles.includes(role) : false;
};
