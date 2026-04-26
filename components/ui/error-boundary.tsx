"use client";

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertCircle } from 'lucide-react';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="p-6 border border-red-900/50 bg-red-950/20 rounded-xl text-red-500 font-mono text-sm">
          <div className="flex items-center gap-3 mb-2">
            <AlertCircle className="w-5 h-5" />
            <span className="font-bold uppercase tracking-widest">Runtime Error</span>
          </div>
          <p className="text-red-400/80">{this.state.error?.message}</p>
        </div>
      );
    }

    return this.props.children;
  }
}
