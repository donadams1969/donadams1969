export type EngineStatus = 'STANDBY' | 'RECONSTRUCTING' | 'ZENITH';

export type ActiveModule = 'core' | 'terminal' | 'analysis';

export interface LogEvent {
  time: string;
  msg: string;
  type: 'info' | 'warning' | 'success';
}

export interface RuntimeMetrics {
  errorResolution: number;
  totalErrors: number;
  logicSaturation: number;
  settlementTarget: number;
  auditViews: number;
}
