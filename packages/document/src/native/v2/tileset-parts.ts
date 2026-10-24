/* @layer core @kind logic */
import { ASSET_KIND } from '../../model/asset-format.constants';
import type { AssetSlice } from '../../model/asset.type';
import type { Clock } from '../clock.type';
import { assetParts } from './asset-parts';
import type { AssetParts } from './asset-parts.type';
import { spritesBlobs } from './sprites-blobs';
import { tilesetToFile } from './tileset-to-file';

const tilesetParts = (slice: AssetSlice, preview: Uint8Array | null, clock: Clock): AssetParts => {
  const { file, sprites } = tilesetToFile(slice);
  const header = { kind: ASSET_KIND.tileset, id: file.tileset.id, name: file.tileset.name, links: slice.links };
  return assetParts(header, file, { preview, blobs: spritesBlobs(sprites) }, clock);
};

export { tilesetParts };
