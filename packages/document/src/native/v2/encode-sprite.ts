/* @layer core @kind logic */
import { strToU8 } from 'fflate';
import { ASSET_KIND } from '../../model/asset-format.constants';
import type { AssetSlice } from '../../model/asset.type';
import type { Clock } from '../clock.type';
import { canonicalJson } from './canonical-json';
import { spriteBlobs } from './sprite-blobs';
import { spriteToFile } from './sprite-to-file';
import { writeAssetContainer } from './write-asset-container';

const encodeSprite = (slice: AssetSlice, preview: Uint8Array | null, clock: Clock): Uint8Array => {
  const file = spriteToFile(slice);
  const sprite = slice.artwork.sprites?.[0];
  return writeAssetContainer({
    header: { kind: ASSET_KIND.sprite, id: file.sprite.id, name: file.sprite.name, links: slice.links },
    savedAt: clock(),
    documentBytes: strToU8(canonicalJson(file)),
    preview,
    blobs: sprite ? spriteBlobs(sprite) : new Map(),
  });
};

export { encodeSprite };
