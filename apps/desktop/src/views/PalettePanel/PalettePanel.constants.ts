/* @layer renderer-app @kind constants */
import type { SwatchRole } from './PalettePanel.type';

const PALETTE_PANEL_TEXT = {
  empty: 'No palette is open.',
  grid: 'Palette swatches',
  hint: 'Click sets the front colour. Right click or Shift and click sets the back colour. X swaps them.',
  caption: (index: number, role: SwatchRole): string => (role === 'background' ? `${index} bg` : String(index)),
  name: (label: string, role: SwatchRole): string => (role === null ? label : `${label}, ${role}`),
} as const;

const PALETTE_COLUMNS = 4;

export { PALETTE_COLUMNS, PALETTE_PANEL_TEXT };
