/* @layer renderer-app @kind logic */
import { currentMap } from '../tilemap/current-map';
import { inMapPlace } from '../tilemap/in-map-place';
import { mapLayerActions } from '../tilemap/map-layer-actions';
import type { LayerSource } from './command-layers.type';
import { currentTarget } from './current-target';
import { spriteLayerActions } from './layer-actions';

const layerSource = (layerId?: string): LayerSource | null => {
  if (inMapPlace()) {
    const map = currentMap();
    return map ? { layers: map.tilemap.layers, active: layerId ?? map.layer.id, actions: mapLayerActions } : null;
  }
  const target = currentTarget();
  return target ? { layers: target.sprite.layers, active: layerId ?? target.layerId, actions: spriteLayerActions } : null;
};

export { layerSource };
