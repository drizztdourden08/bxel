/* @layer renderer-app @kind constants */
import { COMMAND_ID } from '../../keymap/keymap.constants';
import type { HintSpec } from '../ActionHint';
import type { HeldChipDef } from './PalettePanel.type';

const PALETTE_PANEL_TEXT = {
  empty: 'No palette is open.',
  grid: 'Palette swatches',
  held: 'Colours to draw with',
  caption: (marks: readonly number[]): string => marks.join(' '),
  name: (label: string, marks: readonly number[]): string => (marks.length === 0 ? label : `${label}, colour ${marks.join(' and ')}`),
  chip: (position: number, label: string): string => `Colour ${position}, ${label}`,
  chipEmpty: (position: number): string => `Colour ${position}, none`,
  chipName: (position: number): string => `Colour ${position}`,
} as const;

const SWATCH_MIN_WIDTH = 24;

const CONFIG_HINT: HintSpec = {
  name: 'Palette settings',
  description: 'Open the Asset settings on the palette: choose the palette, load a swatch set and set the platform rules for this file.',
};

const HELD_CHIPS: readonly HeldChipDef[] = [
  { slot: 'foreground', position: 1, draw: { mouse: 'left' }, pick: { mouse: 'left' } },
  { slot: 'background', position: 2, draw: { mouse: 'right' }, pick: { mouse: 'right' } },
  { slot: 'third', position: 3, draw: { keys: ['ctrl'], mouse: 'left' }, pick: { keys: ['shift'], mouse: 'left' } },
  { slot: 'fourth', position: 4, draw: { keys: ['ctrl'], mouse: 'right' }, pick: { keys: ['shift'], mouse: 'right' } },
];

const swatchHint = (label: string): HintSpec => ({
  name: label,
  description: 'Choose this colour for drawing. Double click to change its colour.',
  shortcuts: [
    { label: 'Colour 1', mouse: 'left' },
    { label: 'Colour 2', mouse: 'right' },
    { label: 'Colour 3', keys: ['shift'], mouse: 'left' },
    { label: 'Colour 4', keys: ['shift'], mouse: 'right' },
    { label: 'Swap colours 1 and 2', command: COMMAND_ID.swapColours },
    { label: 'Swap pairs', command: COMMAND_ID.swapColourPairs },
  ],
});

const chipHint = (chip: HeldChipDef): HintSpec => ({
  name: PALETTE_PANEL_TEXT.chipName(chip.position),
  description: 'A colour to draw with. Click it to change the colour itself.',
  shortcuts: [
    { label: 'Draw with it', keys: chip.draw.keys, mouse: chip.draw.mouse },
    { label: 'Pick it', keys: chip.pick.keys, mouse: chip.pick.mouse },
    { label: 'Swap pairs', command: COMMAND_ID.swapColourPairs },
  ],
});

export { chipHint, CONFIG_HINT, HELD_CHIPS, PALETTE_PANEL_TEXT, SWATCH_MIN_WIDTH, swatchHint };
