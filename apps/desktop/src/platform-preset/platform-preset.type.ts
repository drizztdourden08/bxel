/* @layer renderer-app @kind types */
import type { RuleTier } from '@bxel/presets';

interface FindingLine {
  tier: RuleTier;
  text: string;
}

interface PlatformReport {
  platformId: string;
  name: string;
  rules: string;
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

export type { PlatformGroup, PlatformOutcome, PlatformReport };
