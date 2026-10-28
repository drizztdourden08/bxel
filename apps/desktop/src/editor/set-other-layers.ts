/* @layer renderer-app @kind logic */
import type { LayerId } from '@bxel/document';
import { currentTarget } from './current-target';
import type { LayerFlag } from './layer-flag.type';
import { flagFields } from './flag-fields';
import { lockKindOf } from './layer-lock-kind';
import { LAYER_LABEL } from './layer-text.constants';
import { updateLayers } from './update-layers';

const setOtherLayers = (layerId: LayerId, flag: LayerFlag): void => {
  const target = currentTarget();
  const others = target?.sprite.layers.filter((layer) => layer.id !== layerId) ?? [];
  if (others.length === 0) return;
  const value = flag === 'visible' ? !others.some((layer) => layer.visible) : others.some((layer) => lockKindOf(layer) === 'none');
  updateLayers(others.map((layer) => layer.id), flagFields(flag, value), LAYER_LABEL[flag]);
};

export { setOtherLayers };
