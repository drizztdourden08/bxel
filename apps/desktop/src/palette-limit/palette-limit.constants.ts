/* @layer renderer-app @kind constants */
import { MAX_BANK_CAP, MIN_BANK_CAP } from '@bxel/document';

const LIMIT_PRESETS: readonly number[] = [4, 8, 16, 32, 64, 256];

const LIMIT_DEFAULT = 16;

const LIMIT_RANGE = { min: MIN_BANK_CAP, max: MAX_BANK_CAP } as const;

const LIMIT_TEXT = {
  range: `The colour limit must be between ${MIN_BANK_CAP} and ${MAX_BANK_CAP}.`,
  label: 'Maximum slots',
  custom: 'Custom',
  transparency: 'Use slot 0 for transparent',
  used: (used: number, opaque: number): string => `${used} of ${opaque} opaque used`,
  full: (opaque: number): string => `${opaque} of ${opaque} opaque used. Palette is full.`,
} as const;

export { LIMIT_DEFAULT, LIMIT_PRESETS, LIMIT_RANGE, LIMIT_TEXT };
