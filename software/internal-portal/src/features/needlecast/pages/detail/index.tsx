import { ArrowLeftOutlined, CheckCircleOutlined, PlayCircleOutlined, WarningOutlined } from "@ant-design/icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import {
  Alert,
  App,
  Button,
  Card,
  Descriptions,
  Input,
  Modal,
  Result,
  Select,
  Space,
  Tag,
  Typography,
} from "antd";
import { useState } from "react";
import { useSession } from "@/features/auth/model/useSession";
import { completeCase, getCaseQueryOptions, reportCaseIncident, startCase } from "@/shared/api";
import type { IncidentType } from "@/shared/api/dto";
import { formatDateTime } from "@/shared/lib/format";
import { caseStatusMeta, genderMeta, incidentTypeMeta } from "@/shared/lib/labels";
import { StatusTag } from "@/shared/ui";

const { Title, Paragraph, Text } = Typography;

const NeedlecastDetailPage = ({ id }: { id: string }) => {
  const caseId = Number(id);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useSession();
  const { message } = App.useApp();

  const [incidentOpen, setIncidentOpen] = useState(false);
  const [incidentType, setIncidentType] = useState<IncidentType>("STACK_SHOCK");
  const [incidentNote, setIncidentNote] = useState("");

  const { data: item, isPending, isError, refetch } = useQuery(getCaseQueryOptions(caseId));

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["cases"] });

  const startMutation = useMutation({
    mutationFn: () => startCase(caseId, user?.displayName ?? null),
    onSuccess: () => {
      message.success("Процедура переноса начата");
      void refetch();
    },
    onError: () => message.error("Не удалось начать процедуру"),
  });

  const completeMutation = useMutation({
    mutationFn: () => completeCase(caseId, { result: "SUCCESS" }),
    onSuccess: () => {
      message.success("Процедура завершена успешно");
      void invalidate();
      void refetch();
    },
    onError: () => message.error("Не удалось завершить процедуру"),
  });

  const incidentMutation = useMutation({
    mutationFn: () => reportCaseIncident(caseId, { type: incidentType, description: incidentNote }),
    onSuccess: () => {
      message.error("Инцидент зафиксирован, кейс заблокирован");
      setIncidentOpen(false);
      void invalidate();
      void refetch();
    },
    onError: () => message.error("Не удалось зафиксировать инцидент"),
  });

  if (isError) {
    return <Result status="404" title="Кейс не найден" subTitle="Проверьте номер кейса и доступность backend." />;
  }

  return (
    <div>
      <Button
        icon={<ArrowLeftOutlined />}
        onClick={() => void navigate({ to: "/needlecast" })}
        style={{ marginBottom: 16 }}
      >
        Назад
      </Button>

      <Title level={3} className="page-title">
        Процедура переноса {item?.code ?? ""}
      </Title>
      <Paragraph type="secondary" className="page-subtitle" style={{ marginBottom: 20 }}>
        UC-03: ConductNeedlecast
      </Paragraph>

      <Card loading={isPending} style={{ marginBottom: 16 }}>
        {item && (
          <>
            <Descriptions bordered column={{ xs: 1, sm: 2 }} size="small">
              <Descriptions.Item label="Клиент">{item.methUserName ?? "—"}</Descriptions.Item>
              <Descriptions.Item label="Кейс">
                <Tag color="purple">{item.code}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Кортикальный стек">{item.stackCode ?? "—"}</Descriptions.Item>
              <Descriptions.Item label="Тело (sleeve)">
                {item.sleeveCode}
                {item.sleeveGender
                  ? ` (${genderMeta[item.sleeveGender].label}, ${item.sleeveHeight ?? "—"} см)`
                  : ""}
              </Descriptions.Item>
              <Descriptions.Item label="Статус">
                <StatusTag meta={caseStatusMeta[item.status]} />
              </Descriptions.Item>
              <Descriptions.Item label="Needlecaster">{item.needlecasterName ?? "—"}</Descriptions.Item>
              <Descriptions.Item label="Начало">{formatDateTime(item.startTime)}</Descriptions.Item>
              <Descriptions.Item label="Завершение">{formatDateTime(item.endTime)}</Descriptions.Item>
              {item.result && (
                <Descriptions.Item label="Результат">
                  {item.result === "SUCCESS" ? (
                    <Tag color="success" icon={<CheckCircleOutlined />}>
                      Успешно
                    </Tag>
                  ) : (
                    <Tag color="error">Неудача</Tag>
                  )}
                </Descriptions.Item>
              )}
              {item.incidentType && (
                <Descriptions.Item label="Инцидент">
                  <StatusTag meta={incidentTypeMeta[item.incidentType]} />
                </Descriptions.Item>
              )}
              {item.incidentNote && (
                <Descriptions.Item label="Описание" span={2}>
                  {item.incidentNote}
                </Descriptions.Item>
              )}
            </Descriptions>

            <Space style={{ marginTop: 20 }} wrap>
              {item.status === "PENDING" && (
                <Button
                  type="primary"
                  icon={<PlayCircleOutlined />}
                  loading={startMutation.isPending}
                  onClick={() => startMutation.mutate()}
                >
                  Начать перенос
                </Button>
              )}
              {item.status === "IN_PROGRESS" && (
                <>
                  <Button
                    type="primary"
                    icon={<CheckCircleOutlined />}
                    loading={completeMutation.isPending}
                    onClick={() => completeMutation.mutate()}
                    style={{ background: "#52c41a", borderColor: "#52c41a" }}
                  >
                    Отметить результат: Успешно
                  </Button>
                  <Button danger icon={<WarningOutlined />} onClick={() => setIncidentOpen(true)}>
                    Зафиксировать инцидент
                  </Button>
                </>
              )}
              {item.status === "COMPLETED" && (
                <Button
                  type="primary"
                  onClick={() => void navigate({ to: "/validation/$id", params: { id: String(item.id) } })}
                >
                  Перейти к валидации
                </Button>
              )}
            </Space>

            {item.status === "COMPLETED" && (
              <Alert
                style={{ marginTop: 16 }}
                type="success"
                showIcon
                message="Процедура завершена успешно"
                description="Протокол сохранён. Psychosurgeon уведомлён для валидации."
              />
            )}
            {(item.status === "INCIDENT" || item.status === "CORRECTIVE") && (
              <Alert
                style={{ marginTop: 16 }}
                type="error"
                showIcon
                message="Зафиксирован инцидент"
                description={`${item.incidentNote ?? ""} Кейс заблокирован, требуется вмешательство Psychosurgeon.`}
              />
            )}
          </>
        )}
      </Card>

      <Modal
        title="Зафиксировать инцидент"
        open={incidentOpen}
        onOk={() => incidentMutation.mutate()}
        confirmLoading={incidentMutation.isPending}
        onCancel={() => setIncidentOpen(false)}
        okText="Зафиксировать"
        okButtonProps={{ danger: true }}
        cancelText="Отмена"
      >
        <Text>Тип инцидента:</Text>
        <Select
          style={{ width: "100%", margin: "8px 0 16px" }}
          value={incidentType}
          onChange={setIncidentType}
          options={Object.entries(incidentTypeMeta).map(([value, meta]) => ({
            value,
            label: meta.label,
          }))}
        />
        <Text>Описание:</Text>
        <Input.TextArea
          style={{ marginTop: 8 }}
          rows={3}
          value={incidentNote}
          onChange={(event) => setIncidentNote(event.target.value)}
          placeholder="Опишите характер инцидента"
        />
      </Modal>
    </div>
  );
};

export default NeedlecastDetailPage;
