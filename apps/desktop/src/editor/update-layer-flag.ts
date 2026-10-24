/* @layer renderer-app @kind logic */
import { COMMAND_NAME } from '@bxel/document';
import type { LayerId } from '@bxel/document';
import { currentTarget } from './current-target';
import type { LayerFlag } from './layer-flag.type';
import { LAYER_LABEL } from './layer-text.constants';
import { runLayer } from './run-layer';

const updateLayerFlag = (layerId: LayerId, flag: LayerFlag, value: boolean): void => {
  const target = currentTarget();
  if (!target) return;
  const options = { layer: { by: 'id', id: layerId }, [flag]: value };
  runLayer(target, LAYER_LABEL[flag], { name: COMMAND_NAME.layerUpdate, options });
};

export { updateLayerFlag };
