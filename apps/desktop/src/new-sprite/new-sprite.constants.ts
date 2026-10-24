/* @layer renderer-app @kind constants */
import { LIMIT_DEFAULT } from '../palette-limit/palette-limit.constants';
import { PRESET_DEFAULT } from '../palette-source/palette-source.constants';
import type { CreationForm, CreationMemory } from './new-sprite.type';

const SIZE_PRESETS: readonly number[] = [8, 16, 32, 64];

const MAX_SHEET_SPRITES = 64;

const NEW_MEMORY_DEFAULT: CreationMemory = {
  width: 16,
  height: 16,
  limit: LIMIT_DEFAULT,
  transparent: true,
  presetId: PRESET_DEFAULT,
};

const NEW_FORM_BASE: CreationForm = {
  kind: 'sprite',
  name: '',
  width: NEW_MEMORY_DEFAULT.width,
  height: NEW_MEMORY_DEFAULT.height,
  cellWidth: 16,
  cellHeight: 16,
  columns: 4,
  rows: 1,
  background: 'transparent',
  backgroundSlot: 0,
  limit: NEW_MEMORY_DEFAULT.limit,
  transparent: NEW_MEMORY_DEFAULT.transparent,
  source: { kind: 'preset', presetId: PRESET_DEFAULT, file: null },
  platformId: null,
};

const NEW_FILE_NAME = 'Untitled';

const NEW_SHEET_NAME = 'Sheet';

const NEW_SHEET_REF = 'new-sheet';

const NEW_REF = 'new0';

const NEW_LABEL = {
  sprite: 'New sprite',
  sheet: 'New sheet',
} as const;

const NEW_TEXT = {
  title: 'New file',
  titleSprite: 'New sprite',
  kind: 'Type',
  sprite: 'Sprite',
  sheet: 'Sheet of sprites',
  name: 'Name',
  size: 'Size',
  cell: 'Cell size',
  grid: 'Grid',
  columns: 'columns',
  rows: 'rows',
  width: 'Width',
  height: 'Height',
  background: 'Background',
  transparentBackground: 'Transparent',
  opaqueBackground: 'Opaque',
  backgroundColor: 'Background color',
  palette: 'Palette and color limit',
  result: 'Result',
  create: 'Create sprite',
  createSheet: 'Create sheet',
  cancel: 'Cancel',
  nothing: 'Nothing is created until you choose Create.',
  sheetNote: (count: number, first: string, last: string): string =>
    `Creates ${count} sprites, ${first} to ${last}. Placing them on a sheet is not built yet.`,
  sheetLimit: `A sheet holds 1 to ${MAX_SHEET_SPRITES} sprites.`,
  backgroundPick: 'Choose a color for the background.',
  shared: (name: string, count: number): string => `Palette ${name}, shared by ${count} sprites`,
  inherited: 'The palette is inherited and read only.',
  created: (names: readonly string[]): string => (names.length === 1 ? `Created sprite ${names[0] ?? ''}.` : `Created ${names.length} sprites.`),
  failed: (reason: string): string => `Could not create the sprite. ${reason}`,
  noFile: 'Open or create a file first.',
  swatch: (index: number, name: string): string => `Swatch ${index}, ${name}`,
} as const;

export {
  MAX_SHEET_SPRITES, NEW_FILE_NAME, NEW_FORM_BASE, NEW_LABEL, NEW_MEMORY_DEFAULT, NEW_REF, NEW_SHEET_NAME, NEW_SHEET_REF, NEW_TEXT, SIZE_PRESETS,
};
