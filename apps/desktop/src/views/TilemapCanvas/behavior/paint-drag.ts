/* @layer renderer-app @kind logic */
import { lineCells } from '@bxel/document';
import type { PixelView } from '../../PixelViewport';
import type { MapLook, MapPaintState } from '../TilemapCanvas.type';
import { paintGhost } from './paint-ghost';
import { paintMove } from './paint-move';
import { paintRegion } from './paint-region';
import { spanRect } from './span-rect';

const paintDrag = (ctx: CanvasRenderingContext2D, view: PixelView, state: MapPaintState, look: MapLook): void => {
  const { drag } = state.live;
  if (!drag) return;
  if (drag.kind === 'stroke') {
    for (const cell of drag.cells) {
      if (drag.tool === 'place') paintGhost(ctx, state, cell);
      else if (drag.tool === 'scatter') paintRegion(ctx, view, state, { cells: { ...cell, width: 1, height: 1 }, style: { colour: look.cursor, dashed: true } });
      else paintRegion(ctx, view, state, { cells: { ...cell, width: 1, height: 1 }, style: { colour: look.erase, dashed: false } });
    }
    return;
  }
  if (drag.kind === 'line') {
    for (const cell of lineCells(drag.from, drag.to)) paintGhost(ctx, state, cell);
    return;
  }
  if (drag.kind === 'move') {
    paintMove(ctx, view, state, drag, look);
    return;
  }
  const style = { colour: drag.kind === 'rect' ? look.cursor : look.select, dashed: drag.kind !== 'rect' };
  paintRegion(ctx, view, state, { cells: spanRect(drag.from, drag.to), style });
};

export { paintDrag };
