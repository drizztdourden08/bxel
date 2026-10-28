/* @layer renderer-app @kind logic */
import { emptyMask, fullMask, invertMask, polygonMask } from '@bxel/raster';
import type { MaskView } from '@bxel/raster';
import type { EditorTarget } from '../../editor/editor.type';
import { selectionMask } from '../../editor/selection/selection-mask';
import { maskOfRuns } from './mask-of-runs';
import type { Shape } from './selection-step.type';

const rowsOfRect = (rect: { x: number; y: number; width: number; height: number }): [number, number, number][] =>
  Array.from({ length: rect.height }, (_, row): [number, number, number] => [rect.y + row, rect.x, rect.x + rect.width - 1]);

const incomingMask = (shape: Shape, target: EditorTarget): MaskView | null => {
  const size = { width: target.sprite.width, height: target.sprite.height };
  if (shape.kind === 'all') return fullMask(size);
  if (shape.kind === 'invert') return invertMask(selectionMask(target) ?? emptyMask(size));
  if (shape.kind === 'rect') return maskOfRuns(rowsOfRect(shape.rect), size);
  if (shape.kind === 'rects') return maskOfRuns(shape.rects.flatMap(rowsOfRect), size);
  if (shape.kind === 'polygon') return polygonMask(size, shape.points);
  if (shape.kind === 'runs') return maskOfRuns(shape.runs, size);
  return null;
};

export { incomingMask };
