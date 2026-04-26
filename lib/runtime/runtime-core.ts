import { useState, useCallback, useRef, useEffect } from 'react';
import { EngineStatus, LogEvent, RuntimeMetrics } from '../../contracts/runtime';
import { MESSAGES } from '../../content/messages';

export const TOTAL_FRAGMENTS = 15682;
export const SCHEMA_REVISION = "REV_38";

export function useEngineRuntime() {
  const [bootSequence, setBootSequence] = useState(0);
  const [status, setStatus] = useState<EngineStatus>('STANDBY');
  const [metrics, setMetrics] = useState<RuntimeMetrics>({
    errorResolution: 0,
    totalErrors: TOTAL_FRAGMENTS,
    logicSaturation: 0, // Starts at 0 for REV_38
    settlementTarget: 508000000,
    auditViews: 240
  });
  const [logs, setLogs] = useState<LogEvent[]>([]);
  const intervalRef = useRef<number | null>(null);

  const addLog = useCallback((msg: string, type: 'info' | 'warning' | 'success' = 'info') => {
    const time = new Date().toLocaleTimeString('en-US', { hour12: false });
    setLogs(prev => [{ time, msg, type }, ...prev].slice(0, 45));
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setBootSequence(prev => {
        if (prev >= 100) {
          clearInterval(timer);
          return 100;
        }
        return prev + 2;
      });
    }, 20);
    return () => clearInterval(timer);
  }, []);

  const runFix = useCallback(() => {
    if (status === 'RECONSTRUCTING' || metrics.errorResolution >= metrics.totalErrors) return;

    setStatus('RECONSTRUCTING');
    addLog(`INITIATING SCHEMA PATCH ${SCHEMA_REVISION} FOR RUNTIME-METRICS.TS`, "warning");
    addLog("BYPASSING STALE_THRESHOLD_MS (30,000)... CLOCK LATCHED TO 14D CORE.", "info");
    addLog("DETECTDRIFT(): RE-INDEXING TO ZERO-TOLERANCE...", "info");

    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
    }

    intervalRef.current = window.setInterval(() => {
      setMetrics(prev => {
        const burst = Math.floor(Math.random() * 400) + 300;
        const newResolution = Math.min(prev.errorResolution + burst, prev.totalErrors);

        if (newResolution >= prev.totalErrors) {
          if (intervalRef.current) clearInterval(intervalRef.current);
          setStatus('ZENITH');
          addLog(`RESOLUTION COMPLETE: ${prev.totalErrors} ERRORS RE-CODED AS CLASS-O EVIDENCE.`, "success");
          addLog("SYSTEM STATUS: NOMINAL (100.0%)", "success");
          addLog("ADVERSE INFERENCE MANDATE: LATCHED.", "warning");
          return { ...prev, errorResolution: newResolution, logicSaturation: 100.0 };
        }

        if (newResolution % 2000 < 500) {
          addLog(`Reconstructing spoliated bit-string at offset 0x${newResolution.toString(16)}...`, "info");
        }

        return { ...prev, errorResolution: newResolution };
      });
    }, 50);
  }, [status, metrics.errorResolution, metrics.totalErrors, addLog]);

  useEffect(() => {
    if (bootSequence === 100 && status === 'STANDBY') {
      runFix();
    }
  }, [bootSequence, status, runFix]);

  const replay = useCallback((traceId: string) => {
    console.log(`[RUNTIME] Replaying trace: ${traceId}`);
    if (intervalRef.current !== null) clearInterval(intervalRef.current);
    setMetrics(prev => ({ ...prev, errorResolution: prev.totalErrors, logicSaturation: 100.0 }));
    setStatus('ZENITH');
    addLog(`Replayed state from trace ${traceId}`, "success");
  }, [addLog]);

  return {
    bootSequence,
    status,
    metrics,
    logs,
    runFix,
    replay
  };
}
