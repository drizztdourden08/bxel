/* @layer core @kind logic */
import type { AssetSlice } from '../../model/asset.type';
import type { Clock } from '../clock.type';
import { tilesetParts } from './tileset-parts';
import { writeAssetContainer } from './write-asset-container';

const encodeTileset = (slice: AssetSlice, preview: Uint8Array | null, clock: Clock): Uint8Array =>
  writeAssetContainer(tilesetParts(slice, preview, clock));

export { encodeTileset };
