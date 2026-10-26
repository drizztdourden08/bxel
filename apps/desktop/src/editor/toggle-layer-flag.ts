/* @layer renderer-app @kind logic */
import { currentTarget } from './current-target';
import type { LayerFlag } from './layer-flag.type';
import { updateLayerFlag } from './update-layer-flag';

const toggleLayerFlag = (flag: LayerFlag, layerId?: string): void => {
  const target = currentTarget();
  const wanted = layerId ?? target?.layerId;
  const layer = target?.sprite.layers.find((each) => each.id === wanted);
  if (layer) updateLayerFlag(layer.id, flag, !layer[flag]);
};

export { toggleLayerFlag };
