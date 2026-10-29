/* @layer renderer-app @kind logic */
import { COMMAND_NAME } from '@bxel/document';
import type { Point } from '@bxel/document';
import { useTilemapStore } from '../stores/useTilemapStore';
import { clampBy } from './clamp-by';
import { layerOptions } from './layer-options';
import { runMap } from './run-map';
import { selectedMap } from './selected-map';
import { selectionDescriptor } from './selection-descriptor';
import { TILE_LABEL } from './tilemap.constants';

const moveCells = (by: Point, copy: boolean): boolean => {
  const picked = selectedMap();
  if (!picked) return false;
  const { target, selection } = picked;
  const step = clampBy(by, selection.rect, target.tilemap);
  if (step.x === 0 && step.y === 0) return false;
  const to = { x: selection.rect.x + step.x, y: selection.rect.y + step.y };
  const options = { ...layerOptions(target), from: selectionDescriptor(selection, target.tilemap), to };
  const name = copy ? COMMAND_NAME.mapCopy : COMMAND_NAME.mapMove;
  if (!runMap(copy ? TILE_LABEL.duplicate : TILE_LABEL.move, [{ name, targets: null, options }])) return false;
  useTilemapStore.getState().setSelection({ ...selection, rect: { ...selection.rect, ...to } });
  return true;
};

export { moveCells };
