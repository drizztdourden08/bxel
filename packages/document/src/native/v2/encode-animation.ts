/* @layer core @kind logic */
import type { AssetSlice } from '../../model/asset.type';
import type { Clock } from '../clock.type';
import { animationParts } from './animation-parts';
import { writeAssetContainer } from './write-asset-container';

const encodeAnimation = (slice: AssetSlice, preview: Uint8Array | null, clock: Clock): Uint8Array =>
  writeAssetContainer(animationParts(slice, preview, clock));

export { encodeAnimation };
