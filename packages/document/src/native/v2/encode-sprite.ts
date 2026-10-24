/* @layer core @kind logic */
import type { AssetSlice } from '../../model/asset.type';
import type { Clock } from '../clock.type';
import { spriteParts } from './sprite-parts';
import { writeAssetContainer } from './write-asset-container';

const encodeSprite = (slice: AssetSlice, preview: Uint8Array | null, clock: Clock): Uint8Array =>
  writeAssetContainer(spriteParts(slice, preview, clock));

export { encodeSprite };
