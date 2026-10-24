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

export { BANK_LABEL, BANK_TEXT };
