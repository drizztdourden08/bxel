/* @layer core @kind logic */
import type { AssetSlice } from '../../model/asset.type';
import type { Clock } from '../clock.type';
import { sheetParts } from './sheet-parts';
import { writeAssetContainer } from './write-asset-container';

const encodeSheet = (slice: AssetSlice, preview: Uint8Array | null, clock: Clock): Uint8Array =>
  writeAssetContainer(sheetParts(slice, preview, clock));

export { encodeSheet };
