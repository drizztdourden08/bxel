/* @layer renderer-app @kind constants */
import type { RuleTier } from '@bxel/presets';

const NO_PLATFORM = 'none';

const PLATFORM_LABEL = 'Change platform';

const PLATFORM_TEXT = {
  label: 'Platform',
  none: 'No platform',
  freeGroup: 'No rules',
  hint: 'A platform sets the size, color count, palette and rules for a target. You can still change them. Anything outside the rules shows as a warning.',
  rulesTitle: 'Platform rules',
  noFindings: 'Everything fits the platform rules.',
  changeFailed: (reason: string): string => `Could not change the platform. ${reason}`,
  unknown: (id: string): string => `This file was made for ${id}, which this version does not know.`,
  rules: (name: string, slots: number, slot0: string, banks: number): string =>
    `${name}: ${slots} slots, ${slot0}, up to ${banks} ${banks === 1 ? 'palette' : 'palettes'}.`,
  slot0: {
    transparent: 'slot 0 transparent',
    background: 'slot 0 is the backdrop',
    colour: 'slot 0 is a color',
  },
  shared: 'slot 0 is the backdrop shared by every palette',
} as const;

const TIER_LABELS: Readonly<Record<RuleTier, string>> = {
  enforce: 'Outside the rules',
  warn: 'Check',
  advisory: 'Note',
};

export { NO_PLATFORM, PLATFORM_LABEL, PLATFORM_TEXT, TIER_LABELS };
