"use client";

import React, { useState } from 'react';
import { useAccessibility } from '@/lib/accessibility/provider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export function AccessibilityControls() {
  const { profile, updateProfile, explain } = useAccessibility();
  const [activeExplanation, setActiveExplanation] = useState<string | null>(null);

  const handleExplain = (feature: keyof typeof profile) => {
    setActiveExplanation(explain(feature));
  };

  return (
    <Card className="w-full max-w-md bg-zinc-950 text-emerald-400 border border-emerald-900/50">
      <CardHeader>
        <CardTitle className="text-lg font-mono uppercase tracking-widest text-emerald-500">
          Accessibility Runtime
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 font-mono text-sm">

        {/* Reduce Motion */}
        <div className="flex items-center justify-between">
          <div className="space-y-1 cursor-help" onClick={() => handleExplain('reduceMotion')}>
            <Label htmlFor="reduce-motion" className="text-emerald-400">Reduce Motion</Label>
            <p className="text-xs text-zinc-500">Minimize animations</p>
          </div>
          <Switch
            id="reduce-motion"
            checked={profile.reduceMotion}
            onCheckedChange={(c) => updateProfile({ reduceMotion: c })}
            className="data-[state=checked]:bg-emerald-600"
          />
        </div>

        {/* High Contrast */}
        <div className="flex items-center justify-between">
          <div className="space-y-1 cursor-help" onClick={() => handleExplain('highContrast')}>
            <Label htmlFor="high-contrast" className="text-emerald-400">High Contrast</Label>
            <p className="text-xs text-zinc-500">Increase readability</p>
          </div>
          <Switch
            id="high-contrast"
            checked={profile.highContrast}
            onCheckedChange={(c) => updateProfile({ highContrast: c })}
            className="data-[state=checked]:bg-emerald-600"
          />
        </div>

        {/* Text Scale */}
        <div className="flex items-center justify-between">
          <div className="space-y-1 cursor-help" onClick={() => handleExplain('textScale')}>
            <Label className="text-emerald-400">Text Scale</Label>
          </div>
          <Select
            value={profile.textScale}
            onValueChange={(val: any) => updateProfile({ textScale: val })}
          >
            <SelectTrigger className="w-[120px] bg-zinc-900 border-emerald-900">
              <SelectValue placeholder="Scale" />
            </SelectTrigger>
            <SelectContent className="bg-zinc-900 border-emerald-900 text-emerald-400">
              <SelectItem value="normal">Normal</SelectItem>
              <SelectItem value="large">Large</SelectItem>
              <SelectItem value="xlarge">X-Large</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Cognitive Load */}
        <div className="flex items-center justify-between">
          <div className="space-y-1 cursor-help" onClick={() => handleExplain('cognitiveLoad')}>
            <Label className="text-emerald-400">Cognitive Load</Label>
          </div>
          <Select
            value={profile.cognitiveLoad}
            onValueChange={(val: any) => updateProfile({ cognitiveLoad: val })}
          >
            <SelectTrigger className="w-[120px] bg-zinc-900 border-emerald-900">
              <SelectValue placeholder="Load" />
            </SelectTrigger>
            <SelectContent className="bg-zinc-900 border-emerald-900 text-emerald-400">
              <SelectItem value="normal">Normal</SelectItem>
              <SelectItem value="reduced">Reduced</SelectItem>
              <SelectItem value="minimal">Minimal</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Explanation Surface */}
        {activeExplanation && (
          <div className="mt-4 p-3 border border-emerald-800/50 bg-emerald-950/20 rounded text-xs text-emerald-300 transition-all">
            <span className="font-bold block mb-1 uppercase text-[10px] text-emerald-600">Decision Trace:</span>
            {activeExplanation}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
