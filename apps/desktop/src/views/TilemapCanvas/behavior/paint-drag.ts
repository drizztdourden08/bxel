/* @layer renderer-app @kind logic */
import type { PixelView } from '../../PixelViewport';
import type { MapLook, MapPaintState } from '../TilemapCanvas.type';
import { cellBox } from './cell-box';
import { paintBox } from './paint-box';
import { paintGhost } from './paint-ghost';
import { spanRect } from './span-rect';

const paintDrag = (ctx: CanvasRenderingContext2D, view: PixelView, state: MapPaintState, look: MapLook): void => {
  const { drag } = state.live;
  const { tileset } = state.target;
  if (!drag) return;
  if (drag.kind === 'stroke') {
    for (const cell of drag.cells) {
      if (drag.tool === 'place') paintGhost(ctx, state, cell);
      else paintBox(ctx, view, cellBox({ ...cell, width: 1, height: 1 }, tileset), { colour: look.erase, dashed: false });
    }
    return;
  }
  const box = cellBox(spanRect(drag.from, drag.to), tileset);
  paintBox(ctx, view, box, { colour: drag.kind === 'rect' ? look.cursor : look.select, dashed: drag.kind === 'select' });
};

export { paintDrag };
