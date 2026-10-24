/* @layer renderer-app @kind logic */
import type { PointerEvent } from 'react';
import { currentTarget } from '../../../editor/current-target';
import { insideSprite } from '../../../editor/inside-sprite';
import { addVertex } from '../../../editor/selection/add-vertex';
import { closePolygon } from '../../../editor/selection/close-polygon';
import { incomingMask } from '../../../editor/selection/incoming-mask';
import { mergeMask } from '../../../editor/selection/merge-mask';
import { modeOf } from '../../../editor/selection/mode-of';
import { pointMask } from '../../../editor/selection/point-mask';
import { DOUBLE_CLICK, POLYGON_MIN_VERTICES } from '../../../editor/selection/selection.constants';
import { selectionMask } from '../../../editor/selection/selection-mask';
import { setSelection } from '../../../editor/selection/set-selection';
import { useSelectionStore } from '../../../stores/useSelectionStore';
import type { PixelViewportHandle } from '../../PixelViewport';
import type { ActiveDrag } from './canvas-tools.type';
import { pixelAtEvent } from './pixel-at-event';

const nearFirst = (first: { x: number; y: number } | undefined, at: { x: number; y: number }): boolean =>
  first !== undefined && Math.abs(first.x - at.x) <= 1 && Math.abs(first.y - at.y) <= 1;

const beginSelectDrag = (viewport: PixelViewportHandle | null, event: PointerEvent<HTMLElement>): ActiveDrag | null => {
  const target = currentTarget();
  if (!target) return null;
  const store = useSelectionStore.getState();
  const at = pixelAtEvent(viewport, event);
  const mode = modeOf(event, store.mode);
  const base = selectionMask(target);
  if (store.variant === 'wand' || store.variant === 'colour') {
    if (insideSprite(target, at)) setSelection(target, mergeMask(base, pointMask(target, store.variant, at, store.connectivity), mode));
    return null;
  }
  if (store.variant === 'polygon') {
    const closing = event.detail >= DOUBLE_CLICK || (store.vertices.length >= POLYGON_MIN_VERTICES && nearFirst(store.vertices[0], at));
    if (closing) closePolygon(mode);
    else addVertex(at);
    return null;
  }
  const shape = { variant: store.variant, from: at, to: at, path: [at] };
  store.setDraft(mergeMask(base, incomingMask(shape, target.sprite), mode));
  return { kind: 'shape', shape, base, mode };
};

export { beginSelectDrag };
