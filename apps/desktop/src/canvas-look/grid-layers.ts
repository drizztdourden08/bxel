/* @layer renderer-app @kind logic */
import { MAJOR_MIN_GAP, TILE_MIN_GAP } from './canvas-look.constants';
import type { CanvasLook, GridFlags, GridLine } from './canvas-look.type';

const gridLayers = (look: CanvasLook, flags: GridFlags, zoom: number, pixelFrom: number): GridLine[] => {
  const layers: GridLine[] = [];
  if (flags.pixel && zoom >= pixelFrom) layers.push(look.pixelLine);
  if (flags.major && look.majorLine.every * zoom >= MAJOR_MIN_GAP) layers.push(look.majorLine);
  if (flags.tile && look.tileLine.every * zoom >= TILE_MIN_GAP) layers.push(look.tileLine);
  return layers;
};

export { gridLayers };
