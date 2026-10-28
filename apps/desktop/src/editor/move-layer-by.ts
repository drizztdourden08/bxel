/* @layer renderer-app @kind logic */
import { currentTarget } from './current-target';
import { layerPosition } from './layer-position';
import { moveLayer } from './move-layer';

const moveLayerBy = (direction: 'up' | 'down', layerId?: string): void => {
  const target = currentTarget();
  const place = target ? layerPosition(target.sprite.layers, layerId ?? target.layerId) : null;
  if (!place) return;
  const to = direction === 'up' ? place.from - 1 : place.from + 1;
  if (to >= 0 && to < place.total) moveLayer(place.from, to);
};

export { moveLayerBy };
