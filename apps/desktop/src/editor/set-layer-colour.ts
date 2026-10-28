/* @layer renderer-app @kind logic */
import type { LayerId } from '@bxel/document';
import { LAYER_LABEL } from './layer-text.constants';
import { updateLayers } from './update-layers';

const setLayerColour = (ids: readonly LayerId[], colour: string | null): boolean => updateLayers(ids, { colour }, LAYER_LABEL.colour);

export { setLayerColour };
