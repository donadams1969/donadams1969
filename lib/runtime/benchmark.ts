export interface BenchmarkMetrics {
  renderCostMs: number;
  eventLatencyMs: number;
  memoryPressureBytes?: number;
  fps: number;
  telemetryThroughput: number;
}

export class BenchmarkHarness {
  private lastFrameTime: number = performance.now();
  private frameCount: number = 0;
  private fps: number = 60;

  private eventStartTimes: Map<string, number> = new Map();
  private latencySamples: number[] = [];

  constructor() {
    this.startFPSMonitor();
  }

  private startFPSMonitor() {
    if (typeof window === 'undefined') return;

    const loop = () => {
      const now = performance.now();
      this.frameCount++;

      if (now - this.lastFrameTime >= 1000) {
        this.fps = this.frameCount;
        this.frameCount = 0;
        this.lastFrameTime = now;
      }
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
  }

  public measureRenderCost(callback: () => void): number {
    const start = performance.now();
    callback();
    return performance.now() - start;
  }

  public startEvent(eventId: string) {
    this.eventStartTimes.set(eventId, performance.now());
  }

  public endEvent(eventId: string) {
    const start = this.eventStartTimes.get(eventId);
    if (start) {
      const latency = performance.now() - start;
      this.latencySamples.push(latency);
      this.eventStartTimes.delete(eventId);
    }
  }

  public getMetrics(): BenchmarkMetrics {
    const avgLatency = this.latencySamples.length > 0
      ? this.latencySamples.reduce((a, b) => a + b, 0) / this.latencySamples.length
      : 0;

    let memoryPressureBytes;
    if (typeof window !== 'undefined' && (performance as any).memory) {
      memoryPressureBytes = (performance as any).memory.usedJSHeapSize;
    }

    return {
      renderCostMs: 0, // This would be populated by actual React Profiler in a real app
      eventLatencyMs: avgLatency,
      memoryPressureBytes,
      fps: this.fps,
      telemetryThroughput: this.latencySamples.length // Simplistic mock for throughput
    };
  }
}
