/* @layer renderer-app @kind logic */
import { findBank } from '@bxel/document';
import type { Tileset } from '@bxel/document';
import { fitImage } from '../add-frames/fit-image';
import { readDropFile } from '../add-frames/read-drop-file';
import { currentArtwork } from '../sheet/current-artwork';
import { tileBlocks } from './tile-blocks';
import { TILE_DROP_TEXT } from './tile-drag.constants';
import type { BlocksRead } from './tile-drag.type';

const imageBlocks = async (file: File, tileset: Tileset): Promise<BlocksRead> => {
  const read = await readDropFile(file);
  if (!read.ok) return { ok: false, reason: read.reason };
  const { image } = read;
  const { tileWidth, tileHeight } = tileset;
  if (image.width % tileWidth !== 0 || image.height % tileHeight !== 0) {
    return { ok: false, reason: TILE_DROP_TEXT.wrongSize(image.width, image.height, tileWidth, tileHeight) };
  }
  const artwork = currentArtwork();
  const fit = fitImage(image, artwork ? findBank(artwork, tileset.bankId) : undefined);
  if (!fit.ok) return { ok: false, reason: fit.reason };
  return { ok: true, blocks: tileBlocks(fit.pixels, image.width, image.height, tileWidth, tileHeight) };
};

export { imageBlocks };
