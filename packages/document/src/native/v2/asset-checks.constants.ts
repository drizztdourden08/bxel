/* @layer core @kind config */
import type { AssetKind, AssetSlice } from '../../model/asset.type';
import { animationToFile } from './animation-to-file';
import { sheetToFile } from './sheet-to-file';
import { spriteToFile } from './sprite-to-file';
import { tilemapToFile } from './tilemap-to-file';
import { tilesetToFile } from './tileset-to-file';

const ASSET_CHECKS: Readonly<Partial<Record<AssetKind, (slice: AssetSlice) => unknown>>> = {
  sprite: spriteToFile,
  animation: animationToFile,
  sheet: sheetToFile,
  tileset: tilesetToFile,
  tilemap: tilemapToFile,
};

export { ASSET_CHECKS };
