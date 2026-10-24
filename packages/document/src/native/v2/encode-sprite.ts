/* @layer core @kind logic */
import { ASSET_KIND } from '../../model/asset-format.constants';
import type { AssetSlice } from '../../model/asset.type';
import type { Clock } from '../clock.type';
import { encodeAssetFile } from './encode-asset-file';
import { spriteBlobs } from './sprite-blobs';
import { spriteToFile } from './sprite-to-file';

const encodeSprite = (slice: AssetSlice, preview: Uint8Array | null, clock: Clock): Uint8Array => {
  const file = spriteToFile(slice);
  const sprite = slice.artwork.sprites?.[0];
  const header = { kind: ASSET_KIND.sprite, id: file.sprite.id, name: file.sprite.name, links: slice.links };
  return encodeAssetFile(header, file, { preview, blobs: sprite ? spriteBlobs(sprite) : new Map() }, clock);
};

export { encodeSprite };
