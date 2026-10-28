/* @layer renderer-app @kind constants */
const PALETTE_CARD_TEXT = {
  region: 'Palette',
  swatches: 'Swatches',
  copyHint: 'Click a swatch to copy its colour.',
  users: 'Used by',
  noUsers: 'No sprite uses this palette yet.',
  open: 'Open',
  missing: 'This palette could not be read.',
  openLabel: (name: string): string => `Open ${name}`,
  size: (width: number, height: number): string => `${width} x ${height}`,
} as const;

const SWATCH_COLUMN_WIDTH = 36;

const THUMB_WIDTH = 40;

export { PALETTE_CARD_TEXT, SWATCH_COLUMN_WIDTH, THUMB_WIDTH };
