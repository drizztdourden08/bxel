/* @layer renderer-app @kind logic */
import type { PointerEvent } from 'react';
import { currentTarget } from '../../../editor/current-target';
import { insideSprite } from '../../../editor/inside-sprite';
import { addVertex } from '../../../editor/selection/add-vertex';
import { closePolygon } from '../../../editor/selection/close-polygon';
import { commitSelection } from '../../../editor/selection/commit-selection';
import { incomingMask } from '../../../editor/selection/incoming-mask';
import { mergeMask } from '../../../editor/selection/merge-mask';
import { modeOf } from '../../../editor/selection/mode-of';
import { pointMask } from '../../../editor/selection/point-mask';
import { DOUBLE_CLICK, POLYGON_MIN_VERTICES } from '../../../editor/selection/selection.constants';
import { selectionMask } from '../../../editor/selection/selection-mask';
import { freshKeys } from '../../../editor/selection/shape-hold';
import { useSelectionStore } from '../../../stores/useSelectionStore';
import type { PixelViewportHandle } from '../../PixelViewport';
import { beginFloatDrag } from './begin-float-drag';
import type { ActiveDrag } from './canvas-tools.type';
import { pixelAtEvent } from './pixel-at-event';
import { rawPixelAt } from './raw-pixel-at';

const nearFirst = (first: { x: number; y: number } | undefined, at: { x: number; y: number }): boolean =>
  first !== undefined && Math.abs(first.x - at.x) <= 1 && Math.abs(first.y - at.y) <= 1;

const MOVING_VARIANTS = ['rect', 'ellipse', 'lasso', 'polygon'];

const beginSelectDrag = (viewport: PixelViewportHandle | null, event: PointerEvent<HTMLElement>): ActiveDrag | null => {
  const target = currentTarget();
  if (!target) return null;
  const store = useSelectionStore.getState();
  const at = pixelAtEvent(viewport, event);
  const mode = modeOf(event, store.mode);
  const base = selectionMask(target);
  const inside = base !== null && (base.bits[at.y * base.width + at.x] ?? 0) !== 0;
  if (inside && base && event.ctrlKey && event.altKey) return { kind: 'outline', start: rawPixelAt(viewport, event), base };
  if (inside && mode === 'replace' && store.mode === 'replace' && MOVING_VARIANTS.includes(store.variant) && store.vertices.length === 0) {
    return beginFloatDrag(viewport, event);
  }
  if (store.variant === 'wand' || store.variant === 'colour') {
    if (insideSprite(target, at)) commitSelection(target, mergeMask(base, pointMask(target, store.variant, at), mode));
    return null;
  }
  if (store.variant === 'polygon') {
    const closing = event.detail >= DOUBLE_CLICK || (store.vertices.length >= POLYGON_MIN_VERTICES && nearFirst(store.vertices[0], at));
    if (closing) closePolygon(mode);
    else addVertex(at);
    return null;
  }
  const shape = { variant: store.variant, from: at, to: at, path: [at] };
  const hold = { square: false, centre: false };
  store.setDraft(mergeMask(base, incomingMask(shape, target.sprite), mode));
  return { kind: 'shape', shape, base, mode, keys: freshKeys(event), hold };
};

export { beginSelectDrag };
