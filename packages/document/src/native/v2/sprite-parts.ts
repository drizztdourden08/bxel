/* @layer core @kind logic */
import { ASSET_KIND } from '../../model/asset-format.constants';
import type { AssetSlice } from '../../model/asset.type';
import type { Clock } from '../clock.type';
import { assetParts } from './asset-parts';
import type { AssetParts } from './asset-parts.type';
import { spriteBlobs } from './sprite-blobs';
import { spriteToFile } from './sprite-to-file';

const spriteParts = (slice: AssetSlice, preview: Uint8Array | null, clock: Clock): AssetParts => {
  const file = spriteToFile(slice);
  const sprite = slice.artwork.sprites?.[0];
  const header = { kind: ASSET_KIND.sprite, id: file.sprite.id, name: file.sprite.name, links: slice.links };
  return assetParts(header, file, { preview, blobs: sprite ? spriteBlobs(sprite) : new Map() }, clock);
};

export { spriteParts };
