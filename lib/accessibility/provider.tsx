"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { AccessibilityProfile, DEFAULT_PROFILE } from './contracts';
import { loadProfile, saveProfile } from './persistence';
import { explainDecision } from './explain';

interface AccessibilityContextType {
  profile: AccessibilityProfile;
  updateProfile: (updates: Partial<AccessibilityProfile>) => void;
  explain: (featureId: string) => string;
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

export function AccessibilityProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<AccessibilityProfile>(DEFAULT_PROFILE);

  useEffect(() => {
    const loaded = loadProfile();
    if (loaded) {
      setProfile(loaded);
    }
  }, []);

  const updateProfile = (updates: Partial<AccessibilityProfile>) => {
    setProfile(prev => {
      const updated = { ...prev, ...updates };
      saveProfile(updated);
      return updated;
    });
  };

  const explain = (featureId: string) => {
    return explainDecision(profile, featureId);
  };

  return (
    <AccessibilityContext.Provider value={{ profile, updateProfile, explain }}>
      <div className={
        `${profile.reduceMotion ? 'reduce-motion' : ''} ` +
        `${profile.highContrast ? 'high-contrast' : ''} ` +
        `text-scale-${profile.textScale}`
      }>
        {children}
      </div>
    </AccessibilityContext.Provider>
  );
}

export function useAccessibility() {
  const context = useContext(AccessibilityContext);
  if (context === undefined) {
    throw new Error('useAccessibility must be used within an AccessibilityProvider');
  }
  return context;
}
