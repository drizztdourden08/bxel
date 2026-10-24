/* @layer renderer-app @kind constants */
import type { RuleTier } from '@bxel/presets';

const NO_PLATFORM = 'none';

const PLATFORM_LABEL = 'Change platform';

const STRICT_LABEL = 'Change platform rules mode';

const PLATFORM_TEXT = {
  label: 'Platform',
  none: 'No platform',
  freeGroup: 'No rules',
  inheritGroup: 'Follow the project',
  projectDefault: (name: string): string => `Project default: ${name}`,
  strictDefault: (on: boolean): string => `Project default: ${on ? 'enforced' : 'not enforced'}`,
  hint: 'A platform sets the size, colour count, palette and rules for a target. You can still change them. Anything outside the rules shows as a warning.',
  rulesTitle: 'Platform rules',
  noFindings: 'Everything fits the platform rules.',
  changeFailed: (reason: string): string => `Could not change the platform. ${reason}`,
  unknown: (id: string): string => `This file was made for ${id}, which this version does not know.`,
  rules: (name: string, slots: number, slot0: string, banks: number): string =>
    `${name}: ${slots} slots, ${slot0}, up to ${banks} ${banks === 1 ? 'palette' : 'palettes'}.`,
  slot0: {
    transparent: 'slot 0 transparent',
    background: 'slot 0 is the backdrop',
    colour: 'slot 0 is a colour',
  },
  shared: 'slot 0 is the backdrop shared by every palette',
} as const;

const STRICT_TEXT = {
  label: 'Enforce platform rules',
  hint: 'Blocks a change that would break a rule marked Outside the rules. Checks and notes stay warnings.',
  on: 'Platform rules are enforced.',
  off: 'Platform rules are not enforced.',
  failed: (reason: string): string => `Could not change the setting. ${reason}`,
  blocked: (message: string): string => `Blocked by the platform rules. ${message} Turn off Enforce platform rules to allow it.`,
  ownerOnly: 'Enforce platform rules is on for this file. Only the owner can turn it off or change the platform.',
  sizeBlocked: (message: string): string => `${message} Enforce platform rules is on, so this size cannot be added.`,
} as const;

const AREA_TEXT = {
  palette: (name: string, count: number, frames: string): string =>
    `${name}${frames}: ${count} ${count === 1 ? 'area uses' : 'areas use'} more than one palette.`,
  colours: (name: string, count: number, frames: string, limit: number): string =>
    `${name}${frames}: ${count} ${count === 1 ? 'area uses' : 'areas use'} more than ${limit} ${limit === 1 ? 'colour' : 'colours'}.`,
  frames: (list: string): string => `, frames ${list}`,
  show: 'Show on the canvas',
  hide: 'Hide from the canvas',
} as const;

const TIER_LABELS: Readonly<Record<RuleTier, string>> = {
  enforce: 'Outside the rules',
  warn: 'Check',
  advisory: 'Note',
};

export { AREA_TEXT, NO_PLATFORM, PLATFORM_LABEL, PLATFORM_TEXT, STRICT_LABEL, STRICT_TEXT, TIER_LABELS };
