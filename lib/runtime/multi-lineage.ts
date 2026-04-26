// Stub implementations for the dependency chains that feed the Verdict Chain

export class ReceiptChainStore {
  // Represents "Truth Memory"
  public static getLatestTruthHash(): string {
    return "0xTRUTH_HASH_MOCK";
  }
}

export class GovernanceChainStore {
  // Represents "Authority Memory"
  public static getLatestAuthorityHash(): string {
    return "0xAUTHORITY_HASH_MOCK";
  }
}
