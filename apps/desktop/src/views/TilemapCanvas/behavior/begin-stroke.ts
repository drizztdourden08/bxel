/* @layer renderer-app @kind logic */
import type { PointerEvent } from 'react';
import { heldKeys } from '../../../editor/selection/held-keys';
import { modeOf } from '../../../editor/selection/mode-of';
import type { TilemapSettings } from '../../../stores/tilemap-store.type';
import { useTilemapStore } from '../../../stores/useTilemapStore';
import { selectAtCell } from '../../../tilemap/select-at-cell';
import type { MapPress } from '../TilemapCanvas.type';
import { beginDrag } from './begin-drag';
import { cellInSelection } from './cell-in-selection';

const startsMove = (press: MapPress, keys: { shiftKey: boolean }, store: Pick<TilemapSettings, 'selectMode' | 'selection'>): boolean =>
  press.tool === 'select' && !keys.shiftKey && store.selectMode === 'replace' && cellInSelection(press.cells.here, store.selection);

const beginStroke = (event: PointerEvent<HTMLElement>, press: MapPress): void => {
  const store = useTilemapStore.getState();
  const { tool, cells, live } = press;
  const keys = heldKeys(event);
  const mode = modeOf(keys, store.selectMode);
  if (tool === 'select' && store.selectVariant !== 'rect') {
    selectAtCell(cells.here, mode);
    return;
  }
  const spanning = tool === 'rect' || tool === 'select' || tool === 'pick';
  live.current.drag = startsMove(press, keys, store) ? { kind: 'move', from: cells.here, to: cells.here, copy: keys.altKey } : beginDrag(tool, spanning ? cells.near : cells.here, press.target, mode);
  if (live.current.drag) event.currentTarget.setPointerCapture(event.pointerId);
};

export { beginStroke };
