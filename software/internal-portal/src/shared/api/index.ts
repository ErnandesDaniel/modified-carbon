import { queryOptions } from "@tanstack/react-query";
import { http } from "@/shared/api/axiosInstance";
import type {
  AdminDashboardDto,
  AuditLogDto,
  CaseDto,
  CaseStatus,
  CertificateDto,
  CheckpointDto,
  CheckpointStatus,
  CompleteProcedureRequestDto,
  CultivationRequestDto,
  GeneticArchiveDto,
  IncidentRequestDto,
  OrderDto,
  OrderStatus,
  SleeveDto,
  SleeveGender,
  SleeveStatus,
  UserDto,
  UpdateUserRequestDto,
} from "@/shared/api/dto";

const httpGet = <T>(url: string, params?: Record<string, unknown>) =>
  http.get<T>(url, { params }).then((response) => response.data);

const httpPost = <T>(url: string, body?: unknown) =>
  http.post<T>(url, body).then((response) => response.data);

const httpPatch = <T>(url: string, body?: unknown) =>
  http.patch<T>(url, body).then((response) => response.data);

export interface SleevesFilter {
  status?: SleeveStatus;
  gender?: SleeveGender;
  search?: string;
  availableOnly?: boolean;
  heightMin?: number;
  heightMax?: number;
  weightMin?: number;
  weightMax?: number;
  ageMin?: number;
  ageMax?: number;
}

export const queryKeys = {
  authMe: ["auth", "me"] as const,
  dashboardAdmin: ["dashboard", "admin"] as const,
  archives: ["sleeves", "archives"] as const,
  sleeves: (filter: SleevesFilter = {}) => ["sleeves", "list", filter] as const,
  orders: (status?: OrderStatus) => ["orders", "list", status ?? null] as const,
  cases: (status?: CaseStatus) => ["cases", "list", status ?? null] as const,
  case: (id: number) => ["cases", "detail", id] as const,
  validationCases: ["cases", "validation"] as const,
  checkpoints: (caseId: number) => ["checkpoints", "list", caseId] as const,
  certificates: ["certificates", "list"] as const,
  certificateByCase: (caseId: number) => ["certificates", "case", caseId] as const,
  users: ["users", "list"] as const,
  audit: ["audit", "list"] as const,
};

/* ------------------------------------------------------------------ */
/* Auth                                                                */
/* ------------------------------------------------------------------ */

export const fetchAuthMe = () => httpGet<UserDto>("/auth/me");

export const getAuthMeQueryOptions = () =>
  queryOptions({
    queryKey: queryKeys.authMe,
    queryFn: fetchAuthMe,
    retry: false,
    staleTime: Infinity,
    meta: { isShowErrorNotification: false },
  });

export const devLogin = (name: string) => httpPost<UserDto>("/auth/dev-login", { name });

export const logout = () => httpPost<void>("/auth/logout");

/* ------------------------------------------------------------------ */
/* Dashboard                                                           */
/* ------------------------------------------------------------------ */

export const fetchAdminDashboard = () => httpGet<AdminDashboardDto>("/dashboard/admin");

export const getAdminDashboardQueryOptions = () =>
  queryOptions({
    queryKey: queryKeys.dashboardAdmin,
    queryFn: fetchAdminDashboard,
  });

/* ------------------------------------------------------------------ */
/* Sleeves                                                             */
/* ------------------------------------------------------------------ */

export const fetchSleeves = (filter: SleevesFilter = {}) =>
  httpGet<SleeveDto[]>("/sleeves", filter as Record<string, unknown>);

export const getSleevesQueryOptions = (filter: SleevesFilter = {}) =>
  queryOptions({
    queryKey: queryKeys.sleeves(filter),
    queryFn: () => fetchSleeves(filter),
  });

export const fetchArchives = () => httpGet<GeneticArchiveDto[]>("/sleeves/archives");

export const getArchivesQueryOptions = () =>
  queryOptions({
    queryKey: queryKeys.archives,
    queryFn: fetchArchives,
    staleTime: Infinity,
  });

export const orderCultivation = (body: CultivationRequestDto) =>
  httpPost<SleeveDto>("/sleeves/cultivation", body);

export const acceptIntake = (id: number) => httpPost<SleeveDto>(`/sleeves/${id}/intake/accept`);

export const rejectIntake = (id: number) => httpPost<SleeveDto>(`/sleeves/${id}/intake/reject`);

export const reserveSleeve = (id: number, userId: number) =>
  http.post<SleeveDto>(`/sleeves/${id}/reserve`, undefined, { params: { userId } }).then((r) => r.data);

export const releaseSleeve = (id: number) => httpPost<SleeveDto>(`/sleeves/${id}/release`);

