/* @layer renderer-app @kind logic */
import { findSprite, flattenFrame } from '@bxel/document';
import { currentArtwork } from '../../../sheet/current-artwork';
import { useNoticeStore } from '../../../stores/useNoticeStore';
import { currentTileset } from '../../../tilemap/current-tileset';
import { tileOf } from '../../../tilemap/tile-of';
import { TILESET_TEXT } from '../TilesetPanel.constants';
import { addShape } from './add-shape';
import { tracePixels } from './trace-pixels';

const tracePicked = (): boolean => {
  const artwork = currentArtwork();
  const tileset = currentTileset();
  const tile = tileOf(undefined);
  const sprite = artwork && tile ? findSprite(artwork, tile.spriteId) : undefined;
  const frame = sprite?.frames[0];
  if (!sprite || !frame || !tileset || !tile) return false;
  const shape = tracePixels(flattenFrame(sprite, frame.id), tileset.tileWidth);
  if (shape) return addShape(tile, shape);
  useNoticeStore.getState().post(TILESET_TEXT.nothingToTrace);
  return false;
};

export { tracePicked };
