/* @layer renderer-app @kind logic */
import { COMMAND_NAME } from '@bxel/document';
import type { LayerId } from '@bxel/document';
import { useToolStore } from '../stores/useToolStore';
import { currentTarget } from './current-target';
import { selectedLayerIds } from './layer-selection';
import { LAYER_LABEL } from './layer-text.constants';
import { runLayerSteps } from './run-layer-steps';
import { spriteScope } from './sprite-scope';

const nearest = (kept: readonly LayerId[], all: readonly LayerId[], from: number): LayerId | undefined =>
  [...kept].sort((a, b) => Math.abs(all.indexOf(a) - from) - Math.abs(all.indexOf(b) - from) || all.indexOf(a) - all.indexOf(b))[0];

const deleteLayer = (): void => {
  const target = currentTarget();
  if (!target) return;
  const all = target.sprite.layers.map((layer) => layer.id);
  const ids = selectedLayerIds(target.sprite.layers, target.layerId);
  const next = nearest(all.filter((id) => !ids.includes(id)), all, all.indexOf(target.layerId));
  const label = ids.length > 1 ? LAYER_LABEL.deleteMany : LAYER_LABEL.remove;
  const steps = ids.map((id) => ({ name: COMMAND_NAME.layerDelete, targets: spriteScope(target), options: { layer: { by: 'id', id } } }));
  if (runLayerSteps(label, () => steps) && next) useToolStore.getState().setLayer(next);
};

export { deleteLayer };
