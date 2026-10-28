/* @layer renderer-app @kind logic */
import type { PointerEvent } from 'react';
import type { CombineMode, MaskView, Point } from '@bxel/raster';
import { currentTarget } from '../../../editor/current-target';
import type { EditorTarget } from '../../../editor/editor.type';
import { insideSprite } from '../../../editor/inside-sprite';
import { addVertex } from '../../../editor/selection/add-vertex';
import { closePolygon } from '../../../editor/selection/close-polygon';
import { commitSelection } from '../../../editor/selection/commit-selection';
import { freshKeys } from '../../../editor/selection/fresh-keys';
import { incomingMask } from '../../../editor/selection/incoming-mask';
import { mergeMask } from '../../../editor/selection/merge-mask';
import { modeOf } from '../../../editor/selection/mode-of';
import { pointMask } from '../../../editor/selection/point-mask';
import { DOUBLE_CLICK, POLYGON_MIN_VERTICES } from '../../../editor/selection/selection.constants';
import { selectionMask } from '../../../editor/selection/selection-mask';
import type { SelectionSettings } from '../../../stores/selection-store.type';
import { useSelectionStore } from '../../../stores/useSelectionStore';
import type { PixelViewportHandle } from '../../PixelViewport';
import { beginFloatDrag } from './begin-float-drag';
import { MOVING_VARIANTS } from './begin-select-drag.constants';
import type { ActiveDrag } from './canvas-tools.type';
import { pixelAtEvent } from './pixel-at-event';
import { rawPixelAt } from './raw-pixel-at';

const nearFirst = (first: Point | undefined, at: Point): boolean => first !== undefined && Math.abs(first.x - at.x) <= 1 && Math.abs(first.y - at.y) <= 1;

const isInside = (base: MaskView | null, at: Point): boolean => base !== null && (base.bits[at.y * base.width + at.x] ?? 0) !== 0;

const pickPoint = (target: EditorTarget, store: SelectionSettings, base: MaskView | null, request: { at: Point; mode: CombineMode }): void => {
  const by = store.variant === 'wand' ? 'wand' : 'colour';
  if (insideSprite(target, request.at)) commitSelection(target, mergeMask(base, pointMask(target, by, request.at), request.mode));
};

const clickPolygon = (store: SelectionSettings, event: PointerEvent<HTMLElement>, request: { at: Point; mode: CombineMode }): void => {
  const closing = event.detail >= DOUBLE_CLICK || (store.vertices.length >= POLYGON_MIN_VERTICES && nearFirst(store.vertices[0], request.at));
  if (closing) closePolygon(request.mode);
  else addVertex(request.at);
};

const movesPixels = (store: SelectionSettings, mode: CombineMode, inside: boolean): boolean =>
  inside && mode === 'replace' && store.mode === 'replace' && MOVING_VARIANTS.includes(store.variant) && store.vertices.length === 0;

const beginShape = (target: EditorTarget, base: MaskView | null, request: { at: Point; mode: CombineMode; event: PointerEvent<HTMLElement> }): ActiveDrag => {
  const store = useSelectionStore.getState();
  const shape = { variant: store.variant, from: request.at, to: request.at, path: [request.at] };
  store.setDraft(mergeMask(base, incomingMask(shape, target.sprite), request.mode));
  return { kind: 'shape', shape, base, mode: request.mode, keys: freshKeys(request.event), hold: { square: false, centre: false } };
};

const beginSelectDrag = (viewport: PixelViewportHandle | null, event: PointerEvent<HTMLElement>): ActiveDrag | null => {
  const target = currentTarget();
  if (!target) return null;
  const store = useSelectionStore.getState();
  const at = pixelAtEvent(viewport, event);
  const mode = modeOf(event, store.mode);
  const base = selectionMask(target);
  const inside = isInside(base, at);
  if (inside && base && event.ctrlKey && event.altKey) return { kind: 'outline', start: rawPixelAt(viewport, event), base };
  if (movesPixels(store, mode, inside)) return beginFloatDrag(viewport, event);
  if (store.variant === 'wand' || store.variant === 'colour') {
    pickPoint(target, store, base, { at, mode });
    return null;
  }
  if (store.variant === 'polygon') {
    clickPolygon(store, event, { at, mode });
    return null;
  }
  return beginShape(target, base, { at, mode, event });
};

export { beginSelectDrag };
