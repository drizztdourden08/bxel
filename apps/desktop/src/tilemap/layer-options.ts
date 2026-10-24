/* @layer renderer-app @kind logic */
import type { MapTarget } from './tilemap.type';

const layerOptions = (target: MapTarget) => ({
  tilemap: target.tilemap.id,
  layer: { by: 'id' as const, id: target.layer.id },
});

export { layerOptions };
