/* @layer renderer-app @kind logic */
import { currentTarget } from './current-target';
import { moveLayer } from './move-layer';

const moveLayerBy = (direction: 'up' | 'down', layerId?: string): void => {
  const target = currentTarget();
  if (!target) return;
  const { layers } = target.sprite;
  const at = layers.findIndex((each) => each.id === (layerId ?? target.layerId));
  if (at < 0) return;
  const from = layers.length - 1 - at;
  const to = direction === 'up' ? from - 1 : from + 1;
  if (to >= 0 && to < layers.length) moveLayer(from, to);
};

export { moveLayerBy };
