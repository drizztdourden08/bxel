/* @layer core @kind logic */
import { ASSET_KIND } from '../../model/asset-format.constants';
import type { AssetSlice } from '../../model/asset.type';
import type { Clock } from '../clock.type';
import { ASSET_ANIMATED_VERSION } from './asset-container.constants';
import { animationToFile } from './animation-to-file';
import { assetParts } from './asset-parts';
import type { AssetParts } from './asset-parts.type';
import { spritesBlobs } from './sprites-blobs';

const animationParts = (slice: AssetSlice, preview: Uint8Array | null, clock: Clock): AssetParts => {
  const { file, sprites } = animationToFile(slice);
  const header = { kind: ASSET_KIND.animation, id: file.animation.id, name: file.animation.name, links: slice.links };
  const extras = { preview, blobs: spritesBlobs(sprites), readerVersion: ASSET_ANIMATED_VERSION };
  return assetParts(header, file, extras, clock);
};

export { animationParts };
