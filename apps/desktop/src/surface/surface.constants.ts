/* @layer renderer-app @kind constants */
import type { Surface, SurfacePart } from './surface.type';

const PIXEL_PARTS: readonly SurfacePart[] = ['symmetry', 'view', 'tiled', 'playback', 'zoom', 'transform', 'options', 'paint', 'layers', 'guides'];

const SURFACE_PARTS: Readonly<Record<Surface, readonly SurfacePart[]>> = {
  none: [],
  sprite: PIXEL_PARTS,
  tile: PIXEL_PARTS,
  map: ['view', 'zoom', 'options', 'layers'],
  sheet: ['zoom'],
};

const WIDGET_CONTEXT = {
  paint: 'bxel-paint',
  options: 'bxel-options',
  sheet: 'bxel-sheet',
  tileset: 'bxel-tileset',
  view: 'bxel-view',
} as const;

export { SURFACE_PARTS, WIDGET_CONTEXT };
