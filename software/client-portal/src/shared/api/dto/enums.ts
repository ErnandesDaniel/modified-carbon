export type AppRole = "METH" | "SLEEVE_BROKER" | "NEEDLECASTER" | "PSYCHOSURGEON" | "ADMIN";

export type SleeveGender = "MALE" | "FEMALE";

export type SleeveStatus = "CULTIVATING" | "INTAKE" | "AVAILABLE" | "RESERVED" | "IN_USE" | "WRITTEN_OFF";

export type OrderStatus = "NEW" | "AWAITING_BODY" | "CONFIRMED" | "CANCELLED";

export type CaseStatus = "PENDING" | "IN_PROGRESS" | "COMPLETED" | "INCIDENT" | "CORRECTIVE";

export type StackStatus = "STORED" | "IN_USE" | "AVAILABLE";

export type IncidentType = "STACK_SHOCK" | "REJECTION" | "STACK_DAMAGE" | "IDENTITY_FRAGMENTATION";

export type CertificateStatus = "PENDING" | "READY";

export type CheckpointStatus = "PENDING" | "PASSED" | "FAILED";

export type CheckpointCategory = "COGNITIVE" | "PHYSICAL" | "STACK" | "IDENTITY";
