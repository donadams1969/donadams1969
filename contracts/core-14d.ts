import { z } from 'zod';

export const AuthorityDimensionSchema = z.object({
  projectionVisible: z.boolean(),
  transportAuthorized: z.boolean(),
  releasePermitted: z.boolean(),
  fingerprintBound: z.boolean(),
  governanceAdmitted: z.boolean(),
  replayProtected: z.boolean()
});

export const CompletenessAssertionSchema = z.object({
  envelopeId: z.string(),
  semanticPayloadHash: z.string(),
  dimensions: AuthorityDimensionSchema,
  isContained: z.boolean(),
  timestamp: z.string()
});

export type AuthorityDimension = z.infer<typeof AuthorityDimensionSchema>;
export type CompletenessAssertion = z.infer<typeof CompletenessAssertionSchema>;
