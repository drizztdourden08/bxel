/* @layer renderer-app @kind constants */
import { COMMAND_ID } from '../../keymap/keymap.constants';
import { platformGroups } from '../../platform-preset/platform-groups';
import type { HintSpec } from '../ActionHint';
import type { SwatchRole } from './PalettePanel.type';

const PALETTE_PANEL_TEXT = {
  empty: 'No palette is open.',
  grid: 'Palette swatches',
  hint: 'Click sets the front colour. Right click or Shift and click sets the back colour. X swaps them.',
  setLabel: 'Swatch set',
  setPlaceholder: 'Choose a set',
  addColors: 'Add colors',
  replaceColors: 'Replace colors',
  caption: (index: number, role: SwatchRole): string => (role === 'background' ? `${index} bg` : String(index)),
  name: (label: string, role: SwatchRole): string => (role === null ? label : `${label}, ${role}`),
} as const;

const swatchHint = (label: string): HintSpec => ({
  name: label,
  description: 'Choose this colour for drawing.',
  shortcuts: [
    { label: 'Front colour', mouse: 'left' },
    { label: 'Back colour', mouse: 'right' },
    { label: 'Back colour', keys: ['shift'], mouse: 'left' },
    { label: 'Swap colours', command: COMMAND_ID.swapColours },
  ],
});

const PALETTE_COLUMNS = 4;

const PLATFORM_GROUPS = platformGroups();

export { PALETTE_COLUMNS, PALETTE_PANEL_TEXT, PLATFORM_GROUPS, swatchHint };
