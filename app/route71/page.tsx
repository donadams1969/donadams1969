"use client";

import React from 'react';
import { RuntimeProvider, useRuntime } from '@/lib/runtime/runtime-provider';
import { AccessibilityProvider } from '@/lib/accessibility/provider';
import { ErrorBoundary } from '@/components/ui/error-boundary';
import { CommandProjection } from '@/components/command/CommandProjection';

// Strict Projection Consumer
function OrchestrationShell() {
  const { snapshot, executeSeparation, setLayer } = useRuntime();

  return (
    <CommandProjection
      snapshot={snapshot}
      onExecute={executeSeparation}
      onLayerChange={setLayer}
    />
  );
}

// Final Runtime Topology Wrapper
export default function Route71() {
  return (
    <ErrorBoundary>
      <AccessibilityProvider>
        <RuntimeProvider>
          <OrchestrationShell />
        </RuntimeProvider>
      </AccessibilityProvider>
    </ErrorBoundary>
  );
}
