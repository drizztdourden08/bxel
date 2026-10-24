/* @layer renderer-app @kind logic */
import { COMMAND_NAME } from '@bxel/document';
import { LAYER_LABEL } from '../editor/layer-text.constants';
import { useSpriteStore } from '../stores/useSpriteStore';
import { runDocument } from './run-document';
import type { MismatchModel } from './sheet.type';
import { spritesTarget } from './sprites-target';

const addMissingLayers = (model: MismatchModel): void => {
  if (model.layerGaps.length === 0) return;
  const step = { name: COMMAND_NAME.layerAdd, targets: spritesTarget(model.layerGaps), options: { name: model.layerName } };
  if (runDocument(LAYER_LABEL.add, [step]) !== null) useSpriteStore.getState().setGap(null);
};

export { addMissingLayers };
