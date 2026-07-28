import { z } from 'zod';

export const CommandIntentSchema = z.object({
  commandId: z.string(),
  intent: z.enum(['INITIATE_RECOVERY', 'BYPASS_STALENESS', 'INDEX_FRAGMENTS', 'HALT']),
  actor: z.string(),
  timestamp: z.string()
});

export const CommandSnapshotSchema = z.object({
  snapshotId: z.string(),
  traceId: z.string(),
  intent: CommandIntentSchema,
  status: z.enum(['ACCEPTED', 'REJECTED', 'EXECUTED']),
  reason: z.string().optional()
});

export type CommandIntent = z.infer<typeof CommandIntentSchema>;
export type CommandSnapshot = z.infer<typeof CommandSnapshotSchema>;
