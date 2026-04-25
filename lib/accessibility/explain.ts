import { AccessibilityProfile, WCAG_MAPPINGS } from './contracts';

export function explainDecision(profile: AccessibilityProfile, featureId: keyof AccessibilityProfile): string {
  const value = profile[featureId];
  const mappings = WCAG_MAPPINGS[featureId];

  if (!mappings || mappings.length === 0) {
    return `Setting ${featureId} is currently ${value}.`;
  }

  const guidelines = mappings.map(m => `WCAG ${m.id} (${m.minLevel}): ${m.description}`).join('; ');

  return `Setting ${featureId} to ${value} enforces compliance with: ${guidelines}.`;
}
