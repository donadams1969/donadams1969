import { AuthorityDimension, CompletenessAssertion } from '../../contracts/core-14d';
import { GSESExport } from '../../contracts/gses';
import { AttestedPayload } from '../../contracts/ppr';
import { GovernanceAdmissibility } from './infinite-governance';

export class ConstitutionalEnclosure {

  public evaluateContainment(
    exportData: GSESExport | null,
    provenance: AttestedPayload | null,
    governance: GovernanceAdmissibility | null,
    replayValid: boolean
  ): CompletenessAssertion {

    const dimensions: AuthorityDimension = {
      projectionVisible: governance?.passed ?? false,
      transportAuthorized: exportData?.releaseClearance ?? false,
      releasePermitted: exportData?.releaseClearance ?? false,
      fingerprintBound: provenance?.payloadHash === exportData?.payloadHash,
      governanceAdmitted: governance?.passed ?? false,
      replayProtected: replayValid
    };

    // The strongest invariant: Governance defines the container itself.
    // Meaning must be CONTAINED, not merely validated. All dimensions must be true.
    const isContained = Object.values(dimensions).every(v => v === true);

    return {
      envelopeId: `CSRE-${Date.now()}`,
      semanticPayloadHash: exportData?.payloadHash || 'UNBOUND',
      dimensions,
      isContained,
      timestamp: new Date().toISOString()
    };
  }
}

export const Core14D = new ConstitutionalEnclosure();
