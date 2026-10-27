/* @layer core @kind constants */
import type { BundleId } from './catalogue.type';

const STEP_BUNDLE: Readonly<Record<string, BundleId>> = {
  pixels: 'edit_pixels',
  layer: 'edit_pixels',
  cel: 'edit_pixels',
  frame: 'edit_pixels',
  palette: 'edit_pixels',
  swatch: 'edit_pixels',
  ramp: 'edit_pixels',
  guide: 'edit_pixels',
  slice: 'edit_pixels',
  preset: 'edit_pixels',
  artwork: 'edit_pixels',
  animation: 'animation',
  tag: 'animation',
  sheet: 'sheets_sprites',
  sprite: 'sheets_sprites',
  map: 'tilemaps',
  tile: 'tilemaps',
  tilemap: 'tilemaps',
  tileset: 'tilemaps',
};

const ROUTED_BUNDLES: readonly BundleId[] = ['edit_pixels', 'animation', 'sheets_sprites', 'tilemaps'];

export { ROUTED_BUNDLES, STEP_BUNDLE };
