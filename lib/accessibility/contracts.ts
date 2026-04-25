export type WCAGLevel = 'A' | 'AA' | 'AAA';

export interface AccessibilityProfile {
  reduceMotion: boolean;
  highContrast: boolean;
  textScale: 'normal' | 'large' | 'xlarge';
  screenReaderOptimized: boolean;
  cognitiveLoad: 'normal' | 'reduced' | 'minimal';
}

export const DEFAULT_PROFILE: AccessibilityProfile = {
  reduceMotion: false,
  highContrast: false,
  textScale: 'normal',
  screenReaderOptimized: false,
  cognitiveLoad: 'normal',
};

export interface CapabilityRequirement {
  id: string;
  minLevel: WCAGLevel;
  description: string;
}

export const WCAG_MAPPINGS: Record<keyof AccessibilityProfile, CapabilityRequirement[]> = {
  reduceMotion: [{ id: '2.2.2', minLevel: 'A', description: 'Pause, Stop, Hide' }],
  highContrast: [{ id: '1.4.3', minLevel: 'AA', description: 'Contrast (Minimum)' }, { id: '1.4.6', minLevel: 'AAA', description: 'Contrast (Enhanced)' }],
  textScale: [{ id: '1.4.4', minLevel: 'AA', description: 'Resize text' }],
  screenReaderOptimized: [{ id: '1.3.1', minLevel: 'A', description: 'Info and Relationships' }, { id: '4.1.2', minLevel: 'A', description: 'Name, Role, Value' }],
  cognitiveLoad: [{ id: '3.1.5', minLevel: 'AAA', description: 'Reading Level' }]
};
