/* @layer renderer-app @kind logic */
import { currentTarget } from './current-target';
import { selectedLayerIds } from './layer-selection';
import { mergeLayerDown } from './merge-layer-down';
import { mergeSelectedLayers } from './merge-selected-layers';

const mergeLayers = (): void => {
  const target = currentTarget();
  const ids = target ? selectedLayerIds(target.sprite.layers, target.layerId) : [];
  if (ids.length > 1) mergeSelectedLayers(ids);
  else mergeLayerDown();
};

export { mergeLayers };
