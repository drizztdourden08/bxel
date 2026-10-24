/* @layer renderer-app @kind logic */
import { checkPlatform } from '@bxel/presets';
import type { PlatformFacts, PlatformPreset } from '@bxel/presets';
import type { PlatformReport } from './platform-preset.type';
import { rulesLine } from './rules-line';

const buildReport = (preset: PlatformPreset, facts: PlatformFacts): PlatformReport => ({
  platformId: preset.id,
  name: preset.name,
  rules: rulesLine(preset),
  strict: false,
  findings: checkPlatform(preset, facts).map((finding) => ({ tier: finding.tier, text: finding.message })),
});

export { buildReport };
