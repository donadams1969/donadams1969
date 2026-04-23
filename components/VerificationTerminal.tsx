import React, { useEffect, useRef } from 'react';

interface TerminalProps {
  logs: string[];
}

export const VerificationTerminal: React.FC<TerminalProps> = ({ logs }) => {
  const terminalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <div
      className="bg-black text-green-500 font-mono p-4 rounded-lg border border-zinc-800 h-64 overflow-y-auto"
      role="log"
      aria-live="polite"
      aria-label="Forensic Verification Terminal"
      tabIndex={0}
      ref={terminalRef}
    >
      <div className="text-xs mb-2 opacity-50">
        Initializing ValorAiEngine+ Quantum Gate...
      </div>
      {logs.map((log, index) => (
        <div key={`log-${index}`} className="mb-1 whitespace-pre-wrap">
          <span className="text-zinc-500 mr-2">{'>'}</span>
          {log}
        </div>
      ))}
    </div>
  );
};