/* @layer renderer-app @kind logic */
import type { Layer } from '@bxel/document';
import type { LayerRow } from './stage-header.type';

const layerStateOf = (layer: Pick<Layer, 'lock' | 'visible'>): LayerRow['state'] => {
  if (layer.lock.pixels) return 'locked';
  return layer.visible ? '' : 'hidden';
};

export { layerStateOf };
