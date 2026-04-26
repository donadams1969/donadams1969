export type SoulBehaviorState = 'ALIGNED' | 'MALICIOUS' | 'NEUTRAL';

export interface DaoReputationEntity {
  id: string;
  name: string;
  score: number;
  soulBehavior: SoulBehaviorState;
}

export interface IncomeEligibilityStatus {
  uhiActive: boolean;
  hviActive: boolean;
  statusLabel: string;
  recoveryStatus: string;
}

export function evaluateReputation(entity: DaoReputationEntity): IncomeEligibilityStatus {
  if (entity.score < 0 || entity.soulBehavior === 'MALICIOUS') {
    return {
      uhiActive: false,
      hviActive: false,
      statusLabel: 'NULL & VOID',
      recoveryStatus: 'PERMANENT BLACKLIST',
    };
  }

  if (entity.score > 0 && entity.soulBehavior === 'ALIGNED') {
    return {
      uhiActive: true,
      hviActive: true,
      statusLabel: 'UHI + HVI ACTIVE',
      recoveryStatus: 'DISTRIBUTING',
    };
  }

  return {
    uhiActive: false,
    hviActive: false,
    statusLabel: 'MONITORED',
    recoveryStatus: 'LATCH PENDING',
  };
}

export const EXCLUSION_LOG: DaoReputationEntity[] = [
  { id: 'ZTA', name: 'ZTA LLP (j.zanghi)', score: -777.77, soulBehavior: 'MALICIOUS' },
  { id: 'STP-SF', name: 'STP-SF (william.landrum)', score: -999.99, soulBehavior: 'MALICIOUS' },
  { id: 'SFHA', name: 'SFHA (c.whittaker)', score: -888.88, soulBehavior: 'MALICIOUS' },
];