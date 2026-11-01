/* @layer renderer-app @kind logic */
import type { Artwork, Tilemap } from '@bxel/document';
import { trackPixels } from '../../../canvas-dirty/track-pixels';
import { flatMapRgba } from './flat-map-rgba';
import { highlightedMapRgba } from './highlighted-map-rgba';

const mapImage = (artwork: Artwork, tilemap: Tilemap, highlight: string | null = null): ImageData | null => {
  const at = highlight === null ? -1 : tilemap.layers.findIndex((layer) => layer.id === highlight);
  const flat = at < 0 ? flatMapRgba(artwork, tilemap.id) : highlightedMapRgba(artwork, tilemap.id, at);
  if (!flat) return null;
  trackPixels(flat.rgba);
  return new ImageData(flat.rgba, flat.width, flat.height);
};

export { mapImage };
