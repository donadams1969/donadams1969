import { z } from 'zod';

export const ReleasePermissionSchema = z.object({
  canSerialize: z.boolean(),
  canTransport: z.boolean(),
  canRelease: z.boolean(),
  reason: z.string()
});

export const GSESExportSchema = z.object({
  payloadHash: z.string(),
  serializedData: z.string(),
  transportSignature: z.string(),
  releaseClearance: z.boolean(),
  timestamp: z.string()
});

export type ReleasePermission = z.infer<typeof ReleasePermissionSchema>;
export type GSESExport = z.infer<typeof GSESExportSchema>;
