/* @layer renderer-app @kind logic */
import { announce } from '@drizztdourden08/brock-react';
import { ANNOUNCE_TEXT } from '../../../announce/announce.constants';
import { useTilemapStore } from '../../../stores/useTilemapStore';
import { useToolStore } from '../../../stores/useToolStore';
import { selectAtCell } from '../../../tilemap/select-at-cell';
import { MAP_TOOL_OF } from '../../../tilemap/tilemap.constants';
import type { MapKeyContext } from '../TilemapCanvas.type';
import { beginDrag } from './begin-drag';
import { finishDrag } from './finish-drag';
import { placePaste } from './place-paste';

const pressMapCell = (context: MapKeyContext): boolean => {
  const { live, target, viewport } = context;
  const cell = live.current.hover;
  if (!context.active.current || !cell) return false;
  const store = useTilemapStore.getState();
  const tool = MAP_TOOL_OF[useToolStore.getState().tool];
  if (store.paste) {
    placePaste(cell);
    announce(ANNOUNCE_TEXT.mapActed(cell.x, cell.y));
    viewport.current?.redraw();
    return true;
  }
  if (tool === 'select' && store.selectVariant !== 'rect') {
    selectAtCell(cell, store.selectMode);
    announce(ANNOUNCE_TEXT.mapActed(cell.x, cell.y));
    viewport.current?.redraw();
    return true;
  }
  const held = live.current.drag;
  const drag = held ?? beginDrag(tool, cell, target, store.selectMode);
  if (drag && (held || drag.kind === 'stroke' || drag.kind === 'pick')) {
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
