import { SovereignVerdictEngine } from './verdict-engine';
import { JudicialAdmissionLayer } from './judicial-engine';
import { VerdictSnapshot } from '../schemas/verdict';
import { JudicialAdmission } from '../../contracts/judicial';

export interface ValorLoopSnapshot {
  verdict: VerdictSnapshot;
  admission: JudicialAdmission;
}

export class ValorLoopOrchestrator {
  private admissionLayer = new JudicialAdmissionLayer();
  private subscribers: ((snapshot: ValorLoopSnapshot) => void)[] = [];
  private lastAdmittedSnapshot: ValorLoopSnapshot | null = null;

  constructor() {
    SovereignVerdictEngine.subscribe((rawSnapshot) => {
      this.processRuntimeState(rawSnapshot);
    });
  }

  private processRuntimeState(rawSnapshot: VerdictSnapshot) {
    // 1. Runtime -> Validators -> Admission -> Judicial Admission
    const admissionResult = this.admissionLayer.evaluateAdmission(rawSnapshot);

    // 2. Judicial Gating Before Visibility
    if (admissionResult.admitted) {
      this.lastAdmittedSnapshot = {
        verdict: rawSnapshot,
        admission: admissionResult
      };
      // 3. Snapshot -> RuntimeProvider -> Projection
      this.emit(this.lastAdmittedSnapshot);
    } else {
      console.warn(`[VALORLOOP] Snapshot rejected by Judicial Admission Layer. Violations detected.`);
      // In a real system, we might emit a specialized rejection event,
      // but we do NOT update the projection state with invalid truth.
    }
  }

  public subscribe(callback: (snapshot: ValorLoopSnapshot) => void) {
    this.subscribers.push(callback);
    if (this.lastAdmittedSnapshot) {
        callback(this.lastAdmittedSnapshot);
    }
    return () => {
      this.subscribers = this.subscribers.filter(cb => cb !== callback);
    };
  }

  private emit(snapshot: ValorLoopSnapshot) {
    this.subscribers.forEach(cb => cb(snapshot));
  }

  public getSnapshot(): ValorLoopSnapshot | null {
    return this.lastAdmittedSnapshot;
  }
}

export const ValorLoop = new ValorLoopOrchestrator();
