/* @layer core @kind logic */
import type { AssetSlice } from '../../model/asset.type';
import type { Clock } from '../clock.type';
import { paletteParts } from './palette-parts';
import { writeAssetContainer } from './write-asset-container';

const encodePalette = (slice: AssetSlice, preview: Uint8Array | null, clock: Clock): Uint8Array =>
  writeAssetContainer(paletteParts(slice, preview, clock));

export { encodePalette };
