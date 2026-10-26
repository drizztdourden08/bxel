/* @layer renderer-app @kind logic */
import type { CanvasLook } from '../../../canvas-look/canvas-look.type';
import { checkerKey } from '../../../canvas-look/checker-key';
import { checkerTile } from '../../../canvas-look/checker-tile';
import type { FrameCache } from './viewport.type';

const refreshTiles = (doc: Document, look: CanvasLook, dpr: number, cache: FrameCache): void => {
  const checker = checkerKey(look, dpr);
  if (!cache.tile || cache.tileKey !== checker) {
    cache.tile = checkerTile(doc, look, dpr);
    cache.tileKey = checker;
  }
};

export { refreshTiles };
