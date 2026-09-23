import { ArrowLeftOutlined, CheckCircleOutlined, WarningOutlined } from "@ant-design/icons";
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
  Progress,
  Radio,
  Result,
  Select,
  Space,
  Tag,
  Typography,
} from "antd";
import { useState } from "react";
import {
  confirmCase,
  getCaseQueryOptions,
  getCertificateByCaseQueryOptions,
  getCheckpointsQueryOptions,
  queryKeys,
  reportCaseComplication,
  updateCheckpoint,
} from "@/shared/api";
import type { CertificateDto, CheckpointDto, CheckpointStatus, IncidentType } from "@/shared/api/dto";
import { formatDateTime } from "@/shared/lib/format";
import {
  caseStatusMeta,
  checkpointCategoryMeta,
  incidentTypeMeta,
} from "@/shared/lib/labels";
import { StatusTag } from "@/shared/ui";

const { Title, Paragraph, Text } = Typography;

const ValidationDetailPage = ({ id }: { id: string }) => {
  const caseId = Number(id);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { message } = App.useApp();

  const [complicationOpen, setComplicationOpen] = useState(false);
  const [incidentType, setIncidentType] = useState<IncidentType>("STACK_SHOCK");
  const [incidentNote, setIncidentNote] = useState("");
  const [certificate, setCertificate] = useState<CertificateDto | null>(null);

  const {
    data: item,
    isPending,
    isError,
  } = useQuery(getCaseQueryOptions(caseId));
  const checkpoints = useQuery(getCheckpointsQueryOptions(caseId));
  const certificateQuery = useQuery({
    ...getCertificateByCaseQueryOptions(caseId),
    enabled: Boolean(caseId) && item?.status === "COMPLETED",
  });

  const list = checkpoints.data ?? [];
  const passed = list.filter((checkpoint) => checkpoint.status === "PASSED").length;
  const failed = list.filter((checkpoint) => checkpoint.status === "FAILED").length;
  const percent = list.length ? Math.round((passed / list.length) * 100) : 0;
  const allPassed = list.length > 0 && passed === list.length && failed === 0;

  const markMutation = useMutation({
    mutationFn: ({ checkpointId, status }: { checkpointId: number; status: CheckpointStatus }) =>
      updateCheckpoint(checkpointId, status),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.checkpoints(caseId) });
    },
    onError: () => message.error("Не удалось обновить чекпоинт"),
  });

  const confirmMutation = useMutation({
    mutationFn: () => confirmCase(caseId),
    onSuccess: (cert) => {
      setCertificate(cert);
      message.success("Клиент сертифицирован, сертификат доступен клиенту");
      void queryClient.invalidateQueries({ queryKey: ["cases"] });
      void queryClient.invalidateQueries({ queryKey: queryKeys.certificates });
    },
    onError: () => message.error("Сертификация невозможна: есть непройденные чекпоинты"),
  });

  const complicationMutation = useMutation({
    mutationFn: () => reportCaseComplication(caseId, { type: incidentType, description: incidentNote }),
    onSuccess: () => {
      message.error("Осложнение зафиксировано, выпуск клиента заблокирован");
      setComplicationOpen(false);
      void queryClient.invalidateQueries({ queryKey: ["cases"] });
    },
    onError: () => message.error("Не удалось зафиксировать осложнение"),
  });

  const effectiveCertificate = certificate ?? certificateQuery.data ?? null;

  if (isError) {
    return <Result status="404" title="Кейс не найден" subTitle="Проверьте номер кейса и доступность backend." />;
  }

  const locked = item?.status === "CORRECTIVE" || Boolean(effectiveCertificate);

  return (
    <div>
      <Button
        icon={<ArrowLeftOutlined />}
        onClick={() => void navigate({ to: "/validation" })}
        style={{ marginBottom: 16 }}
      >
        Назад
      </Button>

      <Title level={3} className="page-title">
        Осмотр и сертификация {item?.code ?? ""}
      </Title>
      <Paragraph type="secondary" className="page-subtitle" style={{ marginBottom: 20 }}>
        UC-04: ExamineAndCertify
      </Paragraph>

      <Card loading={isPending} style={{ marginBottom: 16 }}>
        {item && (
          <Descriptions bordered column={{ xs: 1, sm: 2 }} size="small">
            <Descriptions.Item label="Клиент">{item.methUserName ?? "—"}</Descriptions.Item>
            <Descriptions.Item label="Кейс">
              <Tag color="purple">{item.code}</Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Кортикальный стек">{item.stackCode ?? "—"}</Descriptions.Item>
            <Descriptions.Item label="Тело (sleeve)">{item.sleeveCode ?? "—"}</Descriptions.Item>
            <Descriptions.Item label="Статус">
              <StatusTag meta={caseStatusMeta[item.status]} />
            </Descriptions.Item>
            <Descriptions.Item label="Завершение переноса">
              {formatDateTime(item.endTime)}
            </Descriptions.Item>
          </Descriptions>
        )}
      </Card>

      <Card title="Чек-лист осмотра" loading={checkpoints.isPending} style={{ marginBottom: 16 }}>
        <Progress
          percent={percent}
          status={failed > 0 ? "exception" : allPassed ? "success" : "active"}
          strokeColor="#722ed1"
          style={{ marginBottom: 16 }}
        />
        <Space direction="vertical" style={{ width: "100%" }} size={12}>
          {list.map((checkpoint: CheckpointDto) => (
            <Card key={checkpoint.id} size="small" style={{ background: "#fafafa" }}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
                <div style={{ maxWidth: 560 }}>
                  <Space style={{ marginBottom: 4 }} wrap>
                    <StatusTag meta={checkpointCategoryMeta[checkpoint.category]} />
                    {checkpoint.required && <Tag color="red">Обязательный</Tag>}
                  </Space>
                  <div style={{ fontWeight: 600 }}>{checkpoint.label}</div>
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    {checkpoint.description}
                  </Text>
                </div>
                <Radio.Group
                  value={checkpoint.status}
                  onChange={(event) =>
                    markMutation.mutate({
                      checkpointId: checkpoint.id,
                      status: event.target.value as CheckpointStatus,
                    })
                  }
                  disabled={Boolean(locked)}
                >
                  <Radio.Button value="PASSED">Пройден</Radio.Button>
                  <Radio.Button value="FAILED">Провал</Radio.Button>
                </Radio.Group>
              </div>
            </Card>
          ))}
        </Space>
      </Card>

      <Space wrap>
        <Button
          type="primary"
          icon={<CheckCircleOutlined />}
          disabled={!allPassed || Boolean(effectiveCertificate)}
          loading={confirmMutation.isPending}
          onClick={() => confirmMutation.mutate()}
          style={{ background: "#52c41a", borderColor: "#52c41a" }}
        >
          Подтвердить и выдать сертификат
        </Button>
        <Button
          danger
          icon={<WarningOutlined />}
          disabled={Boolean(effectiveCertificate)}
          onClick={() => setComplicationOpen(true)}
        >
          Зафиксировать осложнение
        </Button>
      </Space>

      {effectiveCertificate && (
        <Alert
          style={{ marginTop: 16 }}
          type="success"
          showIcon
          message={`Сертификат ${effectiveCertificate.code} сгенерирован`}
          description={`Код проверки: ${effectiveCertificate.verificationCode}. Сертификат доступен клиенту в личном кабинете.`}
        />
      )}
      {item?.status === "CORRECTIVE" && (
        <Alert
          style={{ marginTop: 16 }}
          type="error"
          showIcon
          message="Корректирующие процедуры"
          description={item.incidentNote ?? "Зафиксировано осложнение, выпуск клиента заблокирован."}
        />
      )}

      <Modal
        title="Зафиксировать осложнение"
        open={complicationOpen}
        onOk={() => complicationMutation.mutate()}
        confirmLoading={complicationMutation.isPending}
        onCancel={() => setComplicationOpen(false)}
        okText="Зафиксировать"
        okButtonProps={{ danger: true }}
        cancelText="Отмена"
      >
        <Text>Тип осложнения:</Text>
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
          placeholder="Опишите выявленные отклонения"
        />
      </Modal>
    </div>
  );
};

export default ValidationDetailPage;
