/* @layer core @kind logic */
import { ASSET_KIND } from '../../model/asset-format.constants';
import type { AssetSlice } from '../../model/asset.type';
import type { Clock } from '../clock.type';
import { encodeAssetFile } from './encode-asset-file';
import { spritesBlobs } from './sprites-blobs';
import { tilesetToFile } from './tileset-to-file';

const encodeTileset = (slice: AssetSlice, preview: Uint8Array | null, clock: Clock): Uint8Array => {
  const { file, sprites } = tilesetToFile(slice);
  const header = { kind: ASSET_KIND.tileset, id: file.tileset.id, name: file.tileset.name, links: slice.links };
  return encodeAssetFile(header, file, { preview, blobs: spritesBlobs(sprites) }, clock);
};

export { encodeTileset };