/* ------------------------------------------------------------------ */
/* Orders                                                              */
/* ------------------------------------------------------------------ */

export const fetchOrders = (status?: OrderStatus) =>
  httpGet<OrderDto[]>("/orders", status ? { status } : undefined);

export const getOrdersQueryOptions = (status?: OrderStatus) =>
  queryOptions({
    queryKey: queryKeys.orders(status),
    queryFn: () => fetchOrders(status),
  });

export const confirmOrder = (id: number) => httpPost<OrderDto>(`/orders/${id}/confirm`);

export const awaitOrderBody = (id: number) => httpPost<OrderDto>(`/orders/${id}/await-body`);

export const cancelOrder = (id: number) => httpPost<OrderDto>(`/orders/${id}/cancel`);

/* ------------------------------------------------------------------ */
/* Cases / Needlecast                                                  */
/* ------------------------------------------------------------------ */

export const fetchCases = (status?: CaseStatus) =>
  httpGet<CaseDto[]>("/cases", status ? { status } : undefined);

export const getCasesQueryOptions = (status?: CaseStatus) =>
  queryOptions({
    queryKey: queryKeys.cases(status),
    queryFn: () => fetchCases(status),
  });

export const fetchCase = (id: number) => httpGet<CaseDto>(`/cases/${id}`);

export const getCaseQueryOptions = (id: number) =>
  queryOptions({
    queryKey: queryKeys.case(id),
    queryFn: () => fetchCase(id),
    enabled: Boolean(id),
  });

export const startCase = (id: number, needlecasterName: string | null) =>
  httpPost<CaseDto>(`/cases/${id}/start`, { needlecasterName });

export const completeCase = (id: number, result: CompleteProcedureRequestDto) =>
  httpPost<CaseDto>(`/cases/${id}/complete`, result);

export const reportCaseIncident = (id: number, body: IncidentRequestDto) =>
  httpPost<CaseDto>(`/cases/${id}/incident`, body);

/* ------------------------------------------------------------------ */
/* Validation / Certificates                                           */
/* ------------------------------------------------------------------ */

export const fetchValidationCases = () => httpGet<CaseDto[]>("/cases/validation");

export const getValidationCasesQueryOptions = () =>
  queryOptions({
    queryKey: queryKeys.validationCases,
    queryFn: fetchValidationCases,
  });

export const fetchCheckpoints = (caseId: number) =>
  httpGet<CheckpointDto[]>(`/cases/${caseId}/checkpoints`);

export const getCheckpointsQueryOptions = (caseId: number) =>
  queryOptions({
    queryKey: queryKeys.checkpoints(caseId),
    queryFn: () => fetchCheckpoints(caseId),
    enabled: Boolean(caseId),
  });

export const updateCheckpoint = (id: number, status: CheckpointStatus) =>
  httpPatch<CheckpointDto>(`/checkpoints/${id}`, { status });

export const confirmCase = (id: number) => httpPost<CertificateDto>(`/cases/${id}/confirm`);

export const reportCaseComplication = (id: number, body: IncidentRequestDto) =>
  httpPost<void>(`/cases/${id}/complications`, body);

export const fetchCertificates = () => httpGet<CertificateDto[]>("/certificates");

export const getCertificatesQueryOptions = () =>
  queryOptions({
    queryKey: queryKeys.certificates,
    queryFn: fetchCertificates,
  });

export const fetchCertificateByCase = (caseId: number) =>
  httpGet<CertificateDto>(`/certificates/case/${caseId}`);

export const getCertificateByCaseQueryOptions = (caseId: number) =>
  queryOptions({
    queryKey: queryKeys.certificateByCase(caseId),
    queryFn: () => fetchCertificateByCase(caseId),
    enabled: Boolean(caseId),
    retry: false,
    meta: { isShowErrorNotification: false },
  });

/* ------------------------------------------------------------------ */
/* Users / Audit                                                       */
/* ------------------------------------------------------------------ */

export const fetchUsers = () => httpGet<UserDto[]>("/user");

export const getUsersQueryOptions = () =>
  queryOptions({
    queryKey: queryKeys.users,
    queryFn: fetchUsers,
  });

export const fetchMe = () => httpGet<UserDto>("/user/me");

export const updateUser = (id: number, body: UpdateUserRequestDto) =>
  httpPatch<UserDto>(`/user/${id}`, body);

export const updateMe = (body: UpdateUserRequestDto) => httpPatch<UserDto>("/user/me", body);

export const fetchAudit = () => httpGet<AuditLogDto[]>("/audit");

export const getAuditQueryOptions = () =>
  queryOptions({
    queryKey: queryKeys.audit,
    queryFn: fetchAudit,
  });
