/* @layer renderer-app @kind logic */
import type { MapLayer } from '@bxel/document';
import { MAP_TEXT } from '../ScopeBar.constants';

const mapLayerState = (layer: MapLayer | null | undefined): string => {
  if (layer?.locked) return MAP_TEXT.locked;
  return layer?.visible === false ? MAP_TEXT.hidden : '';
};

export { mapLayerState };
