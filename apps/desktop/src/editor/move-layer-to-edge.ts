/* @layer renderer-app @kind logic */
import { currentTarget } from './current-target';
import { layerPosition } from './layer-position';
import { moveLayer } from './move-layer';

const moveLayerToEdge = (edge: 'top' | 'bottom', layerId?: string): void => {
  const target = currentTarget();
  const place = target ? layerPosition(target.sprite.layers, layerId ?? target.layerId) : null;
  if (!place) return;
  const to = edge === 'top' ? 0 : place.total - 1;
  if (place.from !== to) moveLayer(place.from, to);
};

export { moveLayerToEdge };
