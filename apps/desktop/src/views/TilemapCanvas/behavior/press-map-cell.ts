/* @layer renderer-app @kind logic */
import { announce } from '../../../announce/announce';
import { ANNOUNCE_TEXT } from '../../../announce/announce.constants';
import { useToolStore } from '../../../stores/useToolStore';
import { MAP_TOOL_OF } from '../../../tilemap/tilemap.constants';
import type { MapKeyContext } from '../TilemapCanvas.type';
import { beginDrag } from './begin-drag';
import { finishDrag } from './finish-drag';

const pressMapCell = (context: MapKeyContext): boolean => {
  const { live, target, viewport } = context;
  const cell = live.current.hover;
  if (!context.active.current || !cell) return false;
  const held = live.current.drag;
  const drag = held ?? beginDrag(MAP_TOOL_OF[useToolStore.getState().tool], cell, target);
  if (drag && (held || drag.kind === 'stroke')) {
    finishDrag(drag, target);
    live.current.drag = null;
    announce(ANNOUNCE_TEXT.mapDone(cell.x, cell.y));
  } else if (drag) {
    live.current.drag = drag;
    announce(ANNOUNCE_TEXT.mapCorner(cell.x, cell.y));
  } else announce(ANNOUNCE_TEXT.mapActed(cell.x, cell.y));
  viewport.current?.redraw();
  return true;
};

export { pressMapCell };
