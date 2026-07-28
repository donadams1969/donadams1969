import { AccessibilityProfile, DEFAULT_PROFILE } from './contracts';

const STORAGE_KEY = 'valorai_accessibility_profile';

export function saveProfile(profile: AccessibilityProfile): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
  } catch (error) {
    console.warn('Failed to save accessibility profile:', error);
  }
}

export function loadProfile(): AccessibilityProfile | null {
  if (typeof window === 'undefined') return null;
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return null;
    const parsed = JSON.parse(data);

    // Basic validation
    return { ...DEFAULT_PROFILE, ...parsed };
  } catch (error) {
    console.warn('Failed to load accessibility profile:', error);
    return null;
  }
}
