export interface KeyMetadata {
  id: string;
  version: number;
  status: 'ACTIVE' | 'RETIRED' | 'REVOKED';
  createdAt: string;
  expiresAt: string;
}

export class KeyRotationFramework {
  private keys: Map<string, KeyMetadata> = new Map();
  private currentVersion: number = 0;

  public rotateKey(durationDays: number = 90): KeyMetadata {
    // Retire current active keys
    for (const [id, meta] of this.keys.entries()) {
      if (meta.status === 'ACTIVE') {
        meta.status = 'RETIRED';
      }
    }

    this.currentVersion++;
    const newKeyId = `k-${this.currentVersion}-${Date.now()}`;
    const now = new Date();
    const expires = new Date(now.getTime() + durationDays * 24 * 60 * 60 * 1000);

    const newKey: KeyMetadata = {
      id: newKeyId,
      version: this.currentVersion,
      status: 'ACTIVE',
      createdAt: now.toISOString(),
      expiresAt: expires.toISOString(),
    };

    this.keys.set(newKeyId, newKey);
    return newKey;
  }

  public getActiveKey(): KeyMetadata | null {
    for (const meta of this.keys.values()) {
      if (meta.status === 'ACTIVE') return meta;
    }
    return null;
  }

  public isKeyValid(keyId: string): boolean {
    const key = this.keys.get(keyId);
    if (!key) return false;
    if (key.status === 'REVOKED') return false;

    return new Date(key.expiresAt) > new Date();
  }

  public revokeKey(keyId: string): boolean {
    const key = this.keys.get(keyId);
    if (key) {
      key.status = 'REVOKED';
      return true;
    }
    return false;
  }
}
