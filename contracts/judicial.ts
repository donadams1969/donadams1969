import { z } from 'zod';

export const JudicialRuntimeLawSchema = z.object({
  lawId: z.string(),
  description: z.string(),
  severity: z.enum(['CRITICAL', 'HIGH', 'WARNING']),
  enforcementAction: z.enum(['REJECT', 'FLAG', 'HOLD'])
});

export const JudicialEvaluationSchema = z.object({
  lawId: z.string(),
  passed: z.boolean(),
  reason: z.string()
});

export const JudicialAdmissionSchema = z.object({
  snapshotId: z.string(),
  admitted: z.boolean(),
  evaluations: z.array(JudicialEvaluationSchema),
  timestamp: z.string()
});

export type JudicialRuntimeLaw = z.infer<typeof JudicialRuntimeLawSchema>;
export type JudicialEvaluation = z.infer<typeof JudicialEvaluationSchema>;
export type JudicialAdmission = z.infer<typeof JudicialAdmissionSchema>;
