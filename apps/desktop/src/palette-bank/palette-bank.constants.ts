/* @layer renderer-app @kind constants */
const BANK_LABEL = 'Change sprite palette';

const BANK_TEXT = {
  label: 'Palette of this sprite',
  hint: 'Moves the sprite to another palette. Each colour keeps its slot number.',
  done: (sprite: string, bank: string): string => `${sprite} now uses ${bank}.`,
  failed: (reason: string): string => `Could not change the palette. ${reason}`,
  missing: 'Choose a sprite first.',
  slots: (name: string, colours: number): string => `${name} (${colours} ${colours === 1 ? 'colour' : 'colours'})`,
} as const;

const RECOLOUR_LABEL = 'Change swatch colour';

const RECOLOUR_TEXT = {
  done: (index: number, rgb: string): string => `Swatch ${index} is now ${rgb}.`,
  failed: (reason: string): string => `Could not change the colour. ${reason}`,
  fixed: 'The transparent swatch cannot be edited.',
  same: 'The colour did not change.',
} as const;

export { BANK_LABEL, BANK_TEXT, RECOLOUR_LABEL, RECOLOUR_TEXT };
