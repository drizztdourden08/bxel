/* @layer renderer-app @kind constants */
import type { DocumentDialogOptions } from '@drizztdourden08/brock-core';
import { DEFAULT_ARTWORK } from '../documents/default-artwork.constants';
import type { PalettePreset, PaletteSource, SourceColor } from './palette-source.type';

const PRESET_DEFAULT = 'bxel-16';

const PALETTE_PRESETS: readonly PalettePreset[] = [
  { id: PRESET_DEFAULT, name: DEFAULT_ARTWORK.bank.name, colors: DEFAULT_ARTWORK.bank.colors },
  {
    id: 'pico-8',
    name: 'PICO-8',
    colors: [
      { rgb: '#000000', name: 'Black' },
      { rgb: '#1d2b53', name: 'Dark blue' },
      { rgb: '#7e2553', name: 'Dark purple' },
      { rgb: '#008751', name: 'Dark green' },
      { rgb: '#ab5236', name: 'Brown' },
      { rgb: '#5f574f', name: 'Dark gray' },
      { rgb: '#c2c3c7', name: 'Light gray' },
      { rgb: '#fff1e8', name: 'White' },
      { rgb: '#ff004d', name: 'Red' },
      { rgb: '#ffa300', name: 'Orange' },
      { rgb: '#ffec27', name: 'Yellow' },
      { rgb: '#00e436', name: 'Green' },
      { rgb: '#29adff', name: 'Blue' },
      { rgb: '#83769c', name: 'Lavender' },
      { rgb: '#ff77a8', name: 'Pink' },
      { rgb: '#ffccaa', name: 'Light peach' },
    ],
  },
  {
    id: 'sweetie-16',
    name: 'Sweetie 16',
    colors: [
      { rgb: '#1a1c2c', name: 'Ink' },
      { rgb: '#5d275d', name: 'Plum' },
      { rgb: '#b13e53', name: 'Berry' },
      { rgb: '#ef7d57', name: 'Orange' },
      { rgb: '#ffcd75', name: 'Sand' },
      { rgb: '#a7f070', name: 'Lime' },
      { rgb: '#38b764', name: 'Green' },
      { rgb: '#257179', name: 'Teal' },
      { rgb: '#29366f', name: 'Navy' },
      { rgb: '#3b5dc9', name: 'Blue' },
      { rgb: '#41a6f6', name: 'Sky' },
      { rgb: '#73eff7', name: 'Cyan' },
      { rgb: '#f4f4f4', name: 'White' },
      { rgb: '#94b0c2', name: 'Silver' },
      { rgb: '#566c86', name: 'Slate' },
      { rgb: '#333c57', name: 'Dusk' },
    ],
  },
  {
    id: 'game-boy',
    name: 'Game Boy',
    colors: [
      { rgb: '#0f380f', name: 'Darkest' },
      { rgb: '#306230', name: 'Dark' },
      { rgb: '#8bac0f', name: 'Light' },
      { rgb: '#9bbc0f', name: 'Lightest' },
    ],
  },
  {
    id: 'black-and-white',
    name: 'Black and white',
    colors: [
      { rgb: '#000000', name: 'Black' },
      { rgb: '#ffffff', name: 'White' },
    ],
  },
];

const CUSTOM_COLORS: readonly SourceColor[] = [
  { rgb: '#000000', name: 'Black' },
  { rgb: '#ffffff', name: 'White' },
];

const CUSTOM_NAME = 'Custom';

const FALLBACK_BACKGROUND: SourceColor = { rgb: '#000000', name: 'Black' };

const SOURCE_DEFAULT: PaletteSource = { kind: 'preset', presetId: PRESET_DEFAULT, file: null };

const PALETTE_FILE_FILTERS: NonNullable<DocumentDialogOptions['filters']> = [
  { name: 'Palette file', extensions: ['gpl', 'pal', 'png'] },
];

const FILE_CHOICE = 'file';

const PRESET_PREFIX = 'preset:';

const CUSTOM_CHOICE = 'custom';

const HEX_COLOR = /^#[0-9a-f]{6}/i;

const PALETTE_FILE_KIND = { gpl: 'gpl', pal: 'pal', png: 'png' } as const;

const SOURCE_TEXT = {
  label: 'Source',
  fileEntry: 'Palette file...',
  customEntry: 'Custom',
  presetLabel: (name: string): string => `Preset: ${name}`,
  chosenFile: (name: string): string => `File: ${name}`,
  choose: 'Choose a palette file.',
  unreadable: 'Cannot read that palette file. Bxel opens GPL, PAL and palette PNG files.',
  title: 'Choose a palette file',
  fits: (kept: number, total: number): string => `Uses the first ${kept} of ${total} colors. Raise the limit to keep all of them.`,
} as const;

export {
  CUSTOM_CHOICE,
  CUSTOM_COLORS,
  CUSTOM_NAME,
  FALLBACK_BACKGROUND,
  FILE_CHOICE,
  HEX_COLOR,
  PALETTE_FILE_FILTERS,
  PALETTE_FILE_KIND,
  PALETTE_PRESETS,
  PRESET_DEFAULT,
  PRESET_PREFIX,
  SOURCE_DEFAULT,
  SOURCE_TEXT,
};
