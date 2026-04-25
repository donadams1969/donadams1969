export interface TraceContext {
  traceId: string;
  spanId: string;
  traceFlags: string;
}

export class TracePropagator {
  // W3C Trace Context implementation
  // Format: 00-{traceId}-{spanId}-{traceFlags}

  public static extract(traceparent: string): TraceContext | null {
    const parts = traceparent.split('-');
    if (parts.length !== 4 || parts[0] !== '00') {
      return null;
    }

    return {
      traceId: parts[1],
      spanId: parts[2],
      traceFlags: parts[3]
    };
  }

  public static inject(context: TraceContext): string {
    return `00-${context.traceId}-${context.spanId}-${context.traceFlags}`;
  }

  public static generateNewContext(): TraceContext {
    return {
      traceId: this.generateHex(32),
      spanId: this.generateHex(16),
      traceFlags: '01' // sampled
    };
  }

  private static generateHex(length: number): string {
    const chars = '0123456789abcdef';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars[Math.floor(Math.random() * chars.length)];
    }
    return result;
  }
}
