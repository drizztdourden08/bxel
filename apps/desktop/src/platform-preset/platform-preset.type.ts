/* @layer renderer-app @kind types */
import type { AreaRect, RuleTier } from '@bxel/presets';

interface AreaHighlight {
  key: string;
  spriteId: string;
  frames: Readonly<Record<string, readonly AreaRect[]>>;
}

interface FindingLine {
  tier: RuleTier;
  text: string;
  area?: AreaHighlight;
}

interface PlatformReport {
  platformId: string;
  name: string;
  rules: string;
  strict: boolean;
  findings: readonly FindingLine[];
}

interface PlatformOption {
  value: string;
  label: string;
}

interface PlatformGroup {
  label: string;
  options: PlatformOption[];
}

type PlatformOutcome = { ok: true } | { ok: false; message: string };

interface EffectivePlatform {
  platformId: string | undefined;
  strict: boolean;
  inherited: boolean;
}

interface PresetFact {
  label: string;
  value: string;
}

export type { AreaHighlight, EffectivePlatform, FindingLine, PlatformGroup, PlatformOutcome, PlatformReport, PresetFact };
