import { ReceiptV1 } from '../protocol/verify-contract';

export interface AuditEvent {
  eventId: string;
  previousHash: string;
  receipt: ReceiptV1;
  timestamp: string;
}

export class ReplayEngine {
  private chain: AuditEvent[] = [];

  constructor(initialChain: AuditEvent[] = []) {
    this.chain = initialChain;
  }

  public reconstruct(events: AuditEvent[]): boolean {
    if (events.length === 0) return true;

    // Validate the link between existing chain and new events
    if (this.chain.length > 0) {
      const lastExisting = this.chain[this.chain.length - 1];
      if (events[0].previousHash !== lastExisting.receipt.receiptHash) {
         console.error(`Broken chain link detected connecting to existing chain at event ${events[0].eventId}`);
         return false;
      }
    }

    // Validate internal chain linkage
    for (let i = 1; i < events.length; i++) {
      const current = events[i];
      const previous = events[i - 1];

      // In a real system, you'd re-hash `previous` and compare it to `current.previousHash`
      // For this mock implementation, we just check if it matches the stored receiptHash
      if (current.previousHash !== previous.receipt.receiptHash) {
        console.error(`Broken chain link detected at event ${current.eventId}`);
        return false;
      }
    }

    this.chain = [...this.chain, ...events];
    return true;
  }

  public getDecisionHistory(): ReceiptV1[] {
    return this.chain.map(event => event.receipt);
  }

  public verifyStateAtPoint(eventId: string): ReceiptV1 | null {
    const event = this.chain.find(e => e.eventId === eventId);
    return event ? event.receipt : null;
  }
}
