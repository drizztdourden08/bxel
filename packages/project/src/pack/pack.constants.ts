/* @layer core @kind constants */
import { ASSET_FORMAT } from '@bxel/document';

const MAX_PACKED_ASSETS = 2000;

const NATIVE_ASSET_EXTENSIONS: readonly string[] = [
  ASSET_FORMAT.sprite.extension,
  ASSET_FORMAT.sheet.extension,
  ASSET_FORMAT.palette.extension,
  ASSET_FORMAT.tileset.extension,
  ASSET_FORMAT.tilemap.extension,
];

const FOLDER_DIR_FALLBACK = 'Folder';
const FOLDER_DIR_ROOM = 56;

export { FOLDER_DIR_FALLBACK, FOLDER_DIR_ROOM, MAX_PACKED_ASSETS, NATIVE_ASSET_EXTENSIONS };
