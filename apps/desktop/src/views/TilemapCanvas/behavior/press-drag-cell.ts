/* @layer renderer-app @kind logic */
import { announce } from '@drizztdourden08/brock-react';
import type { Point } from '@bxel/document';
import { ANNOUNCE_TEXT } from '../../../announce/announce.constants';
import { useTilemapStore } from '../../../stores/useTilemapStore';
import { useToolStore } from '../../../stores/useToolStore';
import { MAP_TOOL_OF } from '../../../tilemap/tilemap.constants';
import type { MapKeyContext } from '../TilemapCanvas.type';
import { beginDrag } from './begin-drag';
import { finishDrag } from './finish-drag';

const pressDragCell = (context: MapKeyContext, cell: Point): void => {
  const { live, target } = context;
  const held = live.current.drag;
  const drag = held ?? beginDrag(MAP_TOOL_OF[useToolStore.getState().tool], cell, target, useTilemapStore.getState().selectMode);
  if (drag && (held || drag.kind === 'stroke' || drag.kind === 'pick')) {
    finishDrag(drag, target);
    live.current.drag = null;
    announce(ANNOUNCE_TEXT.mapDone(cell.x, cell.y));
  } else if (drag) {
    live.current.drag = drag;
    announce(ANNOUNCE_TEXT.mapCorner(cell.x, cell.y));
  } else announce(ANNOUNCE_TEXT.mapActed(cell.x, cell.y));
};

export { pressDragCell };
