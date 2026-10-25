/* @layer renderer-app @kind logic */
import { announce } from '../../../announce/announce';
import { ANNOUNCE_TEXT } from '../../../announce/announce.constants';
import { ARROW_DELTAS } from '../../../editor/selection/selection.constants';
import { useReadoutStore } from '../../../stores/useReadoutStore';
import { readCell } from '../../../tilemap/read-cell';
import type { MapKeyContext } from '../TilemapCanvas.type';
import { nextMapCell } from './next-map-cell';
import { targetGeometry } from './target-geometry';

const moveMapCursor = (key: string, context: MapKeyContext): boolean => {
  const delta = ARROW_DELTAS[key];
  const { live, target, viewport } = context;
  if (!delta) return false;
  const cell = nextMapCell(delta, context);
  const origin = targetGeometry(target).originOf(cell.x, cell.y);
  context.active.current = true;
  live.current.hover = cell;
  if (live.current.drag && live.current.drag.kind !== 'stroke') live.current.drag = { ...live.current.drag, to: cell };
  useReadoutStore.getState().setPointer(origin);
  viewport.current?.reveal(origin);
  viewport.current?.redraw();
  announce(ANNOUNCE_TEXT.mapCell(cell.x, cell.y, readCell(target.tilemap, target.layer, cell)?.key ?? 0));
  return true;
};

export { moveMapCursor };
