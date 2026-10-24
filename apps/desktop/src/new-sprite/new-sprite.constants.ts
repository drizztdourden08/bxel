/* @layer renderer-app @kind constants */
import type { Artwork } from '@bxel/document';
import { LIMIT_DEFAULT } from '../palette-limit/palette-limit.constants';
import { PRESET_DEFAULT } from '../palette-source/palette-source.constants';
import type { CreationErrors, CreationForm, CreationKind, CreationMemory } from './new-sprite.type';

const SIZE_PRESETS: readonly number[] = [8, 16, 32, 64];

const MAX_SHEET_SPRITES = 64;

const MAX_NEW_BANKS = 32;

const MAX_MAP_SIDE = 1024;

const NO_ERRORS: CreationErrors = { name: null, size: null, sheet: null, limit: null, palette: null, background: null, banks: null };

const BANK_NAME_ROOM = 58;

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
  banks: 1,
  tilesetId: '',
  frameMs: 100,
};

const KIND_NAME: Readonly<Record<CreationKind, string>> = { sprite: 'sprite', sheet: 'sprite', palette: 'palette', tileset: 'tileset', tilemap: 'map' };

const KIND_NAMES_OF: Readonly<Record<CreationKind, (artwork: Artwork) => string[]>> = {
  sprite: (artwork) => artwork.sprites.map((sprite) => sprite.name),
  sheet: (artwork) => artwork.sprites.map((sprite) => sprite.name),
  palette: (artwork) => artwork.banks.map((bank) => bank.name),
  tileset: (artwork) => artwork.tilesets.map((tileset) => tileset.name),
  tilemap: (artwork) => artwork.tilemaps.map((tilemap) => tilemap.name),
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
  title: 'New asset',
  paletteKind: 'Palette',
  tileset: 'Tileset',
  tilemap: 'Tilemap',
  tilesetPick: 'Tileset',
  noTileset: 'The map needs a tileset. Create a tileset first.',
  mapSize: (side: number): string => `A map has 1 to ${side} columns and rows.`,
  tileSize: 'Tile size',
  mapGrid: 'Map size',
  createPalette: 'Create palette',
  createTileset: 'Create tileset',
  createTilemap: 'Create tilemap',
  needsFile: 'Open or create a file first.',
  createdAsset: (name: string): string => `Created ${name}.`,
  inProject: 'The asset is written to the folder of its kind in the project.',
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
  backgroundColor: 'Background colour',
  palette: 'Palette and colour limit',
  banks: 'Palettes',
  banksHint: 'How many palettes the file starts with. Each one begins with the colours above.',
  banksRange: `A file starts with 1 to ${MAX_NEW_BANKS} palettes.`,
  banksNote: (count: number, slots: number): string => `Creates ${count} palettes of ${slots} slots each.`,
  result: 'Result',
  create: 'Create sprite',
  createSheet: 'Create sheet',
  cancel: 'Cancel',
  nothing: 'Nothing is created until you choose Create.',
  sheetNote: (count: number, first: string, last: string): string =>
    `Creates ${count} sprites, ${first} to ${last}. Placing them on a sheet is not built yet.`,
  sheetLimit: `A sheet holds 1 to ${MAX_SHEET_SPRITES} sprites.`,
  backgroundPick: 'Choose a colour for the background.',
  shared: (name: string, count: number): string => `Palette ${name}, shared by ${count} sprites`,
  inherited: 'The palette is inherited and read only.',
  created: (names: readonly string[]): string => (names.length === 1 ? `Created sprite ${names[0] ?? ''}.` : `Created ${names.length} sprites.`),
  failed: (reason: string): string => `Could not create the sprite. ${reason}`,
  noFile: 'Open or create a file first.',
  swatch: (index: number, name: string): string => `Swatch ${index}, ${name}`,
} as const;

export {
  BANK_NAME_ROOM, KIND_NAME, KIND_NAMES_OF, MAX_MAP_SIDE, MAX_NEW_BANKS, MAX_SHEET_SPRITES, NEW_FILE_NAME, NEW_FORM_BASE, NEW_LABEL, NEW_MEMORY_DEFAULT, NEW_REF, NEW_SHEET_NAME, NEW_SHEET_REF, NEW_TEXT, NO_ERRORS, SIZE_PRESETS,
};
