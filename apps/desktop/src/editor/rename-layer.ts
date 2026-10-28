/* @layer renderer-app @kind logic */
import type { LayerId } from '@bxel/document';
import { currentTarget } from './current-target';
import { layerErrorText } from './layer-error-text';
import { LAYER_LABEL } from './layer-text.constants';
import { runLayerUpdate } from './run-layer-update';

const tryRenameLayer = (layerId: LayerId, name: string): string | null => {
  const refused = runLayerUpdate([layerId], { name }, LAYER_LABEL.rename);
  const target = currentTarget();
  return refused && target ? layerErrorText(refused, target.sprite) : null;
};

export { tryRenameLayer };
