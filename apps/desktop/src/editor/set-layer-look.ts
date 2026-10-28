/* @layer renderer-app @kind logic */
import type { LayerId } from '@bxel/document';
import { lockFields } from './layer-lock';
import type { LockKind } from './layer-lock.type';
import { LAYER_LABEL } from './layer-text.constants';
import { updateLayers } from './run-layer-update';

const setLayerLock = (ids: readonly LayerId[], kind: LockKind): boolean => updateLayers(ids, lockFields(kind), LAYER_LABEL.locked);

const setLayerColour = (ids: readonly LayerId[], colour: string | null): boolean => updateLayers(ids, { colour }, LAYER_LABEL.colour);

export { setLayerColour, setLayerLock };
