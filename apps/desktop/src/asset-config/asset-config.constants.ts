/* @layer renderer-app @kind constants */
import type { Artwork } from '@bxel/document';

const EDIT_DELAY_MS = 450;

const FOCUS_PICKERS = {
  sprite: (artwork: Artwork, id: string) => artwork.sprites.find((sprite) => sprite.id === id),
  sheet: (artwork: Artwork, id: string) => artwork.sheets.find((sheet) => sheet.id === id),
  palette: (artwork: Artwork, id: string) => artwork.banks.find((bank) => bank.id === id),
  tileset: (artwork: Artwork, id: string) => artwork.tilesets.find((tileset) => tileset.id === id),
  tilemap: (artwork: Artwork, id: string) => artwork.tilemaps.find((tilemap) => tilemap.id === id),
} as const;

const ASSET_LABEL = {
  rename: 'Rename',
  resize: 'Resize sprite',
  pivot: 'Move the pivot',
  frameTime: 'Set the frame time',
  paletteName: 'Rename palette',
  paletteLimit: 'Change colour limit',
  transparent: 'Change the transparent slot',
  sheetStyle: 'Style sheet',
  mapSize: 'Resize map',
  orientation: 'Set map orientation',
  platform: 'Set the platform',
  strict: 'Set strict rules',
  pixelGrid: 'Set the pixel grid',
} as const;

const ASSET_TEXT = {
  noAsset: 'Open an asset to see its settings.',
  noAssetTitle: 'No asset open',
  newAsset: 'New asset...',
  openAsset: 'Open...',
  readOnly: 'This asset is open read only.',
  badNumber: 'Type a whole number.',
  failed: (reason: string): string => `Could not change the setting. ${reason}`,
  projectPalette: (label: string): string => `${label}, palette file`,
} as const;

const NO_PATHS: ReadonlyMap<string, string> = new Map();

export { ASSET_LABEL, ASSET_TEXT, EDIT_DELAY_MS, FOCUS_PICKERS, NO_PATHS };
