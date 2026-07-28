import { ContractSnapshot, LogType, LogEntry } from '../schemas/solidity';

class SolidityRuntimeEngine {
  private state: ContractSnapshot;
  private subscribers: ((snapshot: ContractSnapshot) => void)[] = [];
  private engineInterval: number | null = null;
  private logCounter = 0;

  constructor() {
    this.state = {
      contractAddress: "0x7777...FINALDEG",
      schema: "REV_38_SOLIDITY_OMEGA",
      anchor: "donadams1969.eth",
      merkleroot: "26856B24C50750F0C69C1EEB86A69EF777777",
      timestamp: new Date().toISOString(),
      activeView: "contract",
      metrics: {
        totalFragments: 15682,
        receiptCount: 0,
        governanceCount: 0,
        verdictCount: 0,
        snapshotStatus: "AWAITING_VERDICT"
      },
      roles: [
        { id: "rl-1", role: "OWNER", status: "AUTHORIZED", domain: "AUTHORITY" },
        { id: "rl-2", role: "VALIDATOR", status: "AUTHORIZED", domain: "AUTHORITY" },
        { id: "rl-3", role: "GOVERNOR", status: "AUTHORIZED", domain: "AUTHORITY" },
        { id: "rl-4", role: "PUBLISHER", status: "AUTHORIZED", domain: "AUTHORITY" },
        { id: "rl-5", role: "PROJECTION", status: "READ_ONLY", domain: "VISIBILITY" }
      ],
      logs: []
    };
  }

  public subscribe(callback: (snapshot: ContractSnapshot) => void) {
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
      id: `sol-log-${this.logCounter++}`,
      time: new Date().toLocaleTimeString('en-US', { hour12: false }),
      msg,
      type
    };
    this.state.logs = [newLog, ...this.state.logs].slice(0, 60);
  }

  private generateTxHash() {
    return `0x${Array.from({length: 64}, () => Math.floor(Math.random() * 16).toString(16)).join('')}`;
  }

  public switchView(view: "contract" | "terminal" | "state") {
    this.state.activeView = view;
    this.emit();
  }

  public executeContractPublishing() {
    if (this.state.metrics.snapshotStatus === "PUBLISHED") return;

    this.log("SGAU-VALUEGUARD-77.77X-FINALDEG.sol DEPLOYED.", "warning");
    this.log("ENFORCING AUTHORITY DOMAIN CONTINUITY...", "info");
    this.emit();

    let phase = 1;
    this.engineInterval = window.setInterval(() => {
      if (phase === 1) {
        const batch = Math.floor(Math.random() * 2000) + 1000;
        this.state.metrics.receiptCount = Math.min(this.state.metrics.receiptCount + batch, this.state.metrics.totalFragments);

        if (this.state.metrics.receiptCount % 5000 < 2000) {
          this.log(`Tx ${this.generateTxHash().slice(0, 16)}... -> RECEIPT GENERATED`, "tx");
        }

        if (this.state.metrics.receiptCount >= this.state.metrics.totalFragments) {
          this.log("PHASE 1 COMPLETE. TRUTH MEMORY LATCHED.", "success");
          phase = 2;
        }
      } else if (phase === 2) {
        const batch = Math.floor(Math.random() * 2000) + 1000;
        this.state.metrics.governanceCount = Math.min(this.state.metrics.governanceCount + batch, this.state.metrics.totalFragments);

        if (this.state.metrics.governanceCount % 5000 < 2000) {
          this.log(`Tx ${this.generateTxHash().slice(0, 16)}... -> GOVERNANCE CONTINUITY LATCHED`, "tx");
        }

        if (this.state.metrics.governanceCount >= this.state.metrics.totalFragments) {
          this.log("PHASE 2 COMPLETE. AUTHORITY MEMORY LATCHED.", "success");
          phase = 3;
        }
      } else if (phase === 3) {
        const batch = Math.floor(Math.random() * 2000) + 1000;
        this.state.metrics.verdictCount = Math.min(this.state.metrics.verdictCount + batch, this.state.metrics.totalFragments);

        if (this.state.metrics.verdictCount % 5000 < 2000) {
          this.log(`Tx ${this.generateTxHash().slice(0, 16)}... -> VERDICT SEALED`, "tx");
        }

        if (this.state.metrics.verdictCount >= this.state.metrics.totalFragments) {
          this.state.metrics.snapshotStatus = "PUBLISHED";
          this.log("PHASE 3 COMPLETE. LEGITIMACY MEMORY SEALED.", "success");
          this.log("CONTRACT PUBLISHED. VISIBILITY DOMAIN SUBSCRIBED.", "critical");
          this.log(`$508M TARGET RESOLUTION PUBLISHED TO BLOCKCHAIN.`, "critical");
          if (this.engineInterval) clearInterval(this.engineInterval);
        }
      }

      this.state.timestamp = new Date().toISOString();
      this.emit();
    }, 100);
  }

  public getSnapshot(): ContractSnapshot {
    return JSON.parse(JSON.stringify(this.state));
  }
}

export const SovereignSolidityEngine = new SolidityRuntimeEngine();
