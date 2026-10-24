/* @layer core @kind config */
import type { AssetKind } from '../../model/asset.type';
import type { Clock } from '../clock.type';
import type { PartsBuilder } from './asset-digest.constants.type';
import { paletteParts } from './palette-parts';
import { sheetParts } from './sheet-parts';
import { spriteParts } from './sprite-parts';
import { tilemapParts } from './tilemap-parts';
import { tilesetParts } from './tileset-parts';

const ASSET_PARTS: Readonly<Partial<Record<AssetKind, PartsBuilder>>> = {
  palette: paletteParts,
  sprite: spriteParts,
  sheet: sheetParts,
  tileset: tilesetParts,
  tilemap: tilemapParts,
};

const DIGEST_CLOCK: Clock = () => 0;

export { ASSET_PARTS, DIGEST_CLOCK };
