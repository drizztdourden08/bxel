/* @layer renderer-app @kind logic */
import type { PixelView } from '../../PixelViewport';
import type { MapLook, MapPaintState } from '../TilemapCanvas.type';
import { paintGhost } from './paint-ghost';
import { paintRegion } from './paint-region';
import { spanRect } from './span-rect';

const paintDrag = (ctx: CanvasRenderingContext2D, view: PixelView, state: MapPaintState, look: MapLook): void => {
  const { drag } = state.live;
  if (!drag) return;
  if (drag.kind === 'stroke') {
    for (const cell of drag.cells) {
      if (drag.tool === 'place') paintGhost(ctx, state, cell);
      else paintRegion(ctx, view, state, { cells: { ...cell, width: 1, height: 1 }, style: { colour: look.erase, dashed: false } });
    }
    return;
  }
  const style = { colour: drag.kind === 'rect' ? look.cursor : look.select, dashed: drag.kind === 'select' };
  paintRegion(ctx, view, state, { cells: spanRect(drag.from, drag.to), style });
};

export { paintDrag };
