import { ConstitutionalVerdict, VerdictChainNode } from '../../contracts/verdict';

export class VerdictChainVerifier {
  public static hashVerdict(verdict: ConstitutionalVerdict): string {
    const payload = JSON.stringify({
      id: verdict.verdictId,
      decision: verdict.decision,
      basis: verdict.constitutionalBasis,
      truth: verdict.lineage.truthHash,
      auth: verdict.lineage.authorityHash,
      prev: verdict.lineage.previousVerdictHash,
      time: verdict.timestamp
    });

    let hash = 0;
    for (let i = 0; i < payload.length; i++) {
      hash = (hash << 5) - hash + payload.charCodeAt(i);
      hash |= 0;
    }
    return `0x${Math.abs(hash).toString(16).padStart(64, '0')}`;
  }

  public static verifyContinuity(chain: VerdictChainNode[]): boolean {
    if (chain.length <= 1) return true;
    for (let i = 1; i < chain.length; i++) {
      const current = chain[i];
      const previous = chain[i - 1];
      if (current.verdict.lineage.previousVerdictHash !== previous.verdictHash) {
        console.error(`Verdict Continuity Broken at Node: ${current.verdict.verdictId}`);
        return false;
      }
      if (current.verdictHash !== this.hashVerdict(current.verdict)) {
        console.error(`Verdict Hash Integrity Broken at Node: ${current.verdict.verdictId}`);
        return false;
      }
    }
    return true;
  }
}

export class VerdictChainStore {
  private chain: VerdictChainNode[] = [];

  public appendVerdict(verdict: ConstitutionalVerdict): VerdictChainNode | null {
    const expectedPreviousHash = this.chain.length > 0
      ? this.chain[this.chain.length - 1].verdictHash
      : 'GENESIS_VERDICT_HASH';

    if (verdict.lineage.previousVerdictHash !== expectedPreviousHash) {
      console.error(`[VERDICT_REJECTED] Invalid previous hash. Expected: ${expectedPreviousHash}`);
      return null;
    }

    const node: VerdictChainNode = {
      verdictHash: VerdictChainVerifier.hashVerdict(verdict),
      verdict
    };

    const potentialChain = [...this.chain, node];
    if (!VerdictChainVerifier.verifyContinuity(potentialChain)) {
      console.error('[VERDICT_REJECTED] Chain continuity verification failed.');
      return null;
    }

    this.chain.push(node);
    return node;
  }

  public getLatestVerdict(): VerdictChainNode | null {
    return this.chain.length > 0 ? this.chain[this.chain.length - 1] : null;
  }

  public getFullChain(): VerdictChainNode[] {
    return [...this.chain];
  }
}
