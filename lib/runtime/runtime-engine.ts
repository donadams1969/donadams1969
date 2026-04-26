import { LogEvent } from '../../contracts/runtime';
import { MESSAGES } from '../../content/messages';

export class RuntimeEngine {
  private _bootSequence: number = 0;
  private _extractionProgress: number = 0;
  private _isExtracted: boolean = false;
  private _logs: LogEvent[] = [];

  private bootInterval: number | null = null;
  private extractionInterval: number | null = null;

  public readonly TOTAL_FRAGMENTS = 15682;

  // React hook adapter logic to interact cleanly with this pure engine
  public onStateChange: (() => void) | null = null;

  public startBootSequence(): void {
    if (this.bootInterval !== null) return;

    this.bootInterval = window.setInterval(() => {
      if (this._bootSequence >= 100) {
        if (this.bootInterval) clearInterval(this.bootInterval);
        this._bootSequence = 100;
      } else {
        this._bootSequence += 2;
      }
      this.notify();
    }, 20);
  }

  public runExtraction(): void {
    if (this._isExtracted || this.extractionInterval !== null) return;

    this._extractionProgress = 0;
    this.addLog("INITIATING MODULAR RUNTIME SEPARATION...", "warning");
    this.addLog("EXTRACTING AUTHORITY FROM PRESENTATION LAYER...", "info");

    this.extractionInterval = window.setInterval(() => {
      const burst = Math.floor(Math.random() * 500) + 300;
      this._extractionProgress += burst;

      if (this._extractionProgress >= this.TOTAL_FRAGMENTS) {
        this._extractionProgress = this.TOTAL_FRAGMENTS;
        this._isExtracted = true;
        this.addLog("EXTRACTION COMPLETE: REACT IS NOW PROJECTION-ONLY.", "success");
        this.addLog("RUNTIME ENGINE ANCHORED TO 14D CORE.", "success");
        this.addLog("COMMAND SNAPSHOT CONTRACT LATCHED.", "success");

        if (this.extractionInterval) clearInterval(this.extractionInterval);
        this.extractionInterval = null;
      } else {
        if (this._extractionProgress % 2000 < 500) {
          this.addLog(`Re-coding fragment 0x${this._extractionProgress.toString(16)} to Evidence Layer...`, "info");
        }
      }

      this.notify();
    }, 50);
  }

  private addLog(msg: string, type: 'info' | 'warning' | 'success' = 'info'): void {
    const time = new Date().toLocaleTimeString('en-US', { hour12: false });
    this._logs = [{ time, msg, type }, ...this._logs].slice(0, 40);
  }

  private notify() {
    if (this.onStateChange) {
      this.onStateChange();
    }
  }

  // --- Getters for Snapshot generation ---
  get bootSequence() { return this._bootSequence; }
  get extractionProgress() { return this._extractionProgress; }
  get isExtracted() { return this._isExtracted; }
  get logs() { return [...this._logs]; }

  public cleanup() {
    if (this.bootInterval) clearInterval(this.bootInterval);
    if (this.extractionInterval) clearInterval(this.extractionInterval);
  }
}
