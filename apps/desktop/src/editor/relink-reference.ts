/* @layer renderer-app @kind logic */
import { COMMAND_NAME } from '@bxel/document';
import { currentTarget } from './current-target';
import { LAYER_LABEL } from './layer-text.constants';
import { pickReferencePath } from './pick-reference-path';
import { runLayer } from './run-layer';

const relinkReference = async (id: string): Promise<void> => {
  const path = await pickReferencePath();
  const target = currentTarget();
  if (path === null || !target) return;
  runLayer(target, LAYER_LABEL.relink, { name: COMMAND_NAME.layerReferenceRelink, options: { layer: { by: 'id', id }, path } });
};

export { relinkReference };
