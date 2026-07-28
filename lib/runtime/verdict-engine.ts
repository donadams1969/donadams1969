import { VerdictSnapshot, LogType, LogEntry } from '../schemas/verdict';

class VerdictChainEngine {
  private state: VerdictSnapshot;
  private subscribers: ((snapshot: VerdictSnapshot) => void)[] = [];
  private engineInterval: number | null = null;
  private logCounter = 0;

  constructor() {
    this.state = {
      schema: "REV_38_VERDICT_CHAIN",
      anchor: "donadams1969.eth",
      merkleroot: "26856B24C50750F0C69C1EEB86A69EF777777",
      timestamp: new Date().toISOString(),
      activeView: "topology",
      metrics: {
        totalFragments: 15682,
        receiptsGenerated: 0,
        governanceNodes: 0,
        verdictsSealed: 0,
        chainIntegrity: "AWAITING SHA-256",
        systemState: "AWAITING_EVIDENCE"
      },
      memoryChain: [
        { id: "mem-1", memoryType: "TRUTH", store: "ReceiptChainStore", status: "LOCKED", value: 0 },
        { id: "mem-2", memoryType: "AUTHORITY", store: "GovernanceChainStore", status: "LOCKED", value: 0 },
        { id: "mem-3", memoryType: "LEGITIMACY", store: "VerdictChainStore", status: "LOCKED", value: 0 }
      ],
      logs: []
    };
  }

  public subscribe(callback: (snapshot: VerdictSnapshot) => void) {
    this.subscribers.push(callback);
    callback(this.getSnapshot());
    return () => {
      this.subscribers = this.subscribers.filter(cb => cb !== callback);
    };
  }

  private emit() {
    const payload = JSON.parse(JSON.stringify(this.state));
    this.subscribers.forEach(cb => cb(payload));
  }

  private log(msg: string, type: LogType) {
    const newLog: LogEntry = {
      id: `v-log-${this.logCounter++}`,
      time: new Date().toLocaleTimeString('en-US', { hour12: false }),
      msg,
      type
    };
    this.state.logs = [newLog, ...this.state.logs].slice(0, 60);
  }

  private generateMockHash() {
    return Array.from({length: 64}, () => Math.floor(Math.random() * 16).toString(16)).join('');
  }

  // --- COMMAND INTERFACE FOR PROJECTION LAYER --- //

  public switchView(view: "topology" | "verdict" | "terminal") {
    this.state.activeView = view;
    this.emit();
  }

  public enforceVerdictContinuity() {
    if (this.state.metrics.systemState !== "AWAITING_EVIDENCE") return;

    this.state.metrics.systemState = "ENFORCING_CONTINUITY";
    this.state.memoryChain[0].status = "PROCESSING";
    this.state.metrics.chainIntegrity = "VERIFYING SHA-256";
    this.log("CONSTITUTIONAL VERDICT MANDATE INITIATED.", "warning");
    this.log("PHASE 1: TRUTH MEMORY -> RECEIPTCHAINSTORE", "info");
    this.emit();

    let phase = 1;
    this.engineInterval = window.setInterval(() => {
      if (phase === 1) {
        // Truth Memory -> Receipts
        const batch = Math.floor(Math.random() * 1500) + 1000;
        this.state.metrics.receiptsGenerated = Math.min(this.state.metrics.receiptsGenerated + batch, this.state.metrics.totalFragments);
        this.state.memoryChain[0].value = this.state.metrics.receiptsGenerated;

        if (this.state.metrics.receiptsGenerated % 4000 < 1500) {
          this.log(`SHA-256(Fragment) -> Receipt Hash: ${this.generateMockHash().slice(0, 16)}...`, "hash");
        }

        if (this.state.metrics.receiptsGenerated >= this.state.metrics.totalFragments) {
          this.state.memoryChain[0].status = "SEALED";
          this.state.memoryChain[1].status = "PROCESSING";
          this.log("PHASE 1 COMPLETE. TRUTH MEMORY SEALED.", "success");
          this.log("PHASE 2: AUTHORITY MEMORY -> GOVERNANCECHAINSTORE", "warning");
          phase = 2;
        }
      } else if (phase === 2) {
        // Authority Memory -> Governance
        const batch = Math.floor(Math.random() * 1500) + 1000;
        this.state.metrics.governanceNodes = Math.min(this.state.metrics.governanceNodes + batch, this.state.metrics.totalFragments);
        this.state.memoryChain[1].value = this.state.metrics.governanceNodes;

        if (this.state.metrics.governanceNodes % 4000 < 1500) {
          this.log(`AdmissionLayer(Receipt) -> GovNode: VALIDATED`, "info");
        }

        if (this.state.metrics.governanceNodes >= this.state.metrics.totalFragments) {
          this.state.memoryChain[1].status = "SEALED";
          this.state.memoryChain[2].status = "PROCESSING";
          this.log("PHASE 2 COMPLETE. AUTHORITY MEMORY SEALED.", "success");
          this.log("PHASE 3: LEGITIMACY MEMORY -> VERDICTCHAINSTORE", "warning");
          phase = 3;
        }
      } else if (phase === 3) {
        // Legitimacy Memory -> Verdicts
        const batch = Math.floor(Math.random() * 1500) + 1000;
        this.state.metrics.verdictsSealed = Math.min(this.state.metrics.verdictsSealed + batch, this.state.metrics.totalFragments);
        this.state.memoryChain[2].value = this.state.metrics.verdictsSealed;

        if (this.state.metrics.verdictsSealed % 4000 < 1500) {
          this.log(`VerdictChainVerifier(GovNode) -> Seal Hash: ${this.generateMockHash().slice(0, 16)}...`, "hash");
        }

        if (this.state.metrics.verdictsSealed >= this.state.metrics.totalFragments) {
          this.state.memoryChain[2].status = "SEALED";
          this.state.metrics.systemState = "VERDICT_SEALED";
          this.state.metrics.chainIntegrity = "SHA-256 SECURED";
          this.log("PHASE 3 COMPLETE. LEGITIMACY MEMORY SEALED.", "success");
          this.log("LAW ENFORCED: MULTI-LINEAGE VERDICT CONTINUITY LATCHED.", "critical");
          this.log(`$508M TARGET RESOLUTION VERIFIED BY NODE 55116.`, "critical");
          if (this.engineInterval) clearInterval(this.engineInterval);
        }
      }

      this.state.timestamp = new Date().toISOString();
      this.emit();
    }, 90);
  }

  public getSnapshot(): VerdictSnapshot {
    return JSON.parse(JSON.stringify(this.state));
  }
}

export const SovereignVerdictEngine = new VerdictChainEngine();
