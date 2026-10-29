/* @layer renderer-app @kind logic */
import type { Point } from '@bxel/raster';
import { guideScope } from '../../../guides/guide-scope';
import { snapToGuides } from '../../../guides/snap-to-guides';
import { useViewStore } from '../../../stores/useViewStore';
import type { PixelViewportHandle } from '../../PixelViewport';
import type { ClientPoint } from './canvas-tools.type';

const snapMarquee = (viewport: PixelViewportHandle | null, event: ClientPoint, at: Point, from: Point | null): Point => {
  const { snap, guides } = useViewStore.getState();
  if (!viewport || !snap || !guides) return at;
  const raw = viewport.screenToPixel(event.clientX, event.clientY);
  return snapToGuides(raw, at, { lines: guideScope()?.lines(), zoom: viewport.view().zoom, from });
};

export { snapMarquee };
