/* @layer renderer-app @kind constants */
import type { Artwork, AssetKind } from '@bxel/document';
import { encodePalette, encodeSheet, encodeSprite, encodeTilemap, encodeTileset } from '@bxel/document/native';
import type { Clock } from '@bxel/document/native';
import { NATIVE_ASSET_EXTENSIONS } from '@bxel/project';
import type { FolderRole } from '@bxel/project';
import type { Encoder, NamedAsset } from './workspace.type';

const ASSET_ENCODERS: Readonly<Partial<Record<AssetKind, Encoder>>> = {
  palette: encodePalette,
  sprite: encodeSprite,
  sheet: encodeSheet,
  tileset: encodeTileset,
  tilemap: encodeTilemap,
};

const ASSETS_OF: Readonly<Record<AssetKind, (artwork: Artwork) => readonly NamedAsset[]>> = {
  sprite: (artwork) => artwork.sprites.filter((sprite) => sprite.role !== 'tile'),
  sheet: (artwork) => artwork.sheets,
  palette: (artwork) => artwork.banks,
  tileset: (artwork) => artwork.tilesets,
  tilemap: (artwork) => artwork.tilemaps,
  project: (artwork) => [artwork],
};

const ASSET_FILE_LABEL: Readonly<Record<AssetKind, string>> = {
  sprite: 'Bxel sprite',
  sheet: 'Bxel spritesheet',
  palette: 'Bxel palette',
  tileset: 'Bxel tileset',
  tilemap: 'Bxel tilemap',
  project: 'Bxel project',
};

const DECODE_ORDER: readonly (readonly AssetKind[])[] = [['palette'], ['sprite', 'tileset'], ['sheet'], ['tilemap']];

const ROLE_OF_KIND: Readonly<Partial<Record<AssetKind, FolderRole>>> = {
  sprite: 'sprites',
  sheet: 'sheets',
  palette: 'palettes',
  tileset: 'tilemaps',
  tilemap: 'tilemaps',
};

const SAVE_ORDER: readonly AssetKind[] = ['palette', 'sprite', 'tileset', 'sheet', 'tilemap'];

const ASSET_KINDS: readonly string[] = ['sprite', 'sheet', 'palette', 'tileset', 'tilemap'];

const TAB_KINDS: readonly AssetKind[] = ['sprite', 'sheet', 'tileset', 'tilemap', 'palette'];

const MAX_WORKSPACE_ASSETS = 2000;

const MAX_STEP_NAMES = 500;

const NATIVE_EXTENSIONS: readonly string[] = NATIVE_ASSET_EXTENSIONS.map((extension) => extension.slice(1));

const HASH_CLOCK: Clock = () => 0;

const NAME_FALLBACK = 'asset';

const NO_BANK_ID = 'bnk_000000';

const KEY_SEPARATOR = ':';

const TAB_SEPARATOR = '|';

const WORKSPACE_TEXT = {
  loading: (done: number, total: number): string => `Opening assets ${done} of ${total}`,
  loadingLabel: 'Opening the project',
  tabsLabel: 'Open assets',
  capped: (total: number, max: number): string => `The project holds ${total} assets. Bxel opened the first ${max}.`,
  skipped: (count: number): string => (count === 1 ? 'One file could not be read and was left out.' : `${count} files could not be read and were left out.`),
  rekeyed: (count: number): string => (count === 1 ? 'One copied file had the same ids as another and was given new ones.' : `${count} copied files had the same ids as others and were given new ones.`),
  trashTitle: 'Move deleted assets to the trash?',
  trashMessage: (names: string): string => `These files belong to assets you deleted: ${names}. They move to the trash. You can restore them from there.`,
  trashConfirm: 'Move to trash',
  trashCancel: 'Keep the files',
  saved: (count: number): string => (count === 1 ? 'Saved one file.' : `Saved ${count} files.`),
  nothingToSave: 'Every asset is saved.',
  saveFailed: (file: string): string => `Could not save ${file}. The file on disk is unchanged.`,
  notNative: 'Bxel opens sprites, sheets, palettes, tilesets, tilemaps, projects and older .bxel files.',
  olderFileLocked: 'This older file opens read only. Split it into separate files to edit.',
} as const;

const SPLIT_TEXT = {
  title: 'Split into separate files',
  bar: (sprites: string, sheets: string, palettes: string): string =>
    `This older Bxel file holds ${sprites}, ${sheets} and ${palettes}. Save them as separate files to edit.`,
  open: 'Split into files...',
  intro: 'Bxel writes each sprite, sheet, palette, tileset and tilemap as its own file. The older file is left as it is.',
  destination: 'Put the files in',
  beside: 'A new project folder beside the file',
  project: 'The open project',
  files: 'Files',
  conflicts: 'Names that were already taken get a number at the end.',
  renamed: (name: string): string => `${name} (name changed to fit a file name)`,
  suffixed: (name: string): string => `${name} (numbered)`,
  split: 'Split',
  cancel: 'Cancel',
  pickParent: 'Choose where the new project folder goes',
  unavailable: 'This file cannot be split here.',
  noProject: 'Open a project first.',
  failed: (reason: string): string => `Could not split the file. ${reason}`,
} as const;

export {
  ASSET_ENCODERS,
  ASSET_KINDS,
  ASSET_FILE_LABEL,
  ASSETS_OF,
  DECODE_ORDER,
  HASH_CLOCK,
  KEY_SEPARATOR,
  MAX_STEP_NAMES,
  MAX_WORKSPACE_ASSETS,
  NAME_FALLBACK,
  NATIVE_EXTENSIONS,
  NO_BANK_ID,
  ROLE_OF_KIND,
  SAVE_ORDER,
  SPLIT_TEXT,
  TAB_KINDS,
  TAB_SEPARATOR,
  WORKSPACE_TEXT,
};
