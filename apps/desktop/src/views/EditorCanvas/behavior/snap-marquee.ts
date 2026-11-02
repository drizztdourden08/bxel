/* @layer renderer-app @kind logic */
import type { Point } from '@bxel/raster';
import { clampPoint } from '../../../editor/clamp-point';
import { guideScope } from '../../../guides/guide-scope';
import { snapToGuides } from '../../../guides/snap-to-guides';
import { useSelectionStore } from '../../../stores/useSelectionStore';
import { useViewStore } from '../../../stores/useViewStore';
import type { PixelViewportHandle } from '../../PixelViewport';
import type { ClientPoint, MarqueeCorner } from './canvas-tools.type';
import { FREEHAND_VARIANTS, SNAPPED_VARIANTS } from './snap-marquee.constants';

const cornerAt = (raw: Point, corner: MarqueeCorner): Point => {
  const wanted = FREEHAND_VARIANTS.includes(corner.variant) && useSelectionStore.getState().vertexSnap === 'corner';
  return wanted ? clampPoint({ x: Math.round(raw.x), y: Math.round(raw.y) }) : corner.at;
};

const snapMarquee = (viewport: PixelViewportHandle | null, event: ClientPoint, corner: MarqueeCorner): Point => {
  const { snap, guides } = useViewStore.getState();
  if (!viewport) return corner.at;
  const raw = viewport.screenToPixel(event.clientX, event.clientY);
  const at = cornerAt(raw, corner);
  if (!snap || !guides || !SNAPPED_VARIANTS.includes(corner.variant)) return at;
  return snapToGuides(raw, at, { lines: guideScope()?.lines(), zoom: viewport.view().zoom, from: corner.from });
};

export { snapMarquee };
