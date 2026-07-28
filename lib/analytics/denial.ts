import { ReasonCode } from '../protocol/verify-contract';

export interface DenialEvent {
  timestamp: string;
  reasonCode: ReasonCode;
  signalId: string;
  context: Record<string, unknown>;
}

export class DenialAnalytics {
  private events: DenialEvent[] = [];

  public recordDenial(signalId: string, reasonCode: ReasonCode, context: Record<string, unknown> = {}): void {
    if (reasonCode === 'POLICY_ADMITTED') return;

    const event: DenialEvent = {
      timestamp: new Date().toISOString(),
      reasonCode,
      signalId,
      context
    };

    this.events.push(event);

    // In a real system, you would flush this to a time-series DB or observability platform
    console.log(`[DENIAL] Signal ${signalId} blocked: ${reasonCode}`);
  }

  public getDenialStats(): Record<ReasonCode, number> {
    const stats: Record<ReasonCode, number> = {
      POLICY_ADMITTED: 0, // Should be 0
      INVARIANT_BLOCKED: 0,
      ADVERSARY_DETECTED: 0
    };

    for (const event of this.events) {
      stats[event.reasonCode] = (stats[event.reasonCode] || 0) + 1;
    }

    return stats;
  }

  public getRecentDenials(limit: number = 10): DenialEvent[] {
    return [...this.events].reverse().slice(0, limit);
  }
}
