/* @layer renderer-app @kind logic */
import type { PixelView } from '../../PixelViewport';
import type { MapLook, MapPaintState } from '../TilemapCanvas.type';
import { paintRegion } from './paint-region';
import { usedCells } from './used-cells';

const paintUses = (ctx: CanvasRenderingContext2D, view: PixelView, state: MapPaintState, look: MapLook): void => {
  if (state.hoverKey === null) return;
  const style = { colour: look.select, dashed: true };
  for (const cell of usedCells(state.target.tilemap, state.hoverKey)) paintRegion(ctx, view, state, { cells: { ...cell, width: 1, height: 1 }, style });
};

export { paintUses };
