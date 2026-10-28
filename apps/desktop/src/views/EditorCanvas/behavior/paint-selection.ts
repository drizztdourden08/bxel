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

const landingOutline = (pending: PendingEdit): MaskView | null =>
  pending.spec.kind === 'transform' ? null : (usePendingStore.getState().outcome?.landing ?? null);

const paintSelection = (ctx: CanvasRenderingContext2D, view: PixelView, look: OverlayLook): void => {
  const { mask, draft, vertices } = useSelectionStore.getState();
  const { pending } = usePendingStore.getState();
  const shown = pending ? landingOutline(pending) : (draft ?? mask);
  if (shown?.width === view.imageWidth && shown.height === view.imageHeight) strokeOutline(ctx, view, shown, look);
  const pointer = useReadoutStore.getState().pointer;
  if (vertices.length > 0) paintPolygon(ctx, view, pointer ? [...vertices, pointer] : vertices, look);
};

export { paintSelection };
