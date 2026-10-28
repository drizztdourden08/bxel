/* @layer renderer-app @kind logic */
import { cellKey } from '@bxel/document';
import type { MapLayer } from '@bxel/document';
import type { FrameImage } from '../sheet/sheet.type';
import { CELL_LIGHTNESS, CELL_SATURATION, GOLDEN_ANGLE, OPAQUE } from './layer-thumb.constants';

const channel = (hue: number, offset: number): number => {
  const k = (offset + hue / 30) % 12;
  const a = CELL_SATURATION * Math.min(CELL_LIGHTNESS, 1 - CELL_LIGHTNESS);
  return Math.round(255 * (CELL_LIGHTNESS - a * Math.max(-1, Math.min(k - 3, 9 - k, 1))));
};

const mapLayerImage = (layer: MapLayer, columns: number, rows: number): FrameImage => {
  const rgba = new Uint8ClampedArray(columns * rows * 4);
  layer.cells.forEach((cell, at) => {
    const key = cellKey(cell);
    if (key === 0) return;
    const hue = (key * GOLDEN_ANGLE) % 360;
    rgba.set([channel(hue, 0), channel(hue, 8), channel(hue, 4), OPAQUE], at * 4);
  });
  return { width: columns, height: rows, rgba };
};

export { mapLayerImage };
