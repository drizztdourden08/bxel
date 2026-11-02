/* @layer renderer-app @kind logic */
import type { Point } from '@bxel/raster';
import { floatBox } from '../../../editor/pending/float-box';
import { guideScope } from '../../../guides/guide-scope';
import { snapOffset } from '../../../guides/snap-offset';
import { useViewStore } from '../../../stores/useViewStore';
import type { PixelViewportHandle } from '../../PixelViewport';
import type { GridLines } from './tile-grid-lines';
import { tileGridLines } from './tile-grid-lines';

const floatLines = (guided: boolean): GridLines | undefined => {
  const guides = guided ? guideScope()?.lines() : undefined;
  const tiles = tileGridLines();
  if (!guides) return tiles ?? undefined;
  return tiles ? { x: [...guides.x, ...tiles.x], y: [...guides.y, ...tiles.y] } : guides;
};

const snapFloat = (viewport: PixelViewportHandle | null, offset: Point): Point => {
  const { snap, guides } = useViewStore.getState();
  const box = floatBox();
  if (!viewport || !snap || !box) return offset;
  return snapOffset(box, offset, { lines: floatLines(guides), zoom: viewport.view().zoom });
};

export { snapFloat };
