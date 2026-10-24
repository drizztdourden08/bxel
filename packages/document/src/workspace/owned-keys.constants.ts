/* @layer core @kind config */
import type { AssetKind } from '../model/asset.type';
import type { ContentKey } from './content-key.type';

const CONTENT_KEYS: readonly ContentKey[] = ['banks', 'sprites', 'sheets', 'presets', 'tilesets', 'tilemaps'];

const OWNED_KEYS: Readonly<Record<AssetKind, readonly ContentKey[]>> = {
  sprite: ['sprites', 'presets'],
  sheet: ['sheets', 'presets'],
  palette: ['banks'],
  tileset: ['tilesets', 'sprites'],
  tilemap: ['tilemaps'],
  project: [],
};

export { CONTENT_KEYS, OWNED_KEYS };
