/* @layer renderer-app @kind logic */
import { layerKindOf } from '@bxel/document';
import { currentTarget } from '../editor/current-target';
import { useSpriteStore } from '../stores/useSpriteStore';
import { useToolStore } from '../stores/useToolStore';

const activateSheetLayer = (name: string): void => {
  const key = name.toLowerCase();
  const layer = currentTarget()?.sprite.layers.find((each) => layerKindOf(each) === 'pixel' && each.name.toLowerCase() === key);
  if (layer) useToolStore.getState().setLayer(layer.id);
  useSpriteStore.getState().setLayerScope('active');
};

export { activateSheetLayer };
