import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { App, Card, Select, Table, Typography } from "antd";
import type { TableProps } from "antd";
import { getUsersQueryOptions, queryKeys, updateUser } from "@/shared/api";
import type { AppRole, UserDto } from "@/shared/api/dto";
import { roleMeta } from "@/shared/lib/labels";
import { PageHeader, StatusTag } from "@/shared/ui";

const { Paragraph } = Typography;

const UsersPage = () => {
  const { message } = App.useApp();
  const queryClient = useQueryClient();
  const users = useQuery(getUsersQueryOptions());

  const roleMutation = useMutation({
    mutationFn: ({ id, role }: { id: number; role: AppRole }) =>
      updateUser(id, { displayName: null, email: null, role }),
    onSuccess: () => {
      message.success("Роль обновлена");
      void queryClient.invalidateQueries({ queryKey: queryKeys.users });
      void queryClient.invalidateQueries({ queryKey: queryKeys.authMe });
    },
    onError: () => message.error("Не удалось обновить роль"),
  });

  const columns: TableProps<UserDto>["columns"] = [
    { title: "ID", dataIndex: "id", width: 80 },
    { title: "Имя", dataIndex: "displayName", render: (value: string | null) => value ?? "—" },
    { title: "Email", dataIndex: "email", render: (value: string | null) => value ?? "—" },
    {
      title: "Текущая роль",
      dataIndex: "role",
      width: 190,
      render: (value: AppRole) => <StatusTag meta={roleMeta[value]} />,
    },
    {
      title: "Назначить роль",
      key: "change",
      width: 230,
      render: (_: unknown, record) => (
        <Select
          style={{ width: "100%" }}
          value={record.role}
          loading={roleMutation.isPending}
          onChange={(value) => roleMutation.mutate({ id: record.id, role: value })}
          options={Object.entries(roleMeta).map(([value, meta]) => ({ value, label: meta.label }))}
        />
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Пользователи и роли"
        subtitle="FR-015: RBAC — управление учётными записями и ролями."
      />

      {users.isError ? (
        <Paragraph type="danger">Не удалось загрузить пользователей. Проверьте backend.</Paragraph>
      ) : null}

      <Card>
        <Table
          rowKey="id"
          size="middle"
          loading={users.isPending}
          dataSource={users.data ?? []}
          columns={columns}
          pagination={{ pageSize: 10, showSizeChanger: false }}
        />
      </Card>
    </div>
  );
};

export default UsersPage;
