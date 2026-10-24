/* @layer core @kind logic */
import { ASSET_KIND } from '../../model/asset-format.constants';
import type { AssetSlice } from '../../model/asset.type';
import type { Clock } from '../clock.type';
import { assetParts } from './asset-parts';
import type { AssetParts } from './asset-parts.type';
import { tilemapBlobs } from './tilemap-blobs';
import { tilemapToFile } from './tilemap-to-file';

const tilemapParts = (slice: AssetSlice, preview: Uint8Array | null, clock: Clock): AssetParts => {
  const file = tilemapToFile(slice);
  const header = { kind: ASSET_KIND.tilemap, id: file.tilemap.id, name: file.tilemap.name, links: slice.links };
  const tilemap = slice.artwork.tilemaps?.[0];
  return assetParts(header, file, { preview, blobs: tilemap ? tilemapBlobs(tilemap) : new Map() }, clock);
};

export { tilemapParts };
