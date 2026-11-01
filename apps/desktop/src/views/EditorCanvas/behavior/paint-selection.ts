/* @layer renderer-app @kind logic */
import type { MaskView } from '@bxel/raster';
import type { PendingEdit } from '../../../editor/pending/pending.type';
import { usePendingStore } from '../../../stores/usePendingStore';
import { useReadoutStore } from '../../../stores/useReadoutStore';
import { useSelectionStore } from '../../../stores/useSelectionStore';
import type { PixelView } from '../../PixelViewport';
import type { OverlayLook } from './canvas-tools.type';
import { paintPolygon } from './paint-polygon';
import { strokeOutline } from './stroke-outline';
import { tintMask } from './tint-mask';

const landingOutline = (pending: PendingEdit): MaskView | null =>
  pending.spec.kind === 'transform' ? null : (usePendingStore.getState().outcome?.landing ?? null);

const fitsView = (mask: MaskView, view: PixelView): boolean => mask.width === view.imageWidth && mask.height === view.imageHeight;

const shownMask = (pending: PendingEdit | null, fallback: MaskView | null): MaskView | null => (pending ? landingOutline(pending) : fallback);

const paintVertices = (ctx: CanvasRenderingContext2D, view: PixelView, look: OverlayLook): void => {
  const { vertices } = useSelectionStore.getState();
  const pointer = useReadoutStore.getState().pointer;
  if (vertices.length > 0) paintPolygon(ctx, view, pointer ? [...vertices, pointer] : vertices, look);
};

const paintSelection = (ctx: CanvasRenderingContext2D, view: PixelView, look: OverlayLook): void => {
  const { mask, draft, quickMask } = useSelectionStore.getState();
  const { pending } = usePendingStore.getState();
  const shown = shownMask(pending, draft ?? mask);
  if (shown && fitsView(shown, view)) {
    if (quickMask && !pending) tintMask(ctx, shown, look);
    else strokeOutline(ctx, view, shown, look);
  }
  paintVertices(ctx, view, look);
};

export { paintSelection };
