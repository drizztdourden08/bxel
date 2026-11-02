/* @layer renderer-app @kind logic */
import type { Point } from '@bxel/raster';
import { guideScope } from '../../../guides/guide-scope';
import { snapToGuides } from '../../../guides/snap-to-guides';
import { useViewStore } from '../../../stores/useViewStore';
import type { PixelViewportHandle } from '../../PixelViewport';
import type { ClientPoint, MarqueeCorner } from './canvas-tools.type';
import { SNAPPED_VARIANTS } from './snap-marquee.constants';

const snapMarquee = (viewport: PixelViewportHandle | null, event: ClientPoint, corner: MarqueeCorner): Point => {
  const { snap, guides } = useViewStore.getState();
  const shaped = SNAPPED_VARIANTS.includes(corner.variant);
  if (!viewport || !snap || !guides || !shaped) return corner.at;
  const raw = viewport.screenToPixel(event.clientX, event.clientY);
  return snapToGuides(raw, corner.at, { lines: guideScope()?.lines(), zoom: viewport.view().zoom, from: corner.from });
};

export { snapMarquee };
