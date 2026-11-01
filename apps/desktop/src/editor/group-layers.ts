/* @layer renderer-app @kind logic */
import { COMMAND_NAME } from '@bxel/document';
import { currentTarget } from './current-target';
import { LAYER_LABEL, LAYER_REF } from './layer-text.constants';
import { runLayer } from './run-layer';
import { useLayerViewStore } from '../stores/useLayerViewStore';

const groupLayers = (ids: readonly string[]): void => {
  const target = currentTarget();
  if (!target || ids.length === 0) return;
  const layers = ids.map((id) => ({ by: 'id', id }));
  const done = runLayer(target, LAYER_LABEL.group, { name: COMMAND_NAME.layerGroup, options: { layers }, ref: LAYER_REF });
  const group = done?.created[LAYER_REF];
  if (group !== undefined) useLayerViewStore.getState().select([group], group);
};

export { groupLayers };
