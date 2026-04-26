import { z } from 'zod';
import { TraceContextSchema, RuntimeMetricsSchema, RuntimeReasonSchema } from './schemas';

export const RuntimeEvidenceSchema = z.object({
  id: z.string(),
  type: z.enum(['SYSTEM_BOOT', 'METRIC_TICK', 'DECISION', 'ERROR', 'RECONCILIATION']),
  timestamp: z.string(),
  trace: TraceContextSchema,
  payload: z.record(z.unknown())
});

export const RuntimeEvidenceBundleSchema = z.object({
  bundleId: z.string(),
  merkleRoot: z.string(),
  evidence: z.array(RuntimeEvidenceSchema),
  finalMetrics: RuntimeMetricsSchema,
  reasons: z.array(RuntimeReasonSchema)
});

export type RuntimeEvidence = z.infer<typeof RuntimeEvidenceSchema>;
export type RuntimeEvidenceBundle = z.infer<typeof RuntimeEvidenceBundleSchema>;
