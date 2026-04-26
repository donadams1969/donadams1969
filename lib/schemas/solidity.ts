export type LogType = "info" | "warning" | "success" | "critical" | "tx";

export interface LogEntry {
  id: string;
  time: string;
  msg: string;
  type: LogType;
}

export interface ContractMetrics {
  totalFragments: number;
  receiptCount: number;
  governanceCount: number;
  verdictCount: number;
  snapshotStatus: "AWAITING_VERDICT" | "PUBLISHED";
}

export interface RoleNode {
  id: string;
  role: "OWNER" | "VALIDATOR" | "PUBLISHER" | "GOVERNOR" | "PROJECTION";
  status: "AUTHORIZED" | "READ_ONLY";
  domain: "AUTHORITY" | "VISIBILITY";
}

export interface ContractSnapshot {
  contractAddress: string;
  schema: string;
  anchor: string;
  merkleroot: string;
  timestamp: string;
  activeView: "contract" | "terminal" | "state";
  metrics: ContractMetrics;
  roles: RoleNode[];
  logs: LogEntry[];
}
