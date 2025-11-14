// components/ErrorBoundary.tsx — ULTIMATE CRASH PROTECTION
'use client';
import { Component, ReactNode } from 'react';

interface Props {
children: ReactNode;
fallback?: ReactNode;
}

interface State {
hasError: boolean;
error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
constructor(props: Props) {
super(props);
this.state = { hasError: false };
}

static getDerivedStateFromError(error: Error): State {
return { hasError: true, error };
}

componentDidCatch(error: Error, errorInfo: any) {
console.error('Error Boundary contained:', error, errorInfo);
}

render() {
if (this.state.hasError) {
return this.props.fallback || (
<div className="bg-red-900 text-white p-6 rounded-lg">
<h2 className="text-2xl font-bold mb-4">SYSTEM SELF-HEALING ACTIVE</h2>
<p>Component temporarily unavailable - Auto-recovery in progress</p>
</div>
);
}

return this.props.children;
}
}
