/* @layer renderer-app @kind logic */
import { emptyMask, fullMask, indexMask, invertMask, polygonMask } from '@bxel/raster';
import type { CombineMode, MaskView } from '@bxel/raster';
import { currentTarget } from '../../editor/current-target';
import type { EditorTarget } from '../../editor/editor.type';
import { celPixels } from '../../editor/selection/cel-pixels';
import { mergeMask } from '../../editor/selection/merge-mask';
import { pointMask } from '../../editor/selection/point-mask';
import { selectionMask } from '../../editor/selection/selection-mask';
import { setSelection } from '../../editor/selection/set-selection';
import { APP_TOOL_TEXT } from './app-tool.constants';
import type { SetViewInput } from './app-tool-input.type';
import { maskOfRuns } from './selection-runs';
import { viewFail } from './view-fail';
import type { ViewStep } from './view-steps.type';

type Shape = NonNullable<SetViewInput['selection']>['shape'];

const rowsOfRect = (rect: { x: number; y: number; width: number; height: number }): [number, number, number][] =>
  Array.from({ length: rect.height }, (_, row): [number, number, number] => [rect.y + row, rect.x, rect.x + rect.width - 1]);

const incomingOf = (shape: Shape, target: EditorTarget): MaskView | 'outside' => {
  const size = { width: target.sprite.width, height: target.sprite.height };
  if (shape.kind === 'all') return fullMask(size);
  if (shape.kind === 'invert') return invertMask(selectionMask(target) ?? emptyMask(size));
  if (shape.kind === 'rect') return maskOfRuns(rowsOfRect(shape.rect), size);
  if (shape.kind === 'rects') return maskOfRuns(shape.rects.flatMap(rowsOfRect), size);
  if (shape.kind === 'polygon') return polygonMask(size, shape.points);
  if (shape.kind === 'runs') return maskOfRuns(shape.runs, size);
  if (shape.kind === 'colour') return indexMask({ pixels: celPixels(target), width: size.width, height: size.height }, shape.index);
  if (shape.kind === 'wand') {
    const inside = shape.x >= 0 && shape.y >= 0 && shape.x < size.width && shape.y < size.height;
    return inside ? pointMask(target, 'wand', { x: shape.x, y: shape.y }, shape.connectivity) : 'outside';
  }
  return emptyMask(size);
};

const selectionStep: ViewStep = (patch) => {
  const { selection } = patch;
  if (!selection) return null;
  const target = currentTarget();
  if (!target) return viewFail(APP_TOOL_TEXT.noSelectionTarget, 'selection');
  const { shape } = selection;
  if (shape.kind === 'none') {
    setSelection(target, null);
    return null;
  }
  const incoming = incomingOf(shape, target);
  if (incoming === 'outside') return viewFail(APP_TOOL_TEXT.wandOutside, 'selection.shape');
  const op: CombineMode = shape.kind === 'all' || shape.kind === 'invert' ? 'replace' : selection.op;
  setSelection(target, mergeMask(selectionMask(target), incoming, op));
  return null;
};

export { selectionStep };
