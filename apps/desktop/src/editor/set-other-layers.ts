/* @layer renderer-app @kind logic */
import type { LayerId } from '@bxel/document';
import { currentTarget } from './current-target';
import type { LayerFlag } from './layer-flag.type';
import { flagFields, lockKindOf } from './layer-lock';
import { LAYER_LABEL } from './layer-text.constants';
import { updateLayers } from './run-layer-update';

/**
 * Shift on the eye hides every other layer, or shows them all when they are all hidden already.
 * Alt on the lock locks every other layer, or unlocks them all when they are all locked already.
 */
const setOtherLayers = (layerId: LayerId, flag: LayerFlag): void => {
  const target = currentTarget();
  const others = target?.sprite.layers.filter((layer) => layer.id !== layerId) ?? [];
  if (others.length === 0) return;
  const value = flag === 'visible' ? !others.some((layer) => layer.visible) : others.some((layer) => lockKindOf(layer) === 'none');
  updateLayers(others.map((layer) => layer.id), flagFields(flag, value), LAYER_LABEL[flag]);
};

export { setOtherLayers };
