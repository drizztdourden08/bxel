/* @layer renderer-app @kind logic */
import type { Artwork, Tilemap } from '@bxel/document';
import { flatMapRgba } from '../views/TilemapCanvas/behavior/flat-map-rgba';
import { MAP_CANVASES } from './tilemap.constants';

const mapCanvas = (artwork: Artwork, tilemap: Tilemap): HTMLCanvasElement | null => {
  const made = MAP_CANVASES.get(artwork) ?? new Map<string, HTMLCanvasElement>();
  MAP_CANVASES.set(artwork, made);
  const hit = made.get(tilemap.id);
  if (hit) return hit;
  const flat = flatMapRgba(artwork, tilemap.id);
  if (!flat) return null;
  const canvas = document.createElement('canvas');
  canvas.width = flat.width;
  canvas.height = flat.height;
  canvas.getContext('2d')?.putImageData(new ImageData(flat.rgba, flat.width, flat.height), 0, 0);
  made.set(tilemap.id, canvas);
  return canvas;
};

export { mapCanvas };
