import { z } from 'zod';

export const VerdictLineageSchema = z.object({
  truthHash: z.string(),
  authorityHash: z.string(),
  previousVerdictHash: z.string()
});

export const ConstitutionalVerdictSchema = z.object({
  verdictId: z.string(),
  decision: z.enum(['ADMIT', 'DENY', 'HOLD']),
  constitutionalBasis: z.string(),
  lineage: VerdictLineageSchema,
  timestamp: z.string()
});

export const VerdictChainNodeSchema = z.object({
  verdictHash: z.string(),
  verdict: ConstitutionalVerdictSchema,
  merkleProof: z.array(z.string()).optional()
});

export type VerdictLineage = z.infer<typeof VerdictLineageSchema>;
export type ConstitutionalVerdict = z.infer<typeof ConstitutionalVerdictSchema>;
export type VerdictChainNode = z.infer<typeof VerdictChainNodeSchema>;
