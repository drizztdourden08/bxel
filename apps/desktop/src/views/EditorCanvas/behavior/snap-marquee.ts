/* @layer renderer-app @kind logic */
import type { Point } from '@bxel/raster';
import { guideScope } from '../../../guides/guide-scope';
import { snapToGuides } from '../../../guides/snap-to-guides';
import { useViewStore } from '../../../stores/useViewStore';
import type { PixelViewportHandle } from '../../PixelViewport';
import type { ClientPoint, MarqueeCorner } from './canvas-tools.type';

const snapMarquee = (viewport: PixelViewportHandle | null, event: ClientPoint, corner: MarqueeCorner): Point => {
  const { snap, guides } = useViewStore.getState();
  const marquee = corner.variant === 'rect' || corner.variant === 'ellipse';
  if (!viewport || !snap || !guides || !marquee) return corner.at;
  const raw = viewport.screenToPixel(event.clientX, event.clientY);
  return snapToGuides(raw, corner.at, { lines: guideScope()?.lines(), zoom: viewport.view().zoom, from: corner.from });
};

export { snapMarquee };
