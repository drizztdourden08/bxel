/* @layer renderer-app @kind logic */
import type { MapLayer } from '@bxel/document';
import { TILE_BAR_TEXT } from '../sub-components/TileBar.constants';

const mapLayerState = (layer: MapLayer | null | undefined): string => {
  if (layer?.locked) return TILE_BAR_TEXT.locked;
  return layer?.visible === false ? TILE_BAR_TEXT.hidden : '';
};

export { mapLayerState };
