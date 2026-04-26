import { RuntimeEngine } from './runtime-engine';
import { LogEvent } from '../../contracts/runtime';
import { BRANDING } from '../../content/branding';

// Explicit UI Snapshot Contract
export interface CommandCenterSnapshot {
  bootSequence: number;
  extractionProgress: number;
  isExtracted: boolean;
  logs: LogEvent[];
  activeLayer: 'extraction' | 'terminal' | 'blueprint';
  constants: {
    totalFragments: number;
    merkleRoot: string;
    recoveryAnchor: string;
    node: string;
    version: string;
  };
}

export class CommandBuilder {
  public static buildSnapshot(engine: RuntimeEngine, activeLayer: CommandCenterSnapshot['activeLayer']): CommandCenterSnapshot {
    return {
      bootSequence: engine.bootSequence,
      extractionProgress: engine.extractionProgress,
      isExtracted: engine.isExtracted,
      logs: engine.logs,
      activeLayer,
      constants: {
        totalFragments: engine.TOTAL_FRAGMENTS,
        merkleRoot: BRANDING.merkleRoot,
        recoveryAnchor: BRANDING.anchor,
        node: BRANDING.node,
        version: "REV_38 EXTRACTION"
      }
    };
  }
}
