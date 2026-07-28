export class PrivacyLayer {
  // Pattern to find SSN-like sequences
  private static SSN_REGEX = /\b\d{3}-\d{2}-\d{4}\b/g;

  // Redact PII to prevent exposure in exports
  public static redactPII(payload: any): any {
    if (payload === null || payload === undefined) return payload;

    if (typeof payload === 'string') {
      return payload.replace(this.SSN_REGEX, '$$[ENCRYPTED_SSN]$$');
    }

    if (Array.isArray(payload)) {
      return payload.map(item => this.redactPII(item));
    }

    if (typeof payload === 'object') {
      const redacted: any = {};
      for (const key of Object.keys(payload)) {
        // Obfuscate specific known sensitive keys
        if (key.toLowerCase() === 'ssn' || key.toLowerCase() === 'socialsecurity') {
          redacted[key] = '$$[ENCRYPTED_SSN]$$';
        } else {
          redacted[key] = this.redactPII(payload[key]);
        }
      }
      return redacted;
    }

    return payload;
  }
}
