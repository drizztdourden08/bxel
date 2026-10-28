/* @layer renderer-app @kind logic */
import { PIXEL_GRID_FROM } from '../views/PixelViewport/PixelViewport.constants';
import { CELL_GRID_MIN } from '../views/TilemapCanvas/TilemapCanvas.constants';
import type { Surface } from '../surface/surface.type';
import { MAJOR_MIN_GAP, TILE_MIN_GAP } from './canvas-look.constants';
import type { CanvasLook, GridFlags } from './canvas-look.type';

const pixelHidden = (flags: GridFlags, zoom: number, surface: Surface): boolean =>
  flags.pixel && (surface === 'sprite' || surface === 'tile') && zoom < PIXEL_GRID_FROM;

const majorHidden = (look: CanvasLook, flags: GridFlags, zoom: number, surface: Surface): boolean =>
  flags.major && (surface === 'sprite' || surface === 'tile') && look.majorLine.every * zoom < MAJOR_MIN_GAP;

const tileHidden = (look: CanvasLook, flags: GridFlags, zoom: number, surface: Surface): boolean => {
  if (!flags.tile) return false;
  if (surface === 'map') return Math.min(look.tileLine.every, look.tileLine.everyY ?? look.tileLine.every) * zoom < CELL_GRID_MIN;
  return look.tileLine.every * zoom < TILE_MIN_GAP;
};

const gridsHidden = (look: CanvasLook, flags: GridFlags, zoom: number, surface: Surface): boolean =>
  zoom > 0 && (pixelHidden(flags, zoom, surface) || majorHidden(look, flags, zoom, surface) || tileHidden(look, flags, zoom, surface));

export { gridsHidden };
