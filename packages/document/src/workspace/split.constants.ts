/* @layer core @kind config */
import type { AssetKind } from '../model/asset.type';

const SPLIT_FOLDER: Readonly<Record<AssetKind, string>> = {
  sprite: 'sprites',
  animation: 'sprites',
  sheet: 'sheets',
  palette: 'palettes',
  tileset: 'tilemaps',
  tilemap: 'tilemaps',
  project: '',
};

const RESERVED_FILE_NAMES = /^(con|prn|aux|nul|com[1-9]|lpt[1-9])$/i;
const ILLEGAL_FILE_CHARACTERS = /[<>:"/\\|?*\p{Cc}]/gu;
const MAX_FILE_STEM = 100;

export { ILLEGAL_FILE_CHARACTERS, MAX_FILE_STEM, RESERVED_FILE_NAMES, SPLIT_FOLDER };
