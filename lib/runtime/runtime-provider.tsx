"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { RuntimeEngine } from './runtime-engine';
import { CommandBuilder, CommandCenterSnapshot } from './command-builder';

interface RuntimeContextType {
  snapshot: CommandCenterSnapshot;
  executeSeparation: () => void;
  setLayer: (layer: CommandCenterSnapshot['activeLayer']) => void;
}

const RuntimeContext = createContext<RuntimeContextType | undefined>(undefined);

// Instantiate the engine OUTSIDE the React component tree
const engine = new RuntimeEngine();

export function RuntimeProvider({ children }: { children: ReactNode }) {
  const [activeLayer, setActiveLayer] = useState<CommandCenterSnapshot['activeLayer']>('extraction');
  const [snapshot, setSnapshot] = useState<CommandCenterSnapshot>(() =>
    CommandBuilder.buildSnapshot(engine, activeLayer)
  );

  useEffect(() => {
    // Start boot sequence when provider mounts
    engine.startBootSequence();

    // Subscribe to engine state changes
    engine.onStateChange = () => {
      setSnapshot(CommandBuilder.buildSnapshot(engine, activeLayer));
    };

    return () => {
      engine.cleanup();
      engine.onStateChange = null;
    };
  }, [activeLayer]);

  const executeSeparation = () => {
    engine.runExtraction();
  };

  const setLayer = (layer: CommandCenterSnapshot['activeLayer']) => {
    setActiveLayer(layer);
    setSnapshot(CommandBuilder.buildSnapshot(engine, layer));
  };

  return (
    <RuntimeContext.Provider value={{ snapshot, executeSeparation, setLayer }}>
      {children}
    </RuntimeContext.Provider>
  );
}

export function useRuntime() {
  const context = useContext(RuntimeContext);
  if (context === undefined) {
    throw new Error('useRuntime must be used within a RuntimeProvider');
  }
  return context;
}
