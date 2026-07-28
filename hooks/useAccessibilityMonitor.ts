import { useEffect, useRef } from 'react';
import { useAccessibility } from '@/lib/accessibility/provider';

export function useAccessibilityMonitor() {
  const { profile } = useAccessibility();
  const prevProfileRef = useRef(profile);

  useEffect(() => {
    // Check for changes to log them to the console or telemetry endpoint
    const changedKeys = Object.keys(profile).filter(
      (key) => profile[key as keyof typeof profile] !== prevProfileRef.current[key as keyof typeof profile]
    );

    if (changedKeys.length > 0) {
      changedKeys.forEach(key => {
        console.log(`[A11Y_RUNTIME_MONITOR] Profile key updated: ${key} = ${profile[key as keyof typeof profile]}`);

        // Example integration point for W3C Trace context or OpenTelemetry
        // emitTelemetryEvent({ type: 'A11Y_STATE_CHANGE', key, value: profile[key] });
      });
      prevProfileRef.current = profile;
    }
  }, [profile]);
}
