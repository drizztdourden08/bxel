/* @layer renderer-app @kind logic */
import type { Rect, Slice } from '@bxel/document';
import { currentTarget } from '../../../editor/current-target';
import { sliceDraft } from '../../../slice/slice-draft';
import { useSliceToolStore } from '../../../stores/useSliceToolStore';
import { useToolStore } from '../../../stores/useToolStore';
import { useViewStore } from '../../../stores/useViewStore';
import type { PixelView } from '../../PixelViewport';
import type { OverlayLook } from './canvas-tools.type';
import { paintSliceBox } from './paint-slice-box';

const shapeOf = (slice: Slice): Slice => {
  const drag = sliceDraft.current;
  if (!drag || drag.kind === 'new' || drag.id !== slice.id) return slice;
  return drag.kind === 'centre' ? { ...slice, center: drag.centre } : { ...slice, rect: drag.rect };
};

const paintSlices = (ctx: CanvasRenderingContext2D, view: PixelView, look: OverlayLook): void => {
  const target = currentTarget();
  const shown = useViewStore.getState().slices || useToolStore.getState().tool === 'slice';
  if (!target || !shown) return;
  const { selected } = useSliceToolStore.getState();
  for (const slice of target.sprite.slices) paintSliceBox(ctx, view, { slice: shapeOf(slice), selected: slice.id === selected, look });
  const drag = sliceDraft.current;
  if (drag?.kind === 'new' && drag.rect.width > 0) {
    const rect: Rect = drag.rect;
    paintSliceBox(ctx, view, { slice: { id: 'draft' as Slice['id'], name: '', rect, pivot: null, center: null }, selected: true, look });
  }
};

export { paintSlices };
