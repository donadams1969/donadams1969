import { z } from 'zod';

export const SOVEREIGN_CLUSTER = [
  "donnygillson.eth",
  "donnygillson.seed",
  "donadams1969",
  "δονάδαμς1969.ετη"
] as const;

export const AttestedPayloadSchema = z.object({
  id: z.string(),
  provenanceIdentity: z.enum(["donnygillson.eth", "donnygillson.seed", "donadams1969", "δονάδαμς1969.ετη"]),
  clusterStateHash: z.string(),
  btcLatch: z.string(),
  nodeLocation: z.string(),
  governanceState: z.string(),
  merkleLineage: z.string(),
  payloadHash: z.string(),
  timestamp: z.string()
});

export type AttestedPayload = z.infer<typeof AttestedPayloadSchema>;
