/* @layer renderer-app @kind logic */
import { COMMAND_NAME } from '@bxel/document';
import type { LayerId } from '@bxel/document';
import { currentTarget } from './current-target';
import { LAYER_LABEL } from './layer-text.constants';
import { runLayer } from './run-layer';

const renameLayer = (layerId: LayerId, name: string): boolean => {
  const target = currentTarget();
  if (!target) return false;
  const options = { layer: { by: 'id', id: layerId }, name };
  return runLayer(target, LAYER_LABEL.rename, { name: COMMAND_NAME.layerUpdate, options }) !== null;
};

export { renameLayer };
