/* @layer renderer-app @kind logic */
import { announce } from '@drizztdourden08/brock-react';
import { ANNOUNCE_TEXT } from '../../../announce/announce.constants';
import type { MapKeyContext } from '../TilemapCanvas.type';
import { pressDragCell } from './press-drag-cell';
import { pressSpecialCell } from './press-special-cell';

const pressMapCell = (context: MapKeyContext): boolean => {
  const { live, viewport } = context;
  const cell = live.current.hover;
  if (!context.active.current || !cell) return false;
  if (pressSpecialCell(cell)) announce(ANNOUNCE_TEXT.mapActed(cell.x, cell.y));
  else pressDragCell(context, cell);
  viewport.current?.redraw();
  return true;
};

export { pressMapCell };
