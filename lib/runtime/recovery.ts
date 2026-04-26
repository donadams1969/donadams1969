export class RecoveryProtocol {
  public static async persistToFallbackStorage(key: string, data: any): Promise<boolean> {
    if (typeof window === 'undefined') return false;

    try {
      localStorage.setItem(key, JSON.stringify(data));
      console.log(`[RECOVERY] Successfully persisted ${key} to fallback storage.`);
      return true;
    } catch (e) {
      console.error(`[RECOVERY] Failed to persist ${key} to fallback storage.`, e);
      return false;
    }
  }

  public static async recoverFromFallbackStorage(key: string): Promise<any | null> {
    if (typeof window === 'undefined') return null;

    try {
      const data = localStorage.getItem(key);
      if (data) {
         console.log(`[RECOVERY] Successfully recovered ${key} from fallback storage.`);
         return JSON.parse(data);
      }
      return null;
    } catch (e) {
      console.error(`[RECOVERY] Failed to recover ${key} from fallback storage.`, e);
      return null;
    }
  }

  public static isNetworkAvailable(): boolean {
    if (typeof window === 'undefined') return true; // Default to true on server
    return window.navigator.onLine;
  }
}
