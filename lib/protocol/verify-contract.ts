export type InvariantState = 'VALID' | 'BLOCKED' | 'PENDING';

export type RuntimeSignalStatus =
  | 'VERIFIED'
  | 'BLOCKED'
  | 'PENDING'
  | 'ADVERSARY';

export type RouteDestination = '/route70' | '/route71';

export type ReasonCode =
  | 'POLICY_ADMITTED'
  | 'INVARIANT_BLOCKED'
  | 'ADVERSARY_DETECTED';

export type RuntimeSignal = {
  id: string;
  invariantState: InvariantState;
  status: RuntimeSignalStatus;
  payload: unknown;
};

export type PolicyDecision = {
  signalId: string;
  admitted: boolean;
  failedAt: string | null;
  reasonCode: ReasonCode;
  route: RouteDestination;
  visibilityGranted: boolean;
  evaluatedAt: string;
  policyVersion: 'REV_33';
  origin: '🇺🇸';
};

export type ReceiptV1 = {
  receiptVersion: 'v1';
  signalId: string;
  decision: PolicyDecision;
  receiptHash: string;
  createdAt: string;
};

export type VerifyRequest = {
  signal: RuntimeSignal;
};

export type VerifyResponse = {
  signal: RuntimeSignal;
  decision: PolicyDecision;
  receipt: ReceiptV1;
};

export function decideVisibility(signal: RuntimeSignal): PolicyDecision {
  const admitted =
    signal.invariantState === 'VALID' &&
    signal.status === 'VERIFIED';

  const reasonCode: ReasonCode = admitted
    ? 'POLICY_ADMITTED'
    : signal.status === 'ADVERSARY'
      ? 'ADVERSARY_DETECTED'
      : 'INVARIANT_BLOCKED';

  return {
    signalId: signal.id,
    admitted,
    failedAt: admitted ? null : reasonCode,
    reasonCode,
    route: admitted ? '/route71' : '/route70',
    visibilityGranted: admitted,
    evaluatedAt: new Date().toISOString(),
    policyVersion: 'REV_33',
    origin: '🇺🇸',
  };
}
