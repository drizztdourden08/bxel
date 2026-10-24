/* @layer core @kind logic */
import type { AssetSlice } from '../../model/asset.type';
import type { Clock } from '../clock.type';
import { tilemapParts } from './tilemap-parts';
import { writeAssetContainer } from './write-asset-container';

const encodeTilemap = (slice: AssetSlice, preview: Uint8Array | null, clock: Clock): Uint8Array =>
  writeAssetContainer(tilemapParts(slice, preview, clock));

export { encodeTilemap };
