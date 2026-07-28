export type LogType = "info" | "warning" | "success" | "critical" | "hash";

export interface LogEntry {
  id: string;
  time: string;
  msg: string;
  type: LogType;
}

export interface MultiLineageMetrics {
  totalFragments: number;
  receiptsGenerated: number;
  governanceNodes: number;
  verdictsSealed: number;
  chainIntegrity: string;
  systemState: "AWAITING_EVIDENCE" | "ENFORCING_CONTINUITY" | "VERDICT_SEALED";
}

export interface MemoryNode {
  id: string;
  memoryType: "TRUTH" | "AUTHORITY" | "LEGITIMACY";
  store: string;
  status: "LOCKED" | "PROCESSING" | "SEALED";
  value: number;
}

export interface VerdictSnapshot {
  schema: string;
  anchor: string;
  merkleroot: string;
  timestamp: string;
  activeView: "topology" | "verdict" | "terminal";
  metrics: MultiLineageMetrics;
  memoryChain: MemoryNode[];
  logs: LogEntry[];
}
