/* @layer core @kind logic */
import { ASSET_KIND } from '../../model/asset-format.constants';
import type { AssetSlice } from '../../model/asset.type';
import type { Clock } from '../clock.type';
import { encodeAssetFile } from './encode-asset-file';
import { tilemapBlobs } from './tilemap-blobs';
import { tilemapToFile } from './tilemap-to-file';

const encodeTilemap = (slice: AssetSlice, preview: Uint8Array | null, clock: Clock): Uint8Array => {
  const file = tilemapToFile(slice);
  const header = { kind: ASSET_KIND.tilemap, id: file.tilemap.id, name: file.tilemap.name, links: slice.links };
  const tilemap = slice.artwork.tilemaps?.[0];
  return encodeAssetFile(header, file, { preview, blobs: tilemap ? tilemapBlobs(tilemap) : new Map() }, clock);
};

export { encodeTilemap };
