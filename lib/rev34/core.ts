export interface Rev34Identity {
  version: 'REV_34';
  identityHash: string;
  signature: string;
  timestamp: string;
  provenance: string;
}

export class Rev34Core {
  // Recursive canonicalization to ensure deterministic hashing
  public static canonicalize(data: any): string {
    if (data === null) return 'null';
    if (typeof data !== 'object') {
      return JSON.stringify(data);
    }

    if (Array.isArray(data)) {
      const arr = data.map(item => this.canonicalize(item));
      return `[${arr.join(',')}]`;
    }

    const keys = Object.keys(data).sort();
    const objStr = keys.map(k => `"${k}":${this.canonicalize(data[k])}`).join(',');
    return `{${objStr}}`;
  }

  // SHA-256 Identity Hash Generation (Mock for demonstration)
  // Note: Web Crypto API should be used for actual implementation in Next.js
  public static async generateIdentityHash(data: any): Promise<string> {
    const canonicalStr = this.canonicalize(data);
    if (typeof crypto !== 'undefined' && crypto.subtle) {
      const msgBuffer = new TextEncoder().encode(canonicalStr);
      const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
      return hashHex;
    } else {
      // Fallback pseudo-hash if crypto is unavailable (should not happen in browser/edge context)
      let hash = 0;
      for (let i = 0; i < canonicalStr.length; i++) {
        hash = (hash << 5) - hash + canonicalStr.charCodeAt(i);
        hash |= 0;
      }
      return `0x${Math.abs(hash).toString(16)}`;
    }
  }

  // Mock Ed25519 signature verification
  public static verifyEd25519Signature(hash: string, signature: string, publicKey: string): boolean {
    // In a real implementation, you would use a cryptographic library that supports Ed25519
    // For this architecture mock, we assume the signature is verified
    return signature !== '' && publicKey !== '';
  }
}
